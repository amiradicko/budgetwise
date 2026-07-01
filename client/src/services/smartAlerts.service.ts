import api from '../lib/api';
import type { SmartAlert } from '@budgetwise/shared';

class SmartAlertsService {
  /**
   * Obtenir les alertes de l'utilisateur
   */
  async getAlerts(unreadOnly: boolean = false): Promise<SmartAlert[]> {
    const params = new URLSearchParams();
    if (unreadOnly) {
      params.append('unreadOnly', 'true');
    }
    
    const response = await api.get(`/smart-alerts?${params.toString()}`);
    return response.data;
  }

  /**
   * Générer les alertes intelligentes
   */
  async generateAlerts(): Promise<{ message: string; alerts: SmartAlert[] }> {
    const response = await api.post('/smart-alerts/generate');
    return response.data;
  }

  /**
   * Marquer une alerte comme lue
   */
  async markAsRead(alertId: string): Promise<SmartAlert> {
    const response = await api.patch(`/smart-alerts/${alertId}/read`);
    return response.data;
  }

  /**
   * Marquer toutes les alertes comme lues
   */
  async markAllAsRead(): Promise<void> {
    await api.patch('/smart-alerts/read-all');
  }

  /**
   * Supprimer une alerte
   */
  async deleteAlert(alertId: string): Promise<void> {
    await api.delete(`/smart-alerts/${alertId}`);
  }
}

export default new SmartAlertsService();
