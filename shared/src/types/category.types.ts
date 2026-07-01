export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  type: 'INCOME' | 'EXPENSE' | 'BOTH';
  isDefault: boolean;
  parentId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCategoryInput = Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export type UpdateCategoryInput = Partial<
  Omit<Category, 'id' | 'userId' | 'isDefault' | 'createdAt' | 'updatedAt'>
>;

export interface CategoryWithStats {
  category: Category;
  totalSpent: number;
  transactionCount: number;
  percentage: number;
  budgetAmount?: number;
  budgetRemaining?: number;
}
