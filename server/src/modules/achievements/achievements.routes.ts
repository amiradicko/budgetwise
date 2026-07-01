import { Router } from 'express';
import achievementsController from './achievements.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// GET /api/v1/achievements
router.get('/', achievementsController.getAll);

// GET /api/v1/achievements/my
router.get('/my', achievementsController.getMy);

// GET /api/v1/achievements/stats
router.get('/stats', achievementsController.getMyStats);

// POST /api/v1/achievements/check
router.post('/check', achievementsController.checkAchievements);

// GET /api/v1/achievements/leaderboard
router.get('/leaderboard', achievementsController.getLeaderboard);

// POST /api/v1/achievements/update-streak
router.post('/update-streak', achievementsController.updateStreak);

export default router;
