import { Response } from 'express';
import transactionsService from './transactions.service';
import { asyncHandler } from '@/middlewares/errorHandler';
import { AuthRequest } from '@/middlewares/auth';
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  PaginationParams,
  TransactionFilters,
} from '@budgetwise/shared';

class TransactionsController {
  getTransactions = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;

    const filters: TransactionFilters = {
      type: req.query.type as any,
      categoryId: req.query.categoryId as string,
      fromAccountId: req.query.fromAccountId as string,
      toAccountId: req.query.toAccountId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string,
    };

    const pagination: PaginationParams = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    const result = await transactionsService.getTransactions(userId, filters, pagination);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getTransaction = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const transaction = await transactionsService.getTransactionById(userId, id!);

    res.status(200).json({
      success: true,
      data: transaction,
    });
  });

  createTransaction = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const data: CreateTransactionInput = req.body;

    const transaction = await transactionsService.createTransaction(userId, data);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  });

  updateTransaction = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data: UpdateTransactionInput = req.body;

    const transaction = await transactionsService.updateTransaction(userId, id!, data);

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  });

  deleteTransaction = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await transactionsService.deleteTransaction(userId, id!);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  });

  getTransactionStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const stats = await transactionsService.getTransactionStats(userId, startDate, endDate);

    res.status(200).json({
      success: true,
      data: stats,
    });
  });
}

export default new TransactionsController();
