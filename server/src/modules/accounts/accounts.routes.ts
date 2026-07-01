import { Router } from 'express';
import accountsController from './accounts.controller';
import { validate } from '@/middlewares/validate';
import { authenticate } from '@/middlewares/auth';
import { createAccountSchema, updateAccountSchema } from '@budgetwise/shared';

const router = Router();

/**
 * @route   GET /api/v1/accounts
 * @desc    Get all accounts for current user
 * @access  Private
 */
router.get('/', authenticate, accountsController.getAccounts);

/**
 * @route   GET /api/v1/accounts/total-balance
 * @desc    Get total balance across all accounts
 * @access  Private
 */
router.get('/total-balance', authenticate, accountsController.getTotalBalance);

/**
 * @route   GET /api/v1/accounts/:id
 * @desc    Get account by ID
 * @access  Private
 */
router.get('/:id', authenticate, accountsController.getAccount);

/**
 * @route   POST /api/v1/accounts
 * @desc    Create new account
 * @access  Private
 */
router.post('/', authenticate, validate(createAccountSchema), accountsController.createAccount);


/**
 * @route   GET /api/v1/accounts/:id/balance
 * @desc    Get account balance
 * @access  Private
 */
router.get('/:id/balance', authenticate, accountsController.getAccountBalance);

/**
 * @route   GET /api/v1/accounts/:id/stats
 * @desc    Get account statistics
 * @access  Private
 */
router.get('/:id/stats', authenticate, accountsController.getAccountStats);



/**
 * @route   PUT /api/v1/accounts/:id
 * @desc    Update account
 * @access  Private
 */
router.put('/:id', authenticate, validate(updateAccountSchema), accountsController.updateAccount);

/**
 * @route   DELETE /api/v1/accounts/:id
 * @desc    Delete account
 * @access  Private
 */
router.delete('/:id', authenticate, accountsController.deleteAccount);


export default router;
