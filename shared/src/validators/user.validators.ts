import { z } from 'zod';

export const updateUserSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  avatar: z.string().url('URL invalide').optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
});

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

export const updateUserSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  budgetAlerts: z.boolean().optional(),
  transactionAlerts: z.boolean().optional(),
  goalAlerts: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  monthlyReport: z.boolean().optional(),
});
