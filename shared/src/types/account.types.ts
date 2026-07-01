export enum AccountType {
  BANK = 'BANK',
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CARD = 'CARD',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
}

export enum MobileMoneyProvider {
  ORANGE_MONEY = 'ORANGE_MONEY',
  MOOV_MONEY = 'MOOV_MONEY',
  WAVE = 'WAVE',
  MTN_MONEY = 'MTN_MONEY',
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  icon?: string;
  color?: string;
  provider?: MobileMoneyProvider | string;
  accountNumber?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAccountInput = Omit<Account, 'id' | 'userId' | 'balance' | 'createdAt' | 'updatedAt'> & {
  initialBalance?: number;
};

export type UpdateAccountInput = Partial<
  Omit<Account, 'id' | 'userId' | 'balance' | 'createdAt' | 'updatedAt'>
>;

export interface AccountBalance {
  accountId: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
}

export interface AccountSummary {
  totalBalance: number;
  accountCount: number;
  accounts: Array<{
    id: string;
    name: string;
    type: AccountType;
    balance: number;
  }>;
}
