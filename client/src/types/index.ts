// Re-export types from shared package
export type {
  User,
  UpdateUserProfile,
  UpdateUserSettings,
} from '@budgetwise/shared';

export type {
  Account,
  AccountType,
  CreateAccountInput,
  UpdateAccountInput,
  MobileMoneyProvider,
} from '@budgetwise/shared';

export type {
  Transaction,
  TransactionType,
  PaymentMethod,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
} from '@budgetwise/shared';

export type {
  Budget,
  BudgetPeriod,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '@budgetwise/shared';

export type {
  SavingGoal,
  GoalStatus,
  CreateSavingGoalInput,
  UpdateSavingGoalInput,
  GoalContribution,
} from '@budgetwise/shared';

export type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@budgetwise/shared';

export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthTokens,
} from '@budgetwise/shared';

// Import RegisterData for use in interfaces
import type { RegisterData } from '@budgetwise/shared';

// Additional client-only types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// User type from AuthResponse (doesn't include full User fields)
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  currency: string;
  language: string;
  theme: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;  refreshUser: () => Promise<void>;  isLoading: boolean;
  isAuthenticated: boolean;
}
