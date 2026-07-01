import prisma from '@/config/database';
import { AppError } from '@/middlewares/errorHandler';
import { CreateAccountInput, UpdateAccountInput, PaginationParams } from '@budgetwise/shared';

class AccountsService {
  async getAccounts(userId: string, pagination?: PaginationParams) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.account.count({ where: { userId } }),
    ]);

    return {
      data: accounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAccountById(userId: string, accountId: string) {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new AppError('Account not found', 404);
    }

    return account;
  }

  async createAccount(userId: string, data: CreateAccountInput) {
    // If this is the first account or marked as default, ensure no other default exists
    if (data.isDefault) {
      await prisma.account.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await prisma.account.create({
      data: {
        name: data.name,
        type: data.type,
        currency: data.currency,
        icon: data.icon,
        color: data.color,
        provider: data.provider,
        accountNumber: data.accountNumber,
        isDefault: data.isDefault,
        isActive: data.isActive,
        userId,
        balance: data.initialBalance || 0,
      },
    });

    return account;
  }

  async updateAccount(userId: string, accountId: string, data: UpdateAccountInput) {
    // Check if account exists and belongs to user
    await this.getAccountById(userId, accountId);

    // If setting as default, remove default from other accounts
    if (data.isDefault) {
      await prisma.account.updateMany({
        where: { userId, isDefault: true, id: { not: accountId } },
        data: { isDefault: false },
      });
    }

    const account = await prisma.account.update({
      where: { id: accountId },
      data,
    });

    return account;
  }

  async deleteAccount(userId: string, accountId: string) {
    // Check if account exists and belongs to user
    await this.getAccountById(userId, accountId);

    // Check if account has transactions
    const transactionsCount = await prisma.transaction.count({
      where: {
        OR: [
          { accountId: accountId },
          { transferToAccountId: accountId }
        ],
      },
    });

    if (transactionsCount > 0) {
      throw new AppError(
        'Cannot delete account with existing transactions. Please delete all transactions first.',
        400
      );
    }

    await prisma.account.delete({
      where: { id: accountId },
    });
  }

  async getAccountBalance(userId: string, accountId: string) {
    const account = await this.getAccountById(userId, accountId);
    return {
      balance: account.balance,
      currency: account.currency,
    };
  }

  async getAccountStats(userId: string, accountId: string) {
    const account = await this.getAccountById(userId, accountId);

    // Get transactions count
    const transactionsCount = await prisma.transaction.count({
      where: {
        OR: [
          { accountId: accountId },
          { transferToAccountId: accountId }
        ],
      },
    });

    // Get income and expenses for this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const [income, expenses] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          accountId: accountId,
          type: 'INCOME',
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          accountId: accountId,
          type: 'EXPENSE',
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      balance: account.balance,
      currency: account.currency,
      transactionsCount,
      thisMonthIncome: income._sum?.amount || 0,
      thisMonthExpenses: expenses._sum?.amount || 0,
    };
  }

  async getTotalBalance(userId: string) {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { balance: true, currency: true },
    });

    // Group by currency
    const balancesByCurrency = accounts.reduce((acc: any, account) => {
      const currency = account.currency;
      if (!acc[currency]) {
        acc[currency] = 0;
      }
      acc[currency] += Number(account.balance);
      return acc;
    }, {} as Record<string, number>);

    return balancesByCurrency;
  }
}

export default new AccountsService();
