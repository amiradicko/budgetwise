import prisma from '@/config/database';
import { AppError } from '@/middlewares/errorHandler';
import { UpdateUserProfile, UpdateUserSettings } from '@budgetwise/shared';

class UsersService {
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        currency: true,
        language: true,
        theme: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async getUserProfile(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    return profile;
  }

  async updateUserProfile(userId: string, data: UpdateUserProfile) {
    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        currency: data.currency,
        language: data.language,
        theme: data.theme,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        currency: true,
        language: true,
        theme: true,
      },
    });

    // Update profile if additional data provided
    if (data.phone || data.address || data.city || data.country) {
      await prisma.userProfile.update({
        where: { userId },
        data: {
          phone: data.phone,
          address: data.address,
          city: data.city,
          country: data.country,
        },
      });
    }

    return updatedUser;
  }

  async updateUserAvatar(userId: string, avatarUrl: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        currency: true,
        language: true,
        theme: true,
      },
    });

    return user;
  }

  async getUserSettings(userId: string) {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      throw new AppError('Settings not found', 404);
    }

    return settings;
  }

  async updateUserSettings(userId: string, data: UpdateUserSettings) {
    const settings = await prisma.userSettings.update({
      where: { userId },
      data,
    });

    return settings;
  }

  async deleteUser(userId: string) {
    // Hard delete for now - in production you might want soft delete
    // Delete all related data first
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async getUserStats(userId: string) {
    const [accountsCount, transactionsCount, budgetsCount, goalsCount] = await Promise.all([
      prisma.account.count({ where: { userId } }),
      prisma.transaction.count({ where: { userId } }),
      prisma.budget.count({ where: { userId } }),
      prisma.savingGoal.count({ where: { userId } }),
    ]);

    // Get total balance across all accounts
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { balance: true, currency: true },
    });

    const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);

    // Get this month's transactions
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonthTransactions = await prisma.transaction.count({
      where: {
        userId,
        date: { gte: startOfMonth },
      },
    });

    return {
      accountsCount,
      transactionsCount,
      budgetsCount,
      goalsCount,
      totalBalance,
      thisMonthTransactions,
    };
  }
}

export default new UsersService();
