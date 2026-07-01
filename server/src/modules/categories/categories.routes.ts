import { Router } from 'express';
import categoriesController from './categories.controller';
import { validate } from '@/middlewares/validate';
import { authenticate } from '@/middlewares/auth';
import { createCategorySchema, updateCategorySchema } from '@budgetwise/shared';

const router = Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories for current user
 * @access  Private
 */
router.get('/', authenticate, categoriesController.getCategories);

/**
 * @route   GET /api/v1/categories/with-totals
 * @desc    Get all categories with spending totals
 * @access  Private
 */
router.get('/with-totals', authenticate, categoriesController.getCategoriesWithTotals);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID
 * @access  Private
 */
router.get('/:id', authenticate, categoriesController.getCategory);

/**
 * @route   POST /api/v1/categories
 * @desc    Create new category
 * @access  Private
 */
router.post('/', authenticate, validate(createCategorySchema), categoriesController.createCategory);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update category
 * @access  Private
 */
router.put('/:id', authenticate, validate(updateCategorySchema), categoriesController.updateCategory);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete category
 * @access  Private
 */
router.delete('/:id', authenticate, categoriesController.deleteCategory);

/**
 * @route   GET /api/v1/categories/:id/stats
 * @desc    Get category statistics
 * @access  Private
 */
router.get('/:id/stats', authenticate, categoriesController.getCategoryStats);

export default router;
