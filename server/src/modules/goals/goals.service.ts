import prisma from '@/config/database';
import { AppError } from '@/middlewares/errorHandler';
import { CreateSavingGoalInput, UpdateSavingGoalInput, PaginationParams } from '@budgetwise/shared';
import achievementsService from '../achievements/achievements.service';

class GoalsService {
  async getGoals(userId: string, pagination?: PaginationParams) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    const [goals, total] = await Promise.all([
      prisma.savingGoal.findMany({
        where: { userId },
        include: {
          goalContributions: {
            orderBy: { date: 'desc' },
            take: 5,
          },
        },
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.savingGoal.count({ where: { userId } }),
    ]);

    // Calculate progress for each goal
    const goalsWithProgress = goals.map((goal) => {
      const percentage = (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100;
      const remaining = Number(goal.targetAmount) - Number(goal.currentAmount);
      const isCompleted = goal.currentAmount >= goal.targetAmount;

      return {
        ...goal,
        percentage: Math.min(percentage, 100),
        remaining: Math.max(remaining, 0),
        isCompleted,
      };
    });

    return {
      data: goalsWithProgress,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getGoalById(userId: string, goalId: string) {
    const goal = await prisma.savingGoal.findFirst({
      where: { id: goalId, userId },
      include: {
        goalContributions: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!goal) {
      throw new AppError('Goal not found', 404);
    }

    const percentage = (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100;
    const remaining = Number(goal.targetAmount) - Number(goal.currentAmount);
    const isCompleted = goal.currentAmount >= goal.targetAmount;

    return {
      ...goal,
      percentage: Math.min(percentage, 100),
      remaining: Math.max(remaining, 0),
      isCompleted,
    };
  }

  async createGoal(userId: string, data: CreateSavingGoalInput) {
    // Extraire initialAmount qui n'existe pas dans le schéma Prisma
    const { initialAmount, ...goalData } = data;
    
    const goal = await prisma.savingGoal.create({
      data: {
        ...goalData,
        userId,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        currentAmount: initialAmount || 0,
      },
    });

    return goal;
  }

  async updateGoal(userId: string, goalId: string, data: UpdateSavingGoalInput) {
    // Check if goal exists
    await this.getGoalById(userId, goalId);

    const goal = await prisma.savingGoal.update({
      where: { id: goalId },
      data: {
        ...data,
        ...(data.targetDate && { targetDate: new Date(data.targetDate) }),
      },
    });

    return goal;
  }

  async deleteGoal(userId: string, goalId: string) {
    // Check if goal exists
    await this.getGoalById(userId, goalId);

    // Delete all contributions first
    await prisma.goalContribution.deleteMany({
      where: { goalId },
    });

    await prisma.savingGoal.delete({
      where: { id: goalId },
    });
  }

  async addContribution(userId: string, goalId: string, amount: number, description?: string) {
    // Verify goal exists and belongs to user
    const goal = await this.getGoalById(userId, goalId);
    const wasCompleted = Number(goal.currentAmount) >= Number(goal.targetAmount);

    // Create contribution
    const contribution = await prisma.goalContribution.create({
      data: {
        goalId,
        amount,
        notes: description,
        date: new Date(),
      },
    });

    // Update goal current amount
    const updatedGoal = await prisma.savingGoal.update({
      where: { id: goalId },
      data: {
        currentAmount: { increment: amount },
        status: {
          set: Number(goal.currentAmount) + amount >= Number(goal.targetAmount) ? 'COMPLETED' : goal.status,
        },
      },
    });

    // Vérifier si le goal vient d'être complété
    const isNowCompleted = Number(updatedGoal.currentAmount) >= Number(updatedGoal.targetAmount);
    if (!wasCompleted && isNowCompleted) {
      await achievementsService.incrementGoalCompleted(userId);
    }

    return contribution;
  }

  async removeContribution(userId: string, goalId: string, contributionId: string) {
    // Verify goal exists and belongs to user
    await this.getGoalById(userId, goalId);

    const contribution = await prisma.goalContribution.findFirst({
      where: { id: contributionId, goalId },
    });

    if (!contribution) {
      throw new AppError('Contribution not found', 404);
    }

    // Update goal current amount
    await prisma.savingGoal.update({
      where: { id: goalId },
      data: {
        currentAmount: { decrement: Number(contribution.amount) },
      },
    });

    // Delete contribution
    await prisma.goalContribution.delete({
      where: { id: contributionId },
    });
  }

  async getGoalProgress(userId: string, goalId: string) {
    const goal = await this.getGoalById(userId, goalId);

    // Get monthly contributions
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const contributions = await prisma.goalContribution.groupBy({
      by: ['date'],
      where: {
        goalId,
        date: { gte: sixMonthsAgo },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const monthlyContributions = contributions.map((c) => ({
      date: c.date,
      amount: Number(c._sum.amount || 0),
    }));

    // Calculate estimated completion date
    let estimatedCompletionDate = null;
    if (goal.monthlyContribution && Number(goal.monthlyContribution) > 0) {
      const remaining = Number(goal.remaining);
      const monthsNeeded = Math.ceil(remaining / Number(goal.monthlyContribution));
      estimatedCompletionDate = new Date();
      estimatedCompletionDate.setMonth(estimatedCompletionDate.getMonth() + monthsNeeded);
    }

    return {
      goal,
      monthlyContributions,
      estimatedCompletionDate,
    };
  }
}

export default new GoalsService();
