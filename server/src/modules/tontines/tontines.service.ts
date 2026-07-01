import prisma from '../../config/database';
import { AppError } from '../../middlewares/errorHandler';
import { notificationsService } from '../notifications/notifications.service';

interface CreateTontineInput {
  name: string;
  description?: string;
  totalMembers: number;
  contributionAmount: number;
  currency?: string;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  startDate: string;
  rules?: string;
  members: Array<{
    name: string;
    phone?: string;
    email?: string;
    position: number;
  }>;
}

interface AddContributionInput {
  memberId: string;
  amount: number;
  round: number;
  paymentMethod?: string;
  notes?: string;
}

class TontinesService {
  // Obtenir toutes les tontines d'un utilisateur
  async getTontines(userId: string) {
    const tontines = await prisma.tontine.findMany({
      where: { userId },
      include: {
        members: {
          orderBy: { position: 'asc' },
        },
        _count: {
          select: {
            contributions: true,
            rotations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tontines.map((tontine: any) => ({
      ...tontine,
      contributionsCount: tontine._count.contributions,
      rotationsCount: tontine._count.rotations,
      progress: (tontine.currentRound / tontine.totalMembers) * 100,
    }));
  }

  // Obtenir une tontine par ID
  async getTontineById(userId: string, tontineId: string) {
    const tontine = await prisma.tontine.findFirst({
      where: { id: tontineId, userId },
      include: {
        members: {
          orderBy: { position: 'asc' },
          include: {
            contributions: {
              orderBy: { paidAt: 'desc' },
            },
          },
        },
        contributions: {
          include: {
            member: true,
          },
          orderBy: { paidAt: 'desc' },
        },
        rotations: {
          include: {
            member: true,
          },
          orderBy: { round: 'desc' },
        },
      },
    });

    if (!tontine) {
      throw new AppError('Tontine not found', 404);
    }

    // Vérifier et créer des notifications pour les paiements dus
    await this.checkAndCreatePaymentNotifications(userId, tontine);

    return tontine;
  }

  // Créer une nouvelle tontine
  async createTontine(userId: string, data: CreateTontineInput) {
    const { members, ...tontineData } = data;

    // Valider que le nombre de membres correspond
    if (members.length !== data.totalMembers) {
      throw new AppError(
        `Le nombre de membres (${members.length}) ne correspond pas au total attendu (${data.totalMembers})`,
        400
      );
    }

    // Valider que les positions sont uniques et séquentielles
    const positions = members.map((m) => m.position).sort((a, b) => a - b);
    const expectedPositions = Array.from({ length: data.totalMembers }, (_, i) => i + 1);
    if (JSON.stringify(positions) !== JSON.stringify(expectedPositions)) {
      throw new AppError(
        'Les positions des membres doivent être uniques et séquentielles (1, 2, 3, ...)',
        400
      );
    }

    // Calculer la prochaine date de paiement
    const startDate = new Date(data.startDate);
    const nextPaymentDate = this.calculateNextPaymentDate(startDate, data.frequency);

    const tontine = await prisma.tontine.create({
      data: {
        ...tontineData,
        userId,
        currency: data.currency || 'XOF',
        startDate: new Date(data.startDate),
        nextPaymentDate,
        members: {
          create: members.map((member) => ({
            name: member.name,
            phone: member.phone,
            email: member.email,
            position: member.position,
          })),
        },
      },
      include: {
        members: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return tontine;
  }

  // Ajouter une contribution
  async addContribution(userId: string, tontineId: string, data: AddContributionInput) {
    // Vérifier que la tontine appartient à l'utilisateur
    const tontine = await this.getTontineById(userId, tontineId);

    if (tontine.status !== 'ACTIVE') {
      throw new AppError('Cette tontine n\'est plus active', 400);
    }

    // Vérifier que le membre existe
    const member = tontine.members.find((m: any) => m.id === data.memberId);
    if (!member) {
      throw new AppError('Membre non trouvé', 404);
    }

    // Créer la contribution
    const contribution = await prisma.tontineContribution.create({
      data: {
        tontineId,
        memberId: data.memberId,
        amount: data.amount,
        round: data.round,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      },
      include: {
        member: true,
      },
    });

    // Mettre à jour le total payé par le membre
    await prisma.tontineMember.update({
      where: { id: data.memberId },
      data: {
        totalPaid: { increment: data.amount },
      },
    });

    // Vérifier si tout le monde a payé pour ce tour
    await this.checkAndCreateRotation(userId, tontineId, data.round);

    return contribution;
  }

  // Vérifier et créer une rotation si tout le monde a payé
  private async checkAndCreateRotation(userId: string, tontineId: string, round: number) {
    const tontine = await this.getTontineById(userId, tontineId);

    // Compter les contributions pour ce tour
    const contributionsForRound = await prisma.tontineContribution.count({
      where: {
        tontineId,
        round,
        isPaid: true,
      },
    });

    // Si tout le monde a payé (nombre de contributions = nombre de membres actifs)
    const activeMembers = tontine.members.filter((m: any) => m.isActive);
    if (contributionsForRound === activeMembers.length) {
      // Vérifier qu'une rotation n'existe pas déjà
      const existingRotation = await prisma.tontineRotation.findUnique({
        where: {
          tontineId_round: {
            tontineId,
            round,
          },
        },
      });

      if (!existingRotation) {
        // Trouver le membre qui doit recevoir (position = round)
        const recipientMember = tontine.members.find((m: any) => m.position === round);

        if (recipientMember) {
          // Calculer le montant total
          const totalAmount = Number(tontine.contributionAmount) * activeMembers.length;

          // Créer la rotation
          await prisma.tontineRotation.create({
            data: {
              tontineId,
              memberId: recipientMember.id,
              round,
              totalAmount,
            },
          });

          // Marquer le membre comme ayant reçu
          await prisma.tontineMember.update({
            where: { id: recipientMember.id },
            data: {
              hasReceived: true,
              receivedAt: new Date(),
            },
          });

          // Créer une notification pour le membre qui reçoit
          await notificationsService.createTontineTurnToReceiveNotification(
            userId,
            tontineId,
            tontine.name,
            totalAmount,
            tontine.currency,
            round
          );

          // Mettre à jour le tour actuel de la tontine
          await prisma.tontine.update({
            where: { id: tontineId },
            data: {
              currentRound: round + 1,
              nextPaymentDate: this.calculateNextPaymentDate(
                new Date(),
                tontine.frequency
              ),
            },
          });

          // Si c'était le dernier tour, marquer la tontine comme complétée
          if (round === tontine.totalMembers) {
            await prisma.tontine.update({
              where: { id: tontineId },
              data: {
                status: 'COMPLETED',
                endDate: new Date(),
              },
            });
          }
        }
      }
    }
  }

  // Calculer la prochaine date de paiement
  private calculateNextPaymentDate(currentDate: Date, frequency: string): Date {
    const nextDate = new Date(currentDate);

    switch (frequency) {
      case 'WEEKLY':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'BIWEEKLY':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'MONTHLY':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
    }

    return nextDate;
  }

  // Vérifier et créer des notifications pour les paiements dus
  private async checkAndCreatePaymentNotifications(userId: string, tontine: any) {
    // Si la tontine est terminée, pas de notification
    if (tontine.status === 'COMPLETED') {
      return;
    }

    const currentRound = tontine.currentRound;
    const nextPaymentDate = new Date(tontine.nextPaymentDate);
    const today = new Date();
    
    // Calculer les jours jusqu'au paiement
    const daysUntilPayment = Math.ceil(
      (nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Notifier 3 jours avant la date limite
    if (daysUntilPayment <= 3 && daysUntilPayment > 0) {
      // Vérifier quels membres n'ont pas encore payé pour le round actuel
      const membersWhoPaid = await prisma.tontineContribution.findMany({
        where: {
          tontineId: tontine.id,
          round: currentRound,
        },
        select: { memberId: true },
      });

      const paidMemberIds = membersWhoPaid.map((c) => c.memberId);

      // Membres actifs qui n'ont pas payé
      const membersWhoNeedToPay = tontine.members.filter(
        (m: any) => m.isActive && !paidMemberIds.includes(m.id)
      );

      // Pour chaque membre qui doit payer, créer une notification
      if (membersWhoNeedToPay.length > 0) {
        await notificationsService.createTontinePaymentNotification(
          userId,
          tontine.id,
          tontine.name,
          tontine.contributionAmount,
          tontine.currency,
          nextPaymentDate
        );
      }
    }

    // Notifier si la date est dépassée et qu'il y a des membres qui n'ont pas payé
    if (daysUntilPayment < 0) {
      const membersWhoPaid = await prisma.tontineContribution.findMany({
        where: {
          tontineId: tontine.id,
          round: currentRound,
        },
        select: { memberId: true },
      });

      const paidMemberIds = membersWhoPaid.map((c) => c.memberId);
      const membersWhoNeedToPay = tontine.members.filter(
        (m: any) => m.isActive && !paidMemberIds.includes(m.id)
      );

      if (membersWhoNeedToPay.length > 0) {
        await notificationsService.createTontinePaymentNotification(
          userId,
          tontine.id,
          tontine.name,
          tontine.contributionAmount,
          tontine.currency,
          nextPaymentDate
        );
      }
    }
  }

  // Supprimer une contribution
  async deleteContribution(userId: string, tontineId: string, contributionId: string) {
    // Vérifier que la tontine appartient à l'utilisateur
    await this.getTontineById(userId, tontineId);

    // Récupérer la contribution
    const contribution = await prisma.tontineContribution.findUnique({
      where: { id: contributionId },
      include: { member: true },
    });

    if (!contribution) {
      throw new AppError('Contribution non trouvée', 404);
    }

    if (contribution.tontineId !== tontineId) {
      throw new AppError('Cette contribution n\'appartient pas à cette tontine', 403);
    }

    // Supprimer la contribution
    await prisma.tontineContribution.delete({
      where: { id: contributionId },
    });

    // Mettre à jour le total payé par le membre
    await prisma.tontineMember.update({
      where: { id: contribution.memberId },
      data: {
        totalPaid: { decrement: contribution.amount },
      },
    });

    return { message: 'Contribution supprimée avec succès' };
  }

  // Mettre à jour une tontine
  async updateTontine(
    userId: string,
    tontineId: string,
    data: Partial<CreateTontineInput>
  ) {
    // Vérifier que la tontine appartient à l'utilisateur
    await this.getTontineById(userId, tontineId);

    const { members, ...updateData } = data;

    const tontine = await prisma.tontine.update({
      where: { id: tontineId },
      data: {
        ...updateData,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
      },
      include: {
        members: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return tontine;
  }

  // Supprimer une tontine
  async deleteTontine(userId: string, tontineId: string) {
    // Vérifier que la tontine appartient à l'utilisateur
    await this.getTontineById(userId, tontineId);

    await prisma.tontine.delete({
      where: { id: tontineId },
    });
  }

  // Obtenir les statistiques d'une tontine
  async getTontineStats(userId: string, tontineId: string) {
    const tontine = await this.getTontineById(userId, tontineId);

    const totalContributions = await prisma.tontineContribution.aggregate({
      where: { tontineId },
      _sum: { amount: true },
      _count: true,
    });

    const contributionsByMember = await prisma.tontineContribution.groupBy({
      by: ['memberId'],
      where: { tontineId },
      _sum: { amount: true },
      _count: true,
    });

    return {
      totalAmount: totalContributions._sum.amount || 0,
      totalContributions: totalContributions._count,
      currentRound: tontine.currentRound,
      totalRounds: tontine.totalMembers,
      progress: (tontine.currentRound / tontine.totalMembers) * 100,
      nextPaymentDate: tontine.nextPaymentDate,
      status: tontine.status,
      memberStats: contributionsByMember,
    };
  }
}

export default new TontinesService();
