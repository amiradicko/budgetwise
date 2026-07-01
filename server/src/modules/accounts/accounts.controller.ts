import { Response } from 'express';
import accountsService from './accounts.service';
import { asyncHandler } from '@/middlewares/errorHandler';
import { AuthRequest } from '@/middlewares/auth';
import { CreateAccountInput, UpdateAccountInput, PaginationParams } from '@budgetwise/shared';

class AccountsController {
  getAccounts = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const pagination: PaginationParams = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    const result = await accountsService.getAccounts(userId, pagination);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getAccount = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const account = await accountsService.getAccountById(userId, id!);

    res.status(200).json({
      success: true,
      data: account,
    });
  });

  createAccount = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const data: CreateAccountInput = req.body;

    const account = await accountsService.createAccount(userId, data);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account,
    });
  });

  updateAccount = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data: UpdateAccountInput = req.body;

    const account = await accountsService.updateAccount(userId, id!, data);

    res.status(200).json({
      success: true,
      message: 'Account updated successfully',
      data: account,
    });
  });

  deleteAccount = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await accountsService.deleteAccount(userId, id!);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  });

  getAccountBalance = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const balance = await accountsService.getAccountBalance(userId, id!);

    res.status(200).json({
      success: true,
      data: balance,
    });
  });

  getAccountStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const stats = await accountsService.getAccountStats(userId, id!);

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  getTotalBalance = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;

    const balances = await accountsService.getTotalBalance(userId);

    res.status(200).json({
      success: true,
      data: balances,
    });
  });
}

export default new AccountsController();
