import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.string().uuid('ID de compte invalide'),
  categoryId: z.string().uuid('ID de catégorie invalide').optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER'], {
    required_error: 'Type de transaction requis',
  }),
  amount: z.number().positive('Le montant doit être positif'),
  currency: z.string().min(3).max(3, 'Code devise invalide'),
  description: z.string().min(1, 'Description requise').max(500),
  paymentMethod: z
    .enum(['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHECK', 'OTHER'])
    .optional(),
  receiptUrl: z.string().url('URL invalide').optional(),
  tags: z.array(z.string()).optional(),
  date: z.coerce.date(),
  isRecurring: z.boolean().default(false),
  transferToAccountId: z.string().uuid('ID de compte invalide').optional(),
  notes: z.string().max(1000).optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionFiltersSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
  categoryId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHECK', 'OTHER']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const createRecurringTransactionSchema = z.object({
  accountId: z.string().uuid('ID de compte invalide'),
  categoryId: z.string().uuid('ID de catégorie invalide').optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: z.number().positive('Le montant doit être positif'),
  currency: z.string().min(3).max(3),
  description: z.string().min(1).max(500),
  paymentMethod: z
    .enum(['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHECK', 'OTHER'])
    .optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});
