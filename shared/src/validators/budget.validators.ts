import { z } from 'zod';

export const createBudgetSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  amount: z.number().positive('Le montant doit être positif'),
  currency: z.string().min(3).max(3),
  period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
  alertThreshold: z.number().min(0).max(100).default(80),
});

export const updateBudgetSchema = createBudgetSchema.partial();
