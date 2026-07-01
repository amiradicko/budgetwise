import { Router } from 'express';
import insightsController from './insights.controller';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.get('/', authenticate, (req, res, next) =>
  insightsController.getInsights(req, res).catch(next)
);

export default router;
