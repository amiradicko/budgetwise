import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  icon: z.string().min(1, 'Icône requise'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur invalide'),
  type: z.enum(['INCOME', 'EXPENSE', 'BOTH'], {
    required_error: 'Type requis',
  }),
  isDefault: z.boolean().default(false),
  parentId: z.string().uuid().optional(),
  order: z.number().int().min(0).default(0),
});

export const updateCategorySchema = createCategorySchema.partial().omit({ isDefault: true });
