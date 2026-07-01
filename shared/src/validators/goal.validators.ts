import { z } from 'zod';

export const createSavingGoalSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  description: z.string().max(500).optional(),
  targetAmount: z.number().positive('Le montant cible doit être positif'),
  currency: z.string().min(3).max(3),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur invalide').optional(),
  targetDate: z.coerce.date().optional(),
  priority: z.number().int().min(1).max(5).default(3),
  accountId: z.string().uuid().optional(),
  monthlyContribution: z.number().positive().optional(),
  initialAmount: z.number().min(0).default(0),
});

export const updateSavingGoalSchema = createSavingGoalSchema
  .partial()
  .omit({ initialAmount: true });

export const createGoalContributionSchema = z.object({
  goalId: z.string().uuid('ID d\'objectif invalide'),
  amount: z.number().positive('Le montant doit être positif'),
  date: z.coerce.date(),
  notes: z.string().max(500).optional(),
});
