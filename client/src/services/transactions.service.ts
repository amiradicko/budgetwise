import api from '../lib/api';
import type { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionFilters } from '../types';

export const transactionsService = {
  async getAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<{ data: Transaction[] }>(`/transactions?${params}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Transaction> {
    const response = await api.get<{ data: Transaction }>(`/transactions/${id}`);
    return response.data.data;
  },

  async create(data: CreateTransactionInput): Promise<Transaction> {
    const response = await api.post<{ data: Transaction }>('/transactions', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateTransactionInput): Promise<Transaction> {
    const response = await api.put<{ data: Transaction }>(`/transactions/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  async getStats(startDate?: string, endDate?: string): Promise<{
    income: { total: number; count: number };
    expenses: { total: number; count: number };
    transfers: { total: number; count: number };
    balance: number;
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<{ data: any }>(`/transactions/stats?${params}`);
    return response.data.data;
  },
};
