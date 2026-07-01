import { Response } from 'express';
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

      return res.status(201).json(billSplit);
    } catch (error: any) {
      console.error('Error in createBillSplit:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtenir tous les partages de facture
   */
  async getBillSplits(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      const billSplits = await billSplitService.getUserBillSplits(userId);

      return res.json({
        billSplits,
        total: billSplits.length,
      });
    } catch (error: any) {
      console.error('Error in getBillSplits:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtenir un partage de facture spécifique
   */
  async getBillSplit(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID requis' });
      }

      const billSplit = await billSplitService.getBillSplit(id);

      // Vérifier que l'utilisateur est le propriétaire
      if (billSplit.userId !== req.user!.userId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      return res.json(billSplit);
    } catch (error: any) {
      console.error('Error in getBillSplit:', error);
      return res.status(500).json({ error: error.message });
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

      if (!id) {
        return res.status(400).json({ error: 'ID requis' });
      }

      const billSplit = await billSplitService.updateBillSplit(id, userId, data);

      return res.json(billSplit);
    } catch (error: any) {
      console.error('Error in updateBillSplit:', error);
      return res.status(500).json({ error: error.message });
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

      if (!id) {
        return res.status(400).json({ error: 'ID requis' });
      }

      const payment = await billSplitService.recordPayment(id, userId, data);

      return res.status(201).json(payment);
    } catch (error: any) {
      console.error('Error in recordPayment:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Supprimer un partage de facture
   */
  async deleteBillSplit(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      if (!id) {
        return res.status(400).json({ error: 'ID requis' });
      }

      await billSplitService.deleteBillSplit(id, userId);

      return res.json({ message: 'Partage de facture supprimé' });
    } catch (error: any) {
      console.error('Error in deleteBillSplit:', error);
      return res.status(500).json({ error: error.message });
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

      return res.status(201).json(billSplit);
    } catch (error: any) {
      console.error('Error in splitEqually:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtenir les statistiques
   */
  async getStats(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID requis' });
      }

      const stats = await billSplitService.getBillSplitStats(id);

      return res.json(stats);
    } catch (error: any) {
      console.error('Error in getStats:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new BillSplitController();
