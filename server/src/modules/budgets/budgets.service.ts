import prisma from '@/config/database';
import { AppError } from '@/middlewares/errorHandler';
import { CreateBudgetInput, UpdateBudgetInput, PaginationParams } from '@budgetwise/shared';
import achievementsService from '../achievements/achievements.service';

class BudgetsService {
  async getBudgets(userId: string, pagination?: PaginationParams) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    const [budgets, total] = await Promise.all([
      prisma.budget.findMany({
        where: { userId },
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.budget.count({ where: { userId } }),
    ]);

    // Calculate spent amount for each budget
    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget: any) => {
        const spent = await this.calculateBudgetSpent(userId, budget.id);
        const percentage = (Number(spent) / Number(budget.amount)) * 100;
        const remaining = Number(budget.amount) - Number(spent);

        return {
          ...budget,
          spent,
          percentage: Math.min(percentage, 100),
          remaining: Math.max(remaining, 0),
          isExceeded: spent > Number(budget.amount),
        };
      })
    );

    return {
      data: budgetsWithProgress,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBudgetById(userId: string, budgetId: string) {
    const budget = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
      include: {
        category: true,
      },
    });

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    const spent = await this.calculateBudgetSpent(userId, budget.id);
    const percentage = (Number(spent) / Number(budget.amount)) * 100;
    const remaining = Number(budget.amount) - Number(spent);

    return {
      ...budget,
      spent,
      percentage: Math.min(percentage, 100),
      remaining: Math.max(remaining, 0),
      isExceeded: spent > Number(budget.amount),
    };
  }

  async createBudget(userId: string, data: CreateBudgetInput) {
    // Validate category if provided
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    const budget = await prisma.budget.create({
      data: {
        ...data,
        userId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: {
        category: true,
      },
    });

    // Incrémenter le compteur de budgets pour la gamification
    await achievementsService.incrementBudgetCount(userId);

    return budget;
  }

  async updateBudget(userId: string, budgetId: string, data: UpdateBudgetInput) {
    // Check if budget exists
    await this.getBudgetById(userId, budgetId);

    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data: {
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
      },
      include: {
        category: true,
      },
    });

    return budget;
  }

  async deleteBudget(userId: string, budgetId: string) {
    // Check if budget exists
    await this.getBudgetById(userId, budgetId);

    await prisma.budget.delete({
      where: { id: budgetId },
    });
  }

  private async calculateBudgetSpent(userId: string, budgetId: string): Promise<number> {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
    });

    if (!budget) return 0;

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date(budget.startDate);
    let endDate = budget.endDate ? new Date(budget.endDate) : now;

    // If period is MONTHLY, calculate for current month
    if (budget.period === 'MONTHLY') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (budget.period === 'QUARTERLY') {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
    } else if (budget.period === 'YEARLY') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }

    // Get total expenses for the category in the period
    const result = await prisma.transaction.aggregate({
      where: {
        userId,
        type: 'EXPENSE',
        categoryId: budget.categoryId || undefined,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getBudgetProgress(userId: string, budgetId: string) {
    const budget = await this.getBudgetById(userId, budgetId);

    // Get daily expenses for the period
    const startDate = new Date(budget.startDate);
    const endDate = budget.endDate ? new Date(budget.endDate) : new Date();

    const transactions = await prisma.transaction.groupBy({
      by: ['date'],
      where: {
        userId,
        type: 'EXPENSE',
        categoryId: budget.categoryId || undefined,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const dailyExpenses = transactions.map((t: any) => ({
      date: t.date,
      amount: Number(t._sum.amount || 0),
    }));

    return {
      budget,
      dailyExpenses,
    };
  }
}

export default new BudgetsService();
