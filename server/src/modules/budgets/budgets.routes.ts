import { Router } from 'express';
import budgetsController from './budgets.controller';
import { validate } from '@/middlewares/validate';
import { authenticate } from '@/middlewares/auth';
import { createBudgetSchema, updateBudgetSchema } from '@budgetwise/shared';

const router = Router();

/**
 * @route   GET /api/v1/budgets
 * @desc    Get all budgets for current user
 * @access  Private
 */
router.get('/', authenticate, budgetsController.getBudgets);

/**
 * @route   GET /api/v1/budgets/:id
 * @desc    Get budget by ID
 * @access  Private
 */
router.get('/:id', authenticate, budgetsController.getBudget);

/**
 * @route   POST /api/v1/budgets
 * @desc    Create new budget
 * @access  Private
 */
router.post('/', authenticate, validate(createBudgetSchema), budgetsController.createBudget);

/**
 * @route   PUT /api/v1/budgets/:id
 * @desc    Update budget
 * @access  Private
 */
router.put('/:id', authenticate, validate(updateBudgetSchema), budgetsController.updateBudget);

/**
 * @route   DELETE /api/v1/budgets/:id
 * @desc    Delete budget
 * @access  Private
 */
router.delete('/:id', authenticate, budgetsController.deleteBudget);

/**
 * @route   GET /api/v1/budgets/:id/progress
 * @desc    Get budget progress with daily expenses
 * @access  Private
 */
router.get('/:id/progress', authenticate, budgetsController.getBudgetProgress);

export default router;
