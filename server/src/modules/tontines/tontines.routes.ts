import { Router } from 'express';
import tontinesController from './tontines.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// GET /api/v1/tontines
router.get('/', tontinesController.getAll);

// GET /api/v1/tontines/:id
router.get('/:id', tontinesController.getById);

// POST /api/v1/tontines
router.post('/', tontinesController.create);

// PUT /api/v1/tontines/:id
router.put('/:id', tontinesController.update);

// DELETE /api/v1/tontines/:id
router.delete('/:id', tontinesController.delete);

// POST /api/v1/tontines/:id/contributions
router.post('/:id/contributions', tontinesController.addContribution);

// DELETE /api/v1/tontines/:id/contributions/:contributionId
router.delete('/:id/contributions/:contributionId', tontinesController.deleteContribution);

// GET /api/v1/tontines/:id/stats
router.get('/:id/stats', tontinesController.getStats);

export default router;
