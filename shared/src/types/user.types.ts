import { Currency, Language, Theme } from './common.types';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  currency: Currency;
  language: Language;
  theme: Theme;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  transactionAlerts: boolean;
  goalAlerts: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
}

export type CreateUserInput = Omit<User, 'id' | 'emailVerified' | 'createdAt' | 'updatedAt'> & {
  password: string;
};

export type UpdateUserInput = Partial<
  Omit<User, 'id' | 'email' | 'emailVerified' | 'createdAt' | 'updatedAt'>
>;

export type UserResponse = Omit<User, 'password'>;

export interface UpdateUserProfile {
  firstName?: string;
  lastName?: string;
  currency?: Currency;
  language?: Language;
  theme?: Theme;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface UpdateUserSettings {
  emailNotifications?: boolean;
  budgetAlerts?: boolean;
  transactionAlerts?: boolean;
  goalAlerts?: boolean;
  weeklyReport?: boolean;
  monthlyReport?: boolean;
}
