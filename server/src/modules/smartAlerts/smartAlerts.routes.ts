import { Router } from 'express';
import smartAlertsController from './smartAlerts.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// GET /api/v1/smart-alerts - Obtenir les alertes
router.get('/', smartAlertsController.getAlerts);

// POST /api/v1/smart-alerts/generate - Générer les alertes
router.post('/generate', smartAlertsController.generateAlerts);

// PATCH /api/v1/smart-alerts/:id/read - Marquer comme lue
router.patch('/:id/read', smartAlertsController.markAsRead);

// PATCH /api/v1/smart-alerts/read-all - Marquer toutes comme lues
router.patch('/read-all', smartAlertsController.markAllAsRead);

// DELETE /api/v1/smart-alerts/:id - Supprimer une alerte
router.delete('/:id', smartAlertsController.deleteAlert);

export default router;
