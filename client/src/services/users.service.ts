import api from '../lib/api';
import type { AuthUser } from '../types';

export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  currency?: string;
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface UpdateUserSettingsInput {
  emailNotifications?: boolean;
  budgetAlerts?: boolean;
  transactionAlerts?: boolean;
  goalAlerts?: boolean;
  weeklyReport?: boolean;
  monthlyReport?: boolean;
}

export const usersService = {
  async getProfile(): Promise<AuthUser> {
    const response = await api.get<{ data: AuthUser }>('/users/profile');
    return response.data.data;
  },

  async updateProfile(data: UpdateUserProfileInput): Promise<AuthUser> {
    const response = await api.put<{ data: AuthUser }>('/users/profile', data);
    return response.data.data;
  },

  async updateSettings(data: UpdateUserSettingsInput): Promise<void> {
    await api.put('/users/settings', data);
  },

  async uploadAvatar(file: File): Promise<AuthUser> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post<{ data: AuthUser }>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
