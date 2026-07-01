import prisma from '@/config/database';
import {
  InsightData,
  Prediction,
  Anomaly,
  Recommendation,
  CategoryTrend,
  SpendingPattern,
  BudgetHealth,
} from '@budgetwise/shared';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

class InsightsService {
  /**
   * Génère tous les insights pour un utilisateur
   */
  async generateInsights(userId: string, month?: number, year?: number): Promise<InsightData> {
    const targetDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()));
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);

    const [predictions, anomalies, recommendations, trends, patterns, budgetHealth] = await Promise.all([
      this.generatePredictions(userId, monthStart, monthEnd),
      this.detectAnomalies(userId, monthStart, monthEnd),
      this.generateRecommendations(userId, monthStart, monthEnd),
      this.analyzeCategoryTrends(userId, monthStart, monthEnd),
      this.analyzeSpendingPatterns(userId, monthStart, monthEnd),
      this.calculateBudgetHealth(userId, monthStart, monthEnd),
    ]);

    return {
      predictions,
      anomalies,
      recommendations,
      trends,
      spendingPatterns: patterns,
      budgetHealth,
    };
  }

  /**
   * Génère des prédictions intelligentes
   */
  private async generatePredictions(
    userId: string,
    monthStart: Date,
    monthEnd: Date
  ): Promise<Prediction[]> {
    const predictions: Prediction[] = [];
    const now = new Date();

    // Récupérer les transactions du mois en cours
    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: monthStart, lte: monthEnd },
        type: 'EXPENSE',
      },
      include: { category: true },
    });

    // Récupérer les budgets actifs
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        startDate: { lte: monthEnd },
        endDate: { gte: monthStart },
      },
      include: { category: true },
    });

    // Calculer les dépenses actuelles
    const currentSpending = currentMonthTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

    // Prédiction de fin de mois
    const daysElapsed = Math.max(1, (now.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysInMonth = (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24);
    const dailyAverage = currentSpending / daysElapsed;
    const projectedMonthEnd = dailyAverage * daysInMonth;

    if (daysElapsed < daysInMonth && daysElapsed > 3) {
      predictions.push({
        id: 'pred-month-end',
        type: 'MONTH_END_SPENDING',
        title: 'Prédiction de fin de mois',
        description: `Basé sur vos dépenses actuelles, vous devriez dépenser environ ${Math.round(
          projectedMonthEnd
        )} XOF ce mois`,
        predictedAmount: projectedMonthEnd,
        confidence: Math.min(95, 60 + daysElapsed * 2),
        severity: 'info',
        icon: '📊',
      });
    }

    // Prédictions de dépassement de budget
    for (const budget of budgets) {
      const budgetTransactions = currentMonthTransactions.filter(
        (t) => t.categoryId === budget.categoryId
      );
      const spent = budgetTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const budgetAmount = Number(budget.amount);
      const projectedCategorySpending = (spent / daysElapsed) * daysInMonth;

      if (projectedCategorySpending > budgetAmount * 0.9) {
        const overrun = projectedCategorySpending - budgetAmount;
        predictions.push({
          id: `pred-budget-${budget.id}`,
          type: 'BUDGET_OVERRUN',
          title: `Risque de dépassement : ${budget.category?.name || 'Budget'}`,
          description: `Vous risquez de dépasser ce budget de ${Math.round(overrun)} XOF`,
          predictedAmount: projectedCategorySpending,
          confidence: Math.min(90, 50 + daysElapsed * 3),
          category: budget.category?.name,
          severity: overrun > budgetAmount * 0.2 ? 'danger' : 'warning',
          icon: '⚠️',
        });
      }
    }

    // Prédiction d'économies
    const income = await prisma.transaction.aggregate({
      where: {
        userId,
        type: 'INCOME',
        date: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    });

    const totalIncome = Number(income._sum.amount || 0);
    const projectedSavings = totalIncome - projectedMonthEnd;

    if (totalIncome > 0 && projectedSavings > 0) {
      predictions.push({
        id: 'pred-savings',
        type: 'SAVINGS_FORECAST',
        title: 'Économies projetées',
        description: `Vous pourriez économiser environ ${Math.round(projectedSavings)} XOF ce mois`,
        predictedAmount: projectedSavings,
        confidence: Math.min(85, 55 + daysElapsed * 2),
        severity: 'info',
        icon: '💰',
      });
    }

    return predictions;
  }

  /**
   * Détecte les anomalies dans les dépenses
   */
  private async detectAnomalies(userId: string, monthStart: Date, monthEnd: Date): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    // Récupérer les transactions des 3 derniers mois
    const threeMonthsAgo = subMonths(monthStart, 3);
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        date: { gte: threeMonthsAgo, lte: monthEnd },
      },
      include: { category: true },
    });

    // Grouper par catégorie
    const categoryGroups = transactions.reduce((acc, t) => {
      const catId = t.categoryId || 'uncategorized';
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(t);
      return acc;
    }, {} as Record<string, typeof transactions>);

    // Détecter les dépenses inhabituelles par catégorie
    for (const [_categoryId, catTransactions] of Object.entries(categoryGroups)) {
      const amounts = catTransactions.map((t) => Number(t.amount));
      const average = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const stdDev = Math.sqrt(
        amounts.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / amounts.length
      );

      // Transactions du mois en cours uniquement
      const currentMonthCatTransactions = catTransactions.filter(
        (t) => t.date >= monthStart && t.date <= monthEnd
      );

      for (const transaction of currentMonthCatTransactions) {
        const amount = Number(transaction.amount);
        const deviation = Math.abs(amount - average);
        const deviationPercent = (deviation / average) * 100;

        // Si > 2x écart-type OU > 150% de la moyenne
        if (deviation > stdDev * 2 || deviationPercent > 150) {
          anomalies.push({
            id: `anomaly-${transaction.id}`,
            type: 'UNUSUAL_SPENDING',
            title: `Dépense inhabituelle : ${transaction.category?.name || 'Sans catégorie'}`,
            description: `${amount} XOF (moyenne : ${Math.round(average)} XOF)`,
            transactionId: transaction.id,
            categoryId: transaction.categoryId || undefined,
            amount,
            averageAmount: average,
            deviationPercent,
            date: transaction.date.toISOString(),
            severity: deviationPercent > 200 ? 'high' : deviationPercent > 150 ? 'medium' : 'low',
          });
        }
      }
    }

    // Détecter les pics de dépenses par catégorie
    for (const [categoryId, catTransactions] of Object.entries(categoryGroups)) {
      const currentMonthTotal = catTransactions
        .filter((t) => t.date >= monthStart && t.date <= monthEnd)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const lastMonthStart = subMonths(monthStart, 1);
      const lastMonthEnd = endOfMonth(lastMonthStart);
      const lastMonthTotal = catTransactions
        .filter((t) => t.date >= lastMonthStart && t.date <= lastMonthEnd)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      if (lastMonthTotal > 0) {
        const increase = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        if (increase > 50) {
          const category = catTransactions[0]?.category;
          anomalies.push({
            id: `spike-${categoryId}`,
            type: 'CATEGORY_SPIKE',
            title: `Augmentation importante : ${category?.name || 'Sans catégorie'}`,
            description: `+${Math.round(increase)}% par rapport au mois dernier`,
            categoryId: categoryId === 'uncategorized' ? undefined : categoryId,
            amount: currentMonthTotal,
            averageAmount: lastMonthTotal,
            deviationPercent: increase,
            date: new Date().toISOString(),
            severity: increase > 100 ? 'high' : 'medium',
          });
        }
      }
    }

    return anomalies.slice(0, 10); // Limiter à 10 anomalies
  }

  /**
   * Génère des recommandations personnalisées
   */
  private async generateRecommendations(
    userId: string,
    monthStart: Date,
    monthEnd: Date
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Récupérer les données nécessaires
    const [transactions, budgets, goals] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: subMonths(monthStart, 2), lte: monthEnd },
        },
        include: { category: true },
      }),
      prisma.budget.findMany({
        where: {
          userId,
          startDate: { lte: monthEnd },
          endDate: { gte: monthStart },
        },
        include: { category: true },
      }),
      prisma.savingGoal.findMany({
        where: { userId, status: 'IN_PROGRESS' },
      }),
    ]);

    const currentMonthTransactions = transactions.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    );

    // Analyser les catégories avec plus de dépenses
    const categorySpending = currentMonthTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((acc, t) => {
        const catName = t.category?.name || 'Sans catégorie';
        acc[catName] = (acc[catName] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];

    if (topCategory && topCategory[1] > 10000) {
      recommendations.push({
        id: 'rec-reduce-top',
        type: 'REDUCE_SPENDING',
        title: `Réduire les dépenses en ${topCategory[0]}`,
        description: `Vous avez dépensé ${Math.round(
          topCategory[1]
        )} XOF. Essayez de réduire de 10% pour économiser ${Math.round(topCategory[1] * 0.1)} XOF`,
        potentialSavings: topCategory[1] * 0.1,
        priority: 'high',
        actionable: true,
        icon: '💡',
      });
    }

    // Recommandations basées sur les budgets
    for (const budget of budgets) {
      const spent = currentMonthTransactions
        .filter((t) => t.categoryId === budget.categoryId && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const budgetAmount = Number(budget.amount);
      const percentUsed = (spent / budgetAmount) * 100;

      if (percentUsed > 80 && percentUsed < 100) {
        recommendations.push({
          id: `rec-budget-${budget.id}`,
          type: 'OPTIMIZE_BUDGET',
          title: `Attention au budget ${budget.category?.name || 'Budget'}`,
          description: `Vous avez utilisé ${Math.round(percentUsed)}% de ce budget`,
          categoryId: budget.categoryId || undefined,
          priority: percentUsed > 90 ? 'high' : 'medium',
          actionable: true,
          icon: '⚠️',
        });
      }
    }

    // Recommandations sur les objectifs
    for (const goal of goals) {
      const currentAmount = Number(goal.currentAmount);
      const targetAmount = Number(goal.targetAmount);
      const progress = (currentAmount / targetAmount) * 100;

      if (progress < 30 && goal.targetDate) {
        const daysLeft = Math.ceil((goal.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const remaining = targetAmount - currentAmount;
        const dailyNeeded = remaining / Math.max(daysLeft, 1);

        recommendations.push({
          id: `rec-goal-${goal.id}`,
          type: 'ADJUST_GOAL',
          title: `Accélérer l'objectif : ${goal.name}`,
          description: `Économisez ${Math.round(dailyNeeded)} XOF/jour pour atteindre votre objectif`,
          priority: daysLeft < 30 ? 'high' : 'medium',
          actionable: true,
          icon: '🎯',
        });
      }
    }

    // Détecter les dépenses récurrentes non optimisées
    const recurringExpenses = currentMonthTransactions.filter(
      (t) =>
        t.type === 'EXPENSE' &&
        transactions.filter(
          (other) =>
            other.description.toLowerCase() === t.description.toLowerCase() &&
            other.id !== t.id
        ).length >= 2
    );

    if (recurringExpenses.length > 0) {
      const totalRecurring = recurringExpenses.reduce((sum, t) => sum + Number(t.amount), 0);
      recommendations.push({
        id: 'rec-recurring',
        type: 'RECURRING_EXPENSE',
        title: 'Optimiser les dépenses récurrentes',
        description: `${recurringExpenses.length} dépenses récurrentes détectées (${Math.round(
          totalRecurring
        )} XOF). Envisagez de négocier ou changer de fournisseur`,
        potentialSavings: totalRecurring * 0.15,
        priority: 'medium',
        actionable: true,
        icon: '🔄',
      });
    }

    return recommendations.slice(0, 8);
  }

  /**
   * Analyse les tendances par catégorie
   */
  private async analyzeCategoryTrends(
    userId: string,
    monthStart: Date,
    monthEnd: Date
  ): Promise<CategoryTrend[]> {
    const trends: CategoryTrend[] = [];

    // Récupérer les catégories
    const categories = await prisma.category.findMany({
      where: { userId },
    });

    for (const category of categories) {
      // Mois actuel
      const currentMonth = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: category.id,
          type: 'EXPENSE',
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      });

      // Mois dernier
      const lastMonthStart = subMonths(monthStart, 1);
      const lastMonthEnd = endOfMonth(lastMonthStart);
      const lastMonth = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: category.id,
          type: 'EXPENSE',
          date: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _sum: { amount: true },
      });

      // Moyenne des 3 derniers mois
      const threeMonthsAgo = subMonths(monthStart, 3);
      const average = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: category.id,
          type: 'EXPENSE',
          date: { gte: threeMonthsAgo, lte: monthEnd },
        },
        _sum: { amount: true },
      });

      const currentSpending = Number(currentMonth._sum.amount || 0);
      const lastMonthSpending = Number(lastMonth._sum.amount || 0);
      const avgSpending = Number(average._sum.amount || 0) / 3;

      if (currentSpending > 0 || lastMonthSpending > 0) {
        const changePercent =
          lastMonthSpending > 0 ? ((currentSpending - lastMonthSpending) / lastMonthSpending) * 100 : 0;

        let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (Math.abs(changePercent) > 10) {
          trend = changePercent > 0 ? 'increasing' : 'decreasing';
        }

        trends.push({
          categoryId: category.id,
          categoryName: category.name,
          currentMonthSpending: currentSpending,
          lastMonthSpending,
          averageMonthlySpending: avgSpending,
          trend,
          changePercent,
          color: category.color,
        });
      }
    }

    return trends.sort((a, b) => b.currentMonthSpending - a.currentMonthSpending);
  }

  /**
   * Analyse les patterns de dépenses
   */
  private async analyzeSpendingPatterns(
    userId: string,
    monthStart: Date,
    monthEnd: Date
  ): Promise<SpendingPattern[]> {
    const patterns: SpendingPattern[] = [];

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        date: { gte: subMonths(monthStart, 1), lte: monthEnd },
      },
    });

    // Pattern 1: Dépenses weekend vs semaine
    const weekendSpending = transactions
      .filter((t) => {
        const day = t.date.getDay();
        return day === 0 || day === 6;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const weekdaySpending = transactions
      .filter((t) => {
        const day = t.date.getDay();
        return day > 0 && day < 6;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    if (weekendSpending > weekdaySpending * 0.4) {
      patterns.push({
        pattern: 'Dépenses élevées le weekend',
        description: `Vous dépensez ${Math.round(
          (weekendSpending / (weekendSpending + weekdaySpending)) * 100
        )}% de votre budget le weekend`,
        impact: weekendSpending,
        frequency: 'hebdomadaire',
      });
    }

    // Pattern 2: Dépenses en début/fin de mois
    const firstHalf = transactions
      .filter((t) => t.date.getDate() <= 15)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const secondHalf = transactions
      .filter((t) => t.date.getDate() > 15)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    if (firstHalf > secondHalf * 1.5) {
      patterns.push({
        pattern: 'Dépenses concentrées en début de mois',
        description: 'Vous dépensez plus en début de mois. Pensez à étaler vos achats',
        impact: firstHalf - secondHalf,
        frequency: 'mensuel',
      });
    }

    return patterns;
  }

  /**
   * Calcule la santé budgétaire globale
   */
  private async calculateBudgetHealth(
    userId: string,
    monthStart: Date,
    monthEnd: Date
  ): Promise<BudgetHealth> {
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        startDate: { lte: monthEnd },
        endDate: { gte: monthStart },
      },
    });

    let budgetsOnTrack = 0;
    let budgetsOverBudget = 0;

    for (const budget of budgets) {
      const spent = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          type: 'EXPENSE',
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      });

      const spentAmount = Number(spent._sum.amount || 0);
      const budgetAmount = Number(budget.amount);

      if (spentAmount <= budgetAmount) {
        budgetsOnTrack++;
      } else {
        budgetsOverBudget++;
      }
    }

    // Calculer le taux d'épargne
    const [income, expenses] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'INCOME',
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE',
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(income._sum.amount || 0);
    const totalExpenses = Number(expenses._sum.amount || 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Calculer le score global (0-100)
    let score = 50;

    // +30 points si tous les budgets sont respectés
    if (budgets.length > 0) {
      score += (budgetsOnTrack / budgets.length) * 30;
    }

    // +20 points pour le taux d'épargne
    if (savingsRate > 20) score += 20;
    else if (savingsRate > 10) score += 10;
    else if (savingsRate > 0) score += 5;

    // -10 points par budget dépassé
    score -= budgetsOverBudget * 10;

    score = Math.max(0, Math.min(100, score));

    let status: 'excellent' | 'good' | 'warning' | 'critical';
    let message: string;

    if (score >= 80) {
      status = 'excellent';
      message = 'Excellente gestion ! Continuez comme ça 🎉';
    } else if (score >= 60) {
      status = 'good';
      message = 'Bonne gestion financière 👍';
    } else if (score >= 40) {
      status = 'warning';
      message = 'Attention à vos dépenses ⚠️';
    } else {
      status = 'critical';
      message = 'Situation critique - Réduisez vos dépenses 🚨';
    }

    return {
      score: Math.round(score),
      status,
      message,
      budgetsOnTrack,
      budgetsOverBudget,
      totalBudgets: budgets.length,
      savingsRate: Math.round(savingsRate * 10) / 10,
    };
  }
}

export default new InsightsService();
