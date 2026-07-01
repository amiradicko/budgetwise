import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/middlewares/auth';
import achievementsService from './achievements.service';

class AchievementsController {
  // GET /api/v1/achievements - Obtenir tous les achievements
  async getAll(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const achievements = await achievementsService.getAllAchievements();
      res.json({ data: achievements });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/achievements/my - Obtenir les achievements de l'utilisateur
  async getMy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const data = await achievementsService.getUserAchievements(userId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/achievements/stats - Obtenir les stats de l'utilisateur
  async getMyStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const stats = await achievementsService.getUserStats(userId);
      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/achievements/check - Vérifier et débloquer les achievements
  async checkAchievements(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const newAchievements = await achievementsService.checkAchievements(userId);
      res.json({ 
        data: newAchievements,
        message: newAchievements.length > 0 
          ? `${newAchievements.length} nouveau(x) badge(s) débloqué(s) !` 
          : 'Aucun nouveau badge',
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/achievements/leaderboard - Obtenir le classement
  async getLeaderboard(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leaderboard = await achievementsService.getLeaderboard();
      res.json({ data: leaderboard });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/achievements/update-streak - Mettre à jour le streak (appelé au login)
  async updateStreak(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const stats = await achievementsService.updateStreak(userId);
      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }
}

export default new AchievementsController();
