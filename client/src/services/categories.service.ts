import api from '../lib/api';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<{ data: Category[] }>('/categories');
    return response.data.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get<{ data: Category }>(`/categories/${id}`);
    return response.data.data;
  },

  async create(data: CreateCategoryInput): Promise<Category> {
    const response = await api.post<{ data: Category }>('/categories', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const response = await api.put<{ data: Category }>(`/categories/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
