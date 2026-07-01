export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
}

export interface SavingGoal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  icon?: string;
  color?: string;
  targetDate?: Date;
  status: GoalStatus;
  priority: number; // 1-5
  accountId?: string; // Linked account for automatic savings
  monthlyContribution?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateSavingGoalInput = Omit<
  SavingGoal,
  'id' | 'userId' | 'currentAmount' | 'status' | 'createdAt' | 'updatedAt'
> & {
  initialAmount?: number;
};

export type UpdateSavingGoalInput = Partial<
  Omit<SavingGoal, 'id' | 'userId' | 'currentAmount' | 'createdAt' | 'updatedAt'>
>;

export interface GoalProgress {
  goalId: string;
  targetAmount: number;
  currentAmount: number;
  remaining: number;
  percentage: number;
  isCompleted: boolean;
  daysRemaining?: number;
  recommendedMonthlyContribution?: number;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: Date;
  notes?: string;
}

export type CreateGoalContributionInput = Omit<GoalContribution, 'id'>;
