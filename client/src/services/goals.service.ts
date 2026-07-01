import api from '../lib/api';
import type { SavingGoal, CreateSavingGoalInput, UpdateSavingGoalInput, GoalContribution } from '../types';

export const goalsService = {
  async getAll(): Promise<SavingGoal[]> {
    const response = await api.get<{ data: SavingGoal[] }>('/goals');
    return response.data.data;
  },

  async getById(id: string): Promise<SavingGoal> {
    const response = await api.get<{ data: SavingGoal }>(`/goals/${id}`);
    return response.data.data;
  },

  async create(data: CreateSavingGoalInput): Promise<SavingGoal> {
    const response = await api.post<{ data: SavingGoal }>('/goals', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateSavingGoalInput): Promise<SavingGoal> {
    const response = await api.put<{ data: SavingGoal }>(`/goals/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/goals/${id}`);
  },

  async addContribution(goalId: string, amount: number, notes?: string): Promise<GoalContribution> {
    const response = await api.post<{ data: GoalContribution }>(`/goals/${goalId}/contributions`, {
      amount,
      notes,
    });
    return response.data.data;
  },

  async getContributions(goalId: string): Promise<GoalContribution[]> {
    const response = await api.get<{ data: GoalContribution[] }>(`/goals/${goalId}/contributions`);
    return response.data.data;
  },

  async getActiveGoalsCount(): Promise<number> {
    const response = await api.get<{ data: SavingGoal[] }>('/goals');
    const goals = response.data.data;
    return goals.filter((g: any) => g.status === 'ACTIVE').length;
  },
};
