import prisma from '../../config/database';
import type { CreateBillSplitRequest, UpdateBillSplitRequest, RecordPaymentRequest } from '@budgetwise/shared';

export class BillSplitService {
  /**
   * Créer un nouveau partage de facture
   */
  async createBillSplit(userId: string, data: CreateBillSplitRequest) {
    const { title, description, totalAmount, participants } = data;

    // Vérifier que le total des parts correspond au montant total
    const totalShares = participants.reduce((sum, p) => sum + p.shareAmount, 0);
    
    if (Math.abs(totalShares - totalAmount) > 0.01) {
      throw new Error(`Le total des parts (${totalShares}) ne correspond pas au montant total (${totalAmount})`);
    }

    const billSplit = await prisma.billSplit.create({
      data: {
        userId,
        title,
        description,
        totalAmount,
        participants: {
          create: participants,
        },
      },
      include: {
        participants: true,
        payments: true,
      },
    });

    return billSplit;
  }

  /**
   * Obtenir tous les partages de facture d'un utilisateur
   */
  async getUserBillSplits(userId: string) {
    const billSplits = await prisma.billSplit.findMany({
      where: { userId },
      include: {
        participants: true,
        payments: {
          include: {
            participant: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return billSplits;
  }

  /**
   * Obtenir un partage de facture spécifique
   */
  async getBillSplit(id: string) {
    const billSplit = await prisma.billSplit.findUnique({
      where: { id },
      include: {
        participants: true,
        payments: {
          include: {
            participant: true,
          },
        },
      },
    });

    if (!billSplit) {
      throw new Error('Partage de facture non trouvé');
    }

    return billSplit;
  }

  /**
   * Mettre à jour un partage de facture
   */
  async updateBillSplit(id: string, userId: string, data: UpdateBillSplitRequest) {
    const billSplit = await prisma.billSplit.update({
      where: {
        id,
        userId,
      },
      data,
      include: {
        participants: true,
        payments: true,
      },
    });

    return billSplit;
  }

  /**
   * Enregistrer un paiement
   */
  async recordPayment(billSplitId: string, userId: string, data: RecordPaymentRequest) {
    const { participantId, amount, paymentMethod, notes } = data;

    // Vérifier que le participant existe et appartient au bill split
    const participant = await prisma.billParticipant.findFirst({
      where: {
        id: participantId,
        billSplitId,
      },
    });

    if (!participant) {
      throw new Error('Participant non trouvé');
    }

    // Vérifier que le montant ne dépasse pas la part du participant
    const existingPayments = await prisma.billPayment.findMany({
      where: {
        participantId,
        billSplitId,
      },
    });

    const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = participant.shareAmount - totalPaid;

    // Ajuster le montant au reste exact si la différence est minime (< 1 XOF)
    let finalAmount = amount;
    if (Math.abs(amount - remaining) < 1 && amount >= remaining - 1) {
      finalAmount = remaining;
    }

    if (finalAmount > remaining + 0.01) {
      throw new Error(`Le montant (${amount}) dépasse le reste à payer (${remaining.toFixed(2)})`);
    }

    // Créer le paiement
    const payment = await prisma.billPayment.create({
      data: {
        billSplitId,
        participantId,
        amount: finalAmount,
        paymentMethod,
        notes,
      },
    });

    // Mettre à jour le statut du participant si la part est complètement payée
    const newTotalPaid = totalPaid + finalAmount;
    if (Math.abs(newTotalPaid - participant.shareAmount) < 0.01) {
      await prisma.billParticipant.update({
        where: { id: participantId },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
      });
    }

    // Mettre à jour le statut du bill split
    await this.updateBillSplitStatus(billSplitId);

    return payment;
  }

  /**
   * Mettre à jour le statut du bill split
   */
  private async updateBillSplitStatus(billSplitId: string) {
    const participants = await prisma.billParticipant.findMany({
      where: { billSplitId },
    });

    const paidCount = participants.filter((p) => p.isPaid).length;
    const totalCount = participants.length;

    let status: string;
    if (paidCount === 0) {
      status = 'PENDING';
    } else if (paidCount === totalCount) {
      status = 'COMPLETED';
    } else {
      status = 'PARTIAL';
    }

    await prisma.billSplit.update({
      where: { id: billSplitId },
      data: { status },
    });
  }

  /**
   * Supprimer un partage de facture
   */
  async deleteBillSplit(id: string, userId: string) {
    await prisma.billSplit.delete({
      where: {
        id,
        userId,
      },
    });
  }

  /**
   * Partager une facture également entre les participants
   */
  async splitEqually(userId: string, title: string, totalAmount: number, participantNames: string[]) {
    const shareAmount = totalAmount / participantNames.length;

    const participants = participantNames.map((name) => ({
      name,
      shareAmount,
    }));

    return await this.createBillSplit(userId, {
      title,
      totalAmount,
      participants,
    });
  }

  /**
   * Obtenir les statistiques d'un bill split
   */
  async getBillSplitStats(billSplitId: string) {
    const billSplit = await this.getBillSplit(billSplitId);

    const totalPaid = billSplit.payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPending = billSplit.totalAmount - totalPaid;
    const paidParticipants = billSplit.participants.filter((p) => p.isPaid).length;
    const pendingParticipants = billSplit.participants.length - paidParticipants;

    return {
      totalAmount: billSplit.totalAmount,
      totalPaid,
      totalPending,
      paidParticipants,
      pendingParticipants,
      completionPercentage: (totalPaid / billSplit.totalAmount) * 100,
    };
  }
}

export default new BillSplitService();
