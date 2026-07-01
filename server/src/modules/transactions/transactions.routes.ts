import { Router } from 'express';
import transactionsController from './transactions.controller';
import { validate } from '@/middlewares/validate';
import { authenticate } from '@/middlewares/auth';
import { createTransactionSchema, updateTransactionSchema } from '@budgetwise/shared';

const router = Router();

/**
 * @route   GET /api/v1/transactions
 * @desc    Get all transactions with filters
 * @access  Private
 */
router.get('/', authenticate, transactionsController.getTransactions);

/**
 * @route   GET /api/v1/transactions/stats
 * @desc    Get transaction statistics
 * @access  Private
 */
router.get('/stats', authenticate, transactionsController.getTransactionStats);

/**
 * @route   GET /api/v1/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private
 */
router.get('/:id', authenticate, transactionsController.getTransaction);

/**
 * @route   POST /api/v1/transactions
 * @desc    Create new transaction
 * @access  Private
 */
router.post('/', authenticate, validate(createTransactionSchema), transactionsController.createTransaction);

/**
 * @route   PUT /api/v1/transactions/:id
 * @desc    Update transaction
 * @access  Private
 */
router.put('/:id', authenticate, validate(updateTransactionSchema), transactionsController.updateTransaction);

/**
 * @route   DELETE /api/v1/transactions/:id
 * @desc    Delete transaction
 * @access  Private
 */
router.delete('/:id', authenticate, transactionsController.deleteTransaction);

export default router;
