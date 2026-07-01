export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CHECK = 'CHECK',
  OTHER = 'OTHER',
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  paymentMethod?: PaymentMethod;
  receiptUrl?: string;
  tags?: string[];
  date: Date;
  isRecurring: boolean;
  recurringTransactionId?: string;
  transferToAccountId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTransactionInput = Omit<
  Transaction,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export type UpdateTransactionInput = Partial<
  Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>;

export interface TransactionFilters {
  type?: TransactionType;
  categoryId?: string;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  paymentMethod?: PaymentMethod;
  startDate?: Date | string;
  endDate?: Date | string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  tags?: string[];
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  transactionCount: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  paymentMethod?: PaymentMethod;
  frequency: RecurringFrequency;
  startDate: Date;
  endDate?: Date;
  nextExecutionDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum RecurringFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export type CreateRecurringTransactionInput = Omit<
  RecurringTransaction,
  'id' | 'userId' | 'nextExecutionDate' | 'createdAt' | 'updatedAt'
>;
