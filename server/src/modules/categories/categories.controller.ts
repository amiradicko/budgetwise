import { Response } from 'express';
import categoriesService from './categories.service';
import { asyncHandler } from '@/middlewares/errorHandler';
import { AuthRequest } from '@/middlewares/auth';
import { CreateCategoryInput, UpdateCategoryInput } from '@budgetwise/shared';

class CategoriesController {
  getCategories = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const categories = await categoriesService.getCategories(userId);

    res.status(200).json({
      success: true,
      data: categories,
    });
  });

  getCategory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const category = await categoriesService.getCategoryById(userId, id!);

    res.status(200).json({
      success: true,
      data: category,
    });
  });

  createCategory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const data: CreateCategoryInput = req.body;

    const category = await categoriesService.createCategory(userId, data);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  });

  updateCategory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data: UpdateCategoryInput = req.body;

    const category = await categoriesService.updateCategory(userId, id!, data);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  });

  deleteCategory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await categoriesService.deleteCategory(userId, id!);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  });

  getCategoryStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const stats = await categoriesService.getCategoryStats(userId, id!, startDate, endDate);

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  getCategoriesWithTotals = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const categories = await categoriesService.getCategoriesWithTotals(userId, startDate, endDate);

    res.status(200).json({
      success: true,
      data: categories,
    });
  });
}

export default new CategoriesController();
