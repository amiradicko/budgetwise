import { Request, Response } from 'express';
import billSplitService from './billSplit.service';
import type { AuthRequest } from '../../middlewares/auth';

export class BillSplitController {
  /**
   * Créer un nouveau partage de facture
   */
  async createBillSplit(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const data = req.body;

      const billSplit = await billSplitService.createBillSplit(userId, data);

      res.status(201).json(billSplit);
    } catch (error: any) {
      console.error('Error in createBillSplit:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtenir tous les partages de facture
   */
  async getBillSplits(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      const billSplits = await billSplitService.getUserBillSplits(userId);

      res.json({
        billSplits,
        total: billSplits.length,
      });
    } catch (error: any) {
      console.error('Error in getBillSplits:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtenir un partage de facture spécifique
   */
  async getBillSplit(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const billSplit = await billSplitService.getBillSplit(id);

      // Vérifier que l'utilisateur est le propriétaire
      if (billSplit.userId !== req.user!.userId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      res.json(billSplit);
    } catch (error: any) {
      console.error('Error in getBillSplit:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Mettre à jour un partage de facture
   */
  async updateBillSplit(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const data = req.body;

      const billSplit = await billSplitService.updateBillSplit(id, userId, data);

      res.json(billSplit);
    } catch (error: any) {
      console.error('Error in updateBillSplit:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Enregistrer un paiement
   */
  async recordPayment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const data = req.body;

      const payment = await billSplitService.recordPayment(id, userId, data);

      res.status(201).json(payment);
    } catch (error: any) {
      console.error('Error in recordPayment:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Supprimer un partage de facture
   */
  async deleteBillSplit(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      await billSplitService.deleteBillSplit(id, userId);

      res.json({ message: 'Partage de facture supprimé' });
    } catch (error: any) {
      console.error('Error in deleteBillSplit:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Partager également
   */
  async splitEqually(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { title, totalAmount, participants } = req.body;

      if (!title || !totalAmount || !participants || participants.length === 0) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      const billSplit = await billSplitService.splitEqually(userId, title, totalAmount, participants);

      res.status(201).json(billSplit);
    } catch (error: any) {
      console.error('Error in splitEqually:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtenir les statistiques
   */
  async getStats(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const stats = await billSplitService.getBillSplitStats(id);

      res.json(stats);
    } catch (error: any) {
      console.error('Error in getStats:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new BillSplitController();
