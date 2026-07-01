import api from '../lib/api';
import type { InsightData } from '@budgetwise/shared';

export const insightsService = {
  /**
   * Récupère tous les insights pour l'utilisateur connecté
   */
  async getInsights(month?: number, year?: number): Promise<InsightData> {
    const params = new URLSearchParams();
    if (month !== undefined) params.append('month', month.toString());
    if (year !== undefined) params.append('year', year.toString());

    const queryString = params.toString();
    const url = queryString ? `/insights?${queryString}` : '/insights';

    const { data } = await api.get<{ success: boolean; data: InsightData }>(url);
    return data.data;
  },
};

export default insightsService;
