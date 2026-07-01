import { Response } from 'express';
import budgetsService from './budgets.service';
import { asyncHandler } from '@/middlewares/errorHandler';
import { AuthRequest } from '@/middlewares/auth';
import { CreateBudgetInput, UpdateBudgetInput, PaginationParams } from '@budgetwise/shared';

class BudgetsController {
  getBudgets = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const pagination: PaginationParams = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    const result = await budgetsService.getBudgets(userId, pagination);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getBudget = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const budget = await budgetsService.getBudgetById(userId, id!);

    res.status(200).json({
      success: true,
      data: budget,
    });
  });

  createBudget = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const data: CreateBudgetInput = req.body;

    const budget = await budgetsService.createBudget(userId, data);

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: budget,
    });
  });

  updateBudget = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data: UpdateBudgetInput = req.body;

    const budget = await budgetsService.updateBudget(userId, id!, data);

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: budget,
    });
  });

  deleteBudget = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await budgetsService.deleteBudget(userId, id!);

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
    });
  });

  getBudgetProgress = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const progress = await budgetsService.getBudgetProgress(userId, id!);

    res.status(200).json({
      success: true,
      data: progress,
    });
  });
}

export default new BudgetsController();
