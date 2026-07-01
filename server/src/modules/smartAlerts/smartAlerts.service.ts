import prisma from '../../config/database';
import type { CreateAlertRequest } from '@budgetwise/shared';
import { startOfMonth, endOfMonth } from 'date-fns';

export class SmartAlertsService {
  /**
   * Créer une alerte intelligente
   */
  async createAlert(userId: string, data: CreateAlertRequest) {
    return await prisma.smartAlert.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  /**
   * Obtenir les alertes d'un utilisateur
   */
  async getUserAlerts(userId: string, unreadOnly: boolean = false) {
    const where: any = { userId };
    
    if (unreadOnly) {
      where.isRead = false;
    }

    return await prisma.smartAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Marquer une alerte comme lue
   */
  async markAsRead(alertId: string, userId: string) {
    return await prisma.smartAlert.update({
      where: {
        id: alertId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Marquer toutes les alertes comme lues
   */
  async markAllAsRead(userId: string) {
    return await prisma.smartAlert.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Générer des alertes intelligentes basées sur les données utilisateur
   */
  async generateSmartAlerts(userId: string) {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    // Récupérer les budgets du mois
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
      include: {
        category: true,
      },
    });

    // Alertes pour les budgets
    for (const budget of budgets) {
      // Récupérer les transactions pour ce budget
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          categoryId: budget.categoryId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const spent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const budgetAmount = Number(budget.amount);
      const percentage = (spent / budgetAmount) * 100;
      const remaining = budgetAmount - spent;
      const categoryName = budget.category?.name || 'Non catégorisé';

      // Budget dépassé
      if (percentage >= 100 && !await this.alertExists(userId, 'BUDGET_EXCEEDED', budget.id)) {
        await this.createAlert(userId, {
          type: 'BUDGET_EXCEEDED',
          severity: 'critical',
          title: `Budget dépassé : ${categoryName}`,
          message: `Vous avez dépassé votre budget ${categoryName} de ${Math.round(spent - budgetAmount)} XOF (${Math.round(percentage)}%).`,
          actionUrl: '/budgets',
          actionLabel: 'Voir les budgets',
          metadata: { budgetId: budget.id, percentage, spent, limit: budgetAmount },
        });
      }
      // Budget à 80%+
      else if (percentage >= 80 && percentage < 100 && !await this.alertExists(userId, 'BUDGET_WARNING', budget.id)) {
        const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        await this.createAlert(userId, {
          type: 'BUDGET_WARNING',
          severity: 'warning',
          title: `Budget bientôt atteint : ${categoryName}`,
          message: `Vous avez utilisé ${Math.round(percentage)}% de votre budget ${categoryName}. Il reste ${Math.round(remaining)} XOF pour ${daysLeft} jours.`,
          actionUrl: '/budgets',
          actionLabel: 'Voir les budgets',
          metadata: { budgetId: budget.id, percentage, remaining, daysLeft },
        });
      }
    }

    // Analyser les dépenses inhabituelles
    await this.detectUnusualSpending(userId);

    // Opportunités d'épargne
    await this.detectSavingOpportunities(userId);

    // Progrès sur les objectifs
    await this.checkGoalsProgress(userId);
  }

  /**
   * Vérifier si une alerte existe déjà
   */
  private async alertExists(userId: string, type: string, entityId: string): Promise<boolean> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const count = await prisma.smartAlert.count({
      where: {
        userId,
        type,
        createdAt: { gte: oneWeekAgo },
        metadata: {
          path: ['budgetId'],
          equals: entityId,
        },
      },
    });

    return count > 0;
  }

  /**
   * Détecter les dépenses inhabituelles
   */
  private async detectUnusualSpending(userId: string) {
    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);

    // Récupérer les transactions récentes
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        date: { gte: last7Days },
      },
      include: {
        category: true,
      },
    });

    // Récupérer les transactions des 30 derniers jours pour comparaison
    const historicalTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: last30Days,
          lt: last7Days,
        },
      },
    });

    // Calculer la moyenne historique
    const avgAmount = historicalTransactions.length > 0
      ? historicalTransactions.reduce((sum, t) => sum + Number(t.amount), 0) / historicalTransactions.length
      : 0;

    // Détecter les dépenses > 2x la moyenne
    for (const transaction of recentTransactions) {
      const transactionAmount = Number(transaction.amount);
      if (avgAmount > 0 && transactionAmount > avgAmount * 2) {
        const alreadyExists = await prisma.smartAlert.count({
          where: {
            userId,
            type: 'UNUSUAL_SPENDING',
            metadata: {
              path: ['transactionId'],
              equals: transaction.id,
            },
          },
        });

        if (alreadyExists === 0) {
          await this.createAlert(userId, {
            type: 'UNUSUAL_SPENDING',
            severity: 'warning',
            title: 'Dépense inhabituelle détectée',
            message: `Une dépense de ${Math.round(transactionAmount)} XOF en ${transaction.category?.name || 'Divers'} a été détectée. C'est ${Math.round((transactionAmount / avgAmount) * 100)}% plus élevé que votre moyenne.`,
            actionUrl: '/transactions',
            actionLabel: 'Voir les transactions',
            metadata: {
              transactionId: transaction.id,
              amount: transactionAmount,
              avgAmount,
            },
          });
        }
      }
    }
  }

  /**
   * Détecter les opportunités d'épargne
   */
  private async detectSavingOpportunities(userId: string) {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    // Récupérer les budgets bien gérés
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
      include: {
        category: true,
      },
    });

    let totalSaved = 0;
    const wellManagedCategories: string[] = [];

    for (const budget of budgets) {
      // Récupérer les transactions pour ce budget
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          categoryId: budget.categoryId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const spent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const budgetAmount = Number(budget.amount);
      const saved = budgetAmount - spent;
      
      if (saved > 0 && spent / budgetAmount < 0.8) {
        totalSaved += saved;
        wellManagedCategories.push(budget.category?.name || 'Divers');
      }
    }

    if (totalSaved > 0 && wellManagedCategories.length > 0) {
      const alreadyExists = await prisma.smartAlert.count({
        where: {
          userId,
          type: 'SAVING_OPPORTUNITY',
          createdAt: {
            gte: startDate,
          },
        },
      });

      if (alreadyExists === 0) {
        await this.createAlert(userId, {
          type: 'SAVING_OPPORTUNITY',
          severity: 'info',
          title: 'Excellente gestion budgétaire !',
          message: `Vous avez économisé ${Math.round(totalSaved)} XOF ce mois grâce à une bonne gestion de vos budgets (${wellManagedCategories.join(', ')}). Pensez à transférer cet argent vers vos objectifs d'épargne !`,
          actionUrl: '/goals',
          actionLabel: 'Voir les objectifs',
          metadata: {
            totalSaved,
            categories: wellManagedCategories,
          },
        });
      }
    }
  }

  /**
   * Vérifier les progrès sur les objectifs
   */
  private async checkGoalsProgress(userId: string) {
    const goals = await prisma.savingGoal.findMany({
      where: {
        userId,
        status: { in: ['IN_PROGRESS', 'ACTIVE'] },
      },
    });

    for (const goal of goals) {
      const currentAmount = Number(goal.currentAmount);
      const targetAmount = Number(goal.targetAmount);
      const progress = (currentAmount / targetAmount) * 100;

      // Objectif bientôt atteint (90%+)
      if (progress >= 90 && progress < 100) {
        const alreadyExists = await prisma.smartAlert.count({
          where: {
            userId,
            type: 'GOAL_PROGRESS',
            metadata: {
              path: ['goalId'],
              equals: goal.id,
            },
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        });

        if (alreadyExists === 0) {
          const remaining = targetAmount - currentAmount;
          
          await this.createAlert(userId, {
            type: 'GOAL_PROGRESS',
            severity: 'info',
            title: `Objectif bientôt atteint : ${goal.name}`,
            message: `Plus que ${Math.round(remaining)} XOF pour atteindre votre objectif "${goal.name}" ! Vous êtes à ${Math.round(progress)}%.`,
            actionUrl: '/goals',
            actionLabel: 'Voir les objectifs',
            metadata: {
              goalId: goal.id,
              progress,
              remaining,
            },
          });
        }
      }
    }
  }

  /**
   * Supprimer une alerte
   */
  async deleteAlert(alertId: string, userId: string) {
    return await prisma.smartAlert.delete({
      where: {
        id: alertId,
        userId,
      },
    });
  }
}

export default new SmartAlertsService();
