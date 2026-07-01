import api from '../lib/api';
import type { Budget, CreateBudgetInput, UpdateBudgetInput } from '../types';

export const budgetsService = {
  async getAll(): Promise<Budget[]> {
    const response = await api.get<{ data: Budget[] }>('/budgets');
    return response.data.data;
  },

  async getById(id: string): Promise<Budget> {
    const response = await api.get<{ data: Budget }>(`/budgets/${id}`);
    return response.data.data;
  },

  async create(data: CreateBudgetInput): Promise<Budget> {
    const response = await api.post<{ data: Budget }>('/budgets', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateBudgetInput): Promise<Budget> {
    const response = await api.put<{ data: Budget }>(`/budgets/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },

  async getProgress(id: string): Promise<{ spent: number; remaining: number; percentage: number }> {
    const response = await api.get<{ data: { spent: number; remaining: number; percentage: number } }>(`/budgets/${id}/progress`);
    return response.data.data;
  },
};
