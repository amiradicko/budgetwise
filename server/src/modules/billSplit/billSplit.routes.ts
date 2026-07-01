import { Router } from 'express';
import billSplitController from './billSplit.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// POST /api/v1/bill-splits - Créer un partage de facture
router.post('/', billSplitController.createBillSplit);

// POST /api/v1/bill-splits/split-equally - Partager également
router.post('/split-equally', billSplitController.splitEqually);

// GET /api/v1/bill-splits - Obtenir tous les partages
router.get('/', billSplitController.getBillSplits);

// GET /api/v1/bill-splits/:id - Obtenir un partage spécifique
router.get('/:id', billSplitController.getBillSplit);

// GET /api/v1/bill-splits/:id/stats - Obtenir les statistiques
router.get('/:id/stats', billSplitController.getStats);

// PATCH /api/v1/bill-splits/:id - Mettre à jour un partage
router.patch('/:id', billSplitController.updateBillSplit);

// POST /api/v1/bill-splits/:id/payments - Enregistrer un paiement
router.post('/:id/payments', billSplitController.recordPayment);

// DELETE /api/v1/bill-splits/:id - Supprimer un partage
router.delete('/:id', billSplitController.deleteBillSplit);

export default router;
