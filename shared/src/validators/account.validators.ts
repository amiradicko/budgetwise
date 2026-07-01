import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  type: z.enum(['BANK', 'CASH', 'MOBILE_MONEY', 'CARD', 'SAVINGS', 'INVESTMENT'], {
    required_error: 'Type de compte requis',
  }),
  currency: z.string().min(3).max(3, 'Code devise invalide'),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur invalide').optional(),
  provider: z.string().optional(),
  accountNumber: z.string().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  initialBalance: z.number().default(0),
});

export const updateAccountSchema = createAccountSchema.partial().omit({ initialBalance: true });
