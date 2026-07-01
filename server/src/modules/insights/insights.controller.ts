import { Response } from 'express';
import { AuthRequest } from '@/middlewares/auth';
import insightsService from './insights.service';

class InsightsController {
  /**
   * GET /api/v1/insights
   * Récupère tous les insights pour l'utilisateur connecté
   */
  async getInsights(req: AuthRequest, res: Response) {
    const userId = req.user?.userId!;
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const insights = await insightsService.generateInsights(userId, month, year);

    return res.status(200).json({
      success: true,
      data: insights,
    });
  }
}

export default new InsightsController();
