export enum BudgetPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
  categoryId?: string;
  isActive: boolean;
  alertThreshold: number; // Percentage (e.g., 80 for 80%)
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBudgetInput = Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export type UpdateBudgetInput = Partial<
  Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>;

export interface BudgetProgress {
  budgetId: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  alertTriggered: boolean;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
  budgets: Array<BudgetProgress>;
}
