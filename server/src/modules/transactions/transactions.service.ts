import prisma from '@/config/database';
import { AppError } from '@/middlewares/errorHandler';
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  PaginationParams,
  TransactionFilters,
} from '@budgetwise/shared';
import { Prisma } from '@prisma/client';
import achievementsService from '../achievements/achievements.service';

class TransactionsService {
  async getTransactions(userId: string, filters?: TransactionFilters, pagination?: PaginationParams) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(filters?.type && { type: filters.type }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.fromAccountId && { fromAccountId: filters.fromAccountId }),
      ...(filters?.toAccountId && { toAccountId: filters.toAccountId }),
      ...(filters?.startDate &&
        filters?.endDate && {
          date: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate),
          },
        }),
      ...(filters?.search && {
        OR: [
          { description: { contains: filters.search, mode: 'insensitive' } },
          { notes: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          account: { select: { id: true, name: true, type: true } },
          transferToAccount: { select: { id: true, name: true, type: true } },
        },
        orderBy: { date: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(userId: string, transactionId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
      include: {
        category: true,
        account: true,
        transferToAccount: true,
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    return transaction;
  }

  async createTransaction(userId: string, data: CreateTransactionInput) {
    // Validate accounts exist and belong to user
    if (data.accountId) {
      const fromAccount = await prisma.account.findFirst({
        where: { id: data.accountId, userId },
      });
      if (!fromAccount) {
        throw new AppError('Source account not found', 404);
      }

      // Check sufficient balance for expenses and transfers
      if (data.type === 'EXPENSE' || data.type === 'TRANSFER') {
        if (Number(fromAccount.balance) < data.amount) {
          throw new AppError('Insufficient balance in source account', 400);
        }
      }
    }

    if (data.transferToAccountId) {
      const toAccount = await prisma.account.findFirst({
        where: { id: data.transferToAccountId, userId },
      });
      if (!toAccount) {
        throw new AppError('Destination account not found', 404);
      }
    }

    // Validate category if provided
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    // Create transaction and update account balances in a transaction
    const transaction = await prisma.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId,
          date: data.date ? new Date(data.date) : new Date(),
        },
        include: {
          category: true,
          account: true,
          transferToAccount: true,
        },
      });

      // Update account balances
      if (data.type === 'EXPENSE' && data.accountId) {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { decrement: data.amount } },
        });
      } else if (data.type === 'INCOME' && data.accountId) {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { increment: data.amount } },
        });
      } else if (data.type === 'TRANSFER' && data.accountId && data.transferToAccountId) {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { decrement: data.amount } },
        });
        await tx.account.update({
          where: { id: data.transferToAccountId },
          data: { balance: { increment: data.amount } },
        });
      }

      return newTransaction;
    });

    // Incrémenter le compteur de transactions pour la gamification
    await achievementsService.incrementTransactionCount(userId);

    return transaction;
  }

  async updateTransaction(userId: string, transactionId: string, data: UpdateTransactionInput) {
    // Utiliser une transaction Prisma pour garantir l'atomicité
    const updatedTransaction = await prisma.$transaction(async (tx) => {
      // 1. Récupérer la transaction existante
      const existingTransaction = await tx.transaction.findFirst({
        where: { id: transactionId, userId },
        include: {
          category: true,
          account: true,
          transferToAccount: true,
        },
      });

      if (!existingTransaction) {
        throw new AppError('Transaction not found', 404);
      }

      // 2. Annuler les changements de solde de l'ancienne transaction
      await this.revertBalanceChangesInTx(tx, existingTransaction);

      // 3. Mettre à jour la transaction
      const updated = await tx.transaction.update({
        where: { id: transactionId },
        data: {
          ...data,
          ...(data.date && { date: new Date(data.date) }),
        },
        include: {
          category: true,
          account: true,
          transferToAccount: true,
        },
      });

      // 4. Appliquer les changements de solde de la nouvelle transaction
      await this.applyBalanceChangesInTx(tx, updated);

      return updated;
    });

    return updatedTransaction;
  }

  async deleteTransaction(userId: string, transactionId: string) {
    // Utiliser une transaction Prisma pour garantir l'atomicité
    await prisma.$transaction(async (tx) => {
      // 1. Récupérer la transaction
      const transaction = await tx.transaction.findFirst({
        where: { id: transactionId, userId },
      });

      if (!transaction) {
        throw new AppError('Transaction not found', 404);
      }

      // 2. Annuler les changements de solde
      await this.revertBalanceChangesInTx(tx, transaction);

      // 3. Supprimer la transaction
      await tx.transaction.delete({
        where: { id: transactionId },
      });
    });
  }

  // Méthode pour annuler les changements de solde (avec transaction Prisma)
  private async revertBalanceChangesInTx(tx: any, transaction: any) {
    // EXPENSE: On remet l'argent dans le compte (on annule la dépense)
    if (transaction.type === 'EXPENSE' && transaction.accountId) {
      await tx.account.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: Number(transaction.amount) } },
      });
    } 
    // INCOME: On retire l'argent du compte (on annule le revenu)
    else if (transaction.type === 'INCOME' && transaction.accountId) {
      await tx.account.update({
        where: { id: transaction.accountId },
        data: { balance: { decrement: Number(transaction.amount) } },
      });
    } 
    // TRANSFER: On annule le transfert dans les deux comptes
    else if (transaction.type === 'TRANSFER') {
      if (transaction.accountId) {
        // Compte source: on remet l'argent
        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: Number(transaction.amount) } },
        });
      }
      if (transaction.transferToAccountId) {
        // Compte destination: on retire l'argent
        await tx.account.update({
          where: { id: transaction.transferToAccountId },
          data: { balance: { decrement: Number(transaction.amount) } },
        });
      }
    }
  }

  // Méthode pour appliquer les changements de solde (avec transaction Prisma)
  private async applyBalanceChangesInTx(tx: any, transaction: any) {
    // EXPENSE: On retire l'argent du compte
    if (transaction.type === 'EXPENSE' && transaction.accountId) {
      await tx.account.update({
        where: { id: transaction.accountId },
        data: { balance: { decrement: Number(transaction.amount) } },
      });
    } 
    // INCOME: On ajoute l'argent au compte
    else if (transaction.type === 'INCOME' && transaction.accountId) {
      await tx.account.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: Number(transaction.amount) } },
      });
    } 
    // TRANSFER: On retire du compte source et on ajoute au compte destination
    else if (transaction.type === 'TRANSFER') {
      if (transaction.accountId) {
        // Compte source: on retire l'argent
        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { decrement: Number(transaction.amount) } },
        });
      }
      if (transaction.transferToAccountId) {
        // Compte destination: on ajoute l'argent
        await tx.account.update({
          where: { id: transaction.transferToAccountId },
          data: { balance: { increment: Number(transaction.amount) } },
        });
      }
    }
  }

  async getTransactionStats(userId: string, startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();

    const [income, expenses, transfersOut] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'INCOME',
          date: { gte: start, lte: end },
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE',
          date: { gte: start, lte: end },
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'TRANSFER',
          date: { gte: start, lte: end },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    // Get expenses by category
    const expensesByCategory = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'EXPENSE',
        date: { gte: start, lte: end },
        categoryId: { not: null },
      },
      _sum: { amount: true },
      _count: true,
    });

    // Get category names
    const categoriesWithExpenses = await Promise.all(
      expensesByCategory.map(async (item) => {
        const category = await prisma.category.findUnique({
          where: { id: item.categoryId! },
        });
        return {
          categoryId: item.categoryId,
          categoryName: category?.name || 'Unknown',
          categoryIcon: category?.icon,
          categoryColor: category?.color,
          amount: item._sum.amount || 0,
          count: item._count,
        };
      })
    );

    return {
      income: {
        total: income._sum.amount || 0,
        count: income._count,
      },
      expenses: {
        total: expenses._sum.amount || 0,
        count: expenses._count,
      },
      transfers: {
        total: transfersOut._sum.amount || 0,
        count: transfersOut._count,
      },
      balance: Number(income._sum.amount || 0) - Number(expenses._sum.amount || 0),
      expensesByCategory: categoriesWithExpenses,
    };
  }
}

export default new TransactionsService();
