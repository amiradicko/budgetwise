import { Request, Response } from 'express';
import smartAlertsService from './smartAlerts.service';
import type { AuthRequest } from '../../middlewares/auth';

export class SmartAlertsController {
  /**
   * Obtenir les alertes de l'utilisateur
   */
  async getAlerts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const unreadOnly = req.query.unreadOnly === 'true';

      const alerts = await smartAlertsService.getUserAlerts(userId, unreadOnly);

      res.json(alerts);
    } catch (error: any) {
      console.error('Error in getAlerts:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Générer les alertes intelligentes
   */
  async generateAlerts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      await smartAlertsService.generateSmartAlerts(userId);

      const alerts = await smartAlertsService.getUserAlerts(userId, true);

      res.json({ message: 'Alertes générées avec succès', alerts });
    } catch (error: any) {
      console.error('Error in generateAlerts:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Marquer une alerte comme lue
   */
  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const alert = await smartAlertsService.markAsRead(id, userId);

      res.json(alert);
    } catch (error: any) {
      console.error('Error in markAsRead:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Marquer toutes les alertes comme lues
   */
  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      await smartAlertsService.markAllAsRead(userId);

      res.json({ message: 'Toutes les alertes ont été marquées comme lues' });
    } catch (error: any) {
      console.error('Error in markAllAsRead:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Supprimer une alerte
   */
  async deleteAlert(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      await smartAlertsService.deleteAlert(id, userId);

      res.json({ message: 'Alerte supprimée' });
    } catch (error: any) {
      console.error('Error in deleteAlert:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new SmartAlertsController();
