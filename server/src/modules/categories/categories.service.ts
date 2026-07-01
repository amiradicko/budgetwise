import prisma from '@/config/database';
import { AppError } from '@/middlewares/errorHandler';
import { CreateCategoryInput, UpdateCategoryInput } from '@budgetwise/shared';

class CategoriesService {
  async getCategories(userId: string) {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return categories;
  }

  async getCategoryById(userId: string, categoryId: string) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async createCategory(userId: string, data: CreateCategoryInput) {
    // Check if category with same name already exists
    const existing = await prisma.category.findFirst({
      where: {
        userId,
        name: data.name,
      },
    });

    if (existing) {
      throw new AppError('Category with this name already exists', 400);
    }

    // If parent category is specified, validate it exists
    if (data.parentId) {
      const parentCategory = await this.getCategoryById(userId, data.parentId);
      if (!parentCategory) {
        throw new AppError('Parent category not found', 404);
      }
    }

    const category = await prisma.category.create({
      data: {
        ...data,
        userId,
        isDefault: false,
      },
    });

    return category;
  }

  async updateCategory(userId: string, categoryId: string, data: UpdateCategoryInput) {
    // Check if category exists
    await this.getCategoryById(userId, categoryId);

    // If updating name, check for duplicates
    if (data.name) {
      const existing = await prisma.category.findFirst({
        where: {
          userId,
          name: data.name,
          id: { not: categoryId },
        },
      });

      if (existing) {
        throw new AppError('Category with this name already exists', 400);
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data,
    });

    return category;
  }

  async deleteCategory(userId: string, categoryId: string) {
    const category = await this.getCategoryById(userId, categoryId);

    // Prevent deleting default categories
    if (category.isDefault) {
      throw new AppError('Cannot delete default category', 400);
    }

    // Check if category is used in transactions
    const transactionsCount = await prisma.transaction.count({
      where: { categoryId },
    });

    if (transactionsCount > 0) {
      throw new AppError(
        'Cannot delete category with existing transactions. Please reassign transactions first.',
        400
      );
    }

    // Check if category is used in budgets
    const budgetsCount = await prisma.budget.count({
      where: { categoryId },
    });

    if (budgetsCount > 0) {
      throw new AppError(
        'Cannot delete category with existing budgets. Please reassign budgets first.',
        400
      );
    }

    // Delete subcategories
    await prisma.category.deleteMany({
      where: { parentId: categoryId },
    });

    await prisma.category.delete({
      where: { id: categoryId },
    });
  }

  async getCategoryStats(userId: string, categoryId: string, startDate?: string, endDate?: string) {
    const category = await this.getCategoryById(userId, categoryId);

    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();

    // Get total expenses for this category
    const result = await prisma.transaction.aggregate({
      where: {
        userId,
        categoryId,
        type: 'EXPENSE',
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    // Get monthly trend
    const monthlyTrend = await prisma.transaction.groupBy({
      by: ['date'],
      where: {
        userId,
        categoryId,
        type: 'EXPENSE',
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return {
      category,
      totalAmount: result._sum.amount || 0,
      transactionsCount: result._count,
      monthlyTrend: monthlyTrend.map((t) => ({
        date: t.date,
        amount: Number(t._sum.amount || 0),
      })),
    };
  }

  async getCategoriesWithTotals(userId: string, startDate?: string, endDate?: string) {
    const categories = await this.getCategories(userId);

    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();

    const categoriesWithTotals = await Promise.all(
      categories.map(async (category) => {
        const result = await prisma.transaction.aggregate({
          where: {
            userId,
            categoryId: category.id,
            type: 'EXPENSE',
            date: {
              gte: start,
              lte: end,
            },
          },
          _sum: {
            amount: true,
          },
          _count: true,
        });

        return {
          ...category,
          totalAmount: result._sum.amount || 0,
          transactionsCount: result._count,
        };
      })
    );

    // Sort by total amount descending
    return categoriesWithTotals.sort((a, b) => Number(b.totalAmount) - Number(a.totalAmount));
  }
}

export default new CategoriesService();
