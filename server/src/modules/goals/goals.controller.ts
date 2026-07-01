import { Response } from 'express';
import goalsService from './goals.service';
import { asyncHandler } from '@/middlewares/errorHandler';
import { AuthRequest } from '@/middlewares/auth';
import { CreateSavingGoalInput, UpdateSavingGoalInput, PaginationParams } from '@budgetwise/shared';

class GoalsController {
  getGoals = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const pagination: PaginationParams = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    const result = await goalsService.getGoals(userId, pagination);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getGoal = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const goal = await goalsService.getGoalById(userId, id!);

    res.status(200).json({
      success: true,
      data: goal,
    });
  });

  createGoal = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const data: CreateSavingGoalInput = req.body;

    const goal = await goalsService.createGoal(userId, data);

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal,
    });
  });

  updateGoal = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data: UpdateSavingGoalInput = req.body;

    const goal = await goalsService.updateGoal(userId, id!, data);

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: goal,
    });
  });

  deleteGoal = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await goalsService.deleteGoal(userId, id!);

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
    });
  });

  addContribution = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { amount, description } = req.body;

    const contribution = await goalsService.addContribution(userId, id!, amount, description);

    res.status(201).json({
      success: true,
      message: 'Contribution added successfully',
      data: contribution,
    });
  });

  removeContribution = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id, contributionId } = req.params;

    await goalsService.removeContribution(userId, id!, contributionId!);

    res.status(200).json({
      success: true,
      message: 'Contribution removed successfully',
    });
  });

  getGoalProgress = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const progress = await goalsService.getGoalProgress(userId, id!);

    res.status(200).json({
      success: true,
      data: progress,
    });
  });
}

export default new GoalsController();
