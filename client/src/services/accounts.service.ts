import api from '../lib/api';
import type { Account, CreateAccountInput, UpdateAccountInput } from '../types';

export const accountsService = {
  async getAll(): Promise<Account[]> {
    const response = await api.get<{ data: Account[] }>('/accounts');
    return response.data.data;
  },

  async getById(id: string): Promise<Account> {
    const response = await api.get<{ data: Account }>(`/accounts/${id}`);
    return response.data.data;
  },

  async create(data: CreateAccountInput): Promise<Account> {
    const response = await api.post<{ data: Account }>('/accounts', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateAccountInput): Promise<Account> {
    const response = await api.put<{ data: Account }>(`/accounts/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },

  async getBalance(id: string): Promise<number> {
    const response = await api.get<{ data: { balance: number } }>(`/accounts/${id}/balance`);
    return response.data.data.balance;
  },

  async getTotalBalance(): Promise<Record<string, number>> {
    const response = await api.get<{ data: Record<string, number> }>('/accounts/total-balance');
    return response.data.data;
  },
};
