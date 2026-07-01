import { Router } from 'express';
import goalsController from './goals.controller';
import { validate } from '@/middlewares/validate';
import { authenticate } from '@/middlewares/auth';
import { createSavingGoalSchema, updateSavingGoalSchema } from '@budgetwise/shared';
import { z } from 'zod';

const router = Router();

const contributionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
});

/**
 * @route   GET /api/v1/goals
 * @desc    Get all goals for current user
 * @access  Private
 */
router.get('/', authenticate, goalsController.getGoals);

/**
 * @route   GET /api/v1/goals/:id
 * @desc    Get goal by ID
 * @access  Private
 */
router.get('/:id', authenticate, goalsController.getGoal);

/**
 * @route   POST /api/v1/goals
 * @desc    Create new goal
 * @access  Private
 */
router.post('/', authenticate, validate(createSavingGoalSchema), goalsController.createGoal);

/**
 * @route   PUT /api/v1/goals/:id
 * @desc    Update goal
 * @access  Private
 */
router.put('/:id', authenticate, validate(updateSavingGoalSchema), goalsController.updateGoal);

/**
 * @route   DELETE /api/v1/goals/:id
 * @desc    Delete goal
 * @access  Private
 */
router.delete('/:id', authenticate, goalsController.deleteGoal);

/**
 * @route   POST /api/v1/goals/:id/contributions
 * @desc    Add contribution to goal
 * @access  Private
 */
router.post('/:id/contributions', authenticate, validate(contributionSchema), goalsController.addContribution);

/**
 * @route   DELETE /api/v1/goals/:id/contributions/:contributionId
 * @desc    Remove contribution from goal
 * @access  Private
 */
router.delete('/:id/contributions/:contributionId', authenticate, goalsController.removeContribution);

/**
 * @route   GET /api/v1/goals/:id/progress
 * @desc    Get goal progress with contributions
 * @access  Private
 */
router.get('/:id/progress', authenticate, goalsController.getGoalProgress);

export default router;
