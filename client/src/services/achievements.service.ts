import api from '../lib/api';
import type { Achievement, UserAchievements, UserStats, LeaderboardEntry } from '@budgetwise/shared';

class AchievementsService {
  // Obtenir tous les achievements
  async getAll(): Promise<Achievement[]> {
    const response = await api.get<{ data: Achievement[] }>('/achievements');
    return response.data.data;
  }

  // Obtenir les achievements de l'utilisateur
  async getMy(): Promise<UserAchievements> {
    const response = await api.get<{ data: UserAchievements }>('/achievements/my');
    return response.data.data;
  }

  // Obtenir les stats de l'utilisateur
  async getStats(): Promise<UserStats> {
    const response = await api.get<{ data: UserStats }>('/achievements/stats');
    return response.data.data;
  }

  // Vérifier et débloquer les achievements
  async check(): Promise<{ data: Achievement[]; message: string }> {
    const response = await api.post<{ data: Achievement[]; message: string }>('/achievements/check');
    return response.data;
  }

  // Obtenir le leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await api.get<{ data: LeaderboardEntry[] }>('/achievements/leaderboard');
    return response.data.data;
  }

  // Mettre à jour le streak
  async updateStreak(): Promise<UserStats> {
    const response = await api.post<{ data: UserStats }>('/achievements/update-streak');
    return response.data.data;
  }
}

export default new AchievementsService();
