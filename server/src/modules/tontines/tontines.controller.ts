import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/middlewares/auth';
import tontinesService from './tontines.service';

class TontinesController {
  // GET /api/v1/tontines
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const tontines = await tontinesService.getTontines(userId);
      res.json({ data: tontines });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/tontines/:id
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      if (!id) {
        throw new Error('Tontine ID is required');
      }
      const tontine = await tontinesService.getTontineById(userId, id);
      res.json({ data: tontine });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/tontines
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const tontine = await tontinesService.createTontine(userId, req.body);
      res.status(201).json({ data: tontine });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/tontines/:id
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      if (!id) {
        throw new Error('Tontine ID is required');
      }
      const tontine = await tontinesService.updateTontine(userId, id, req.body);
      res.json({ data: tontine });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/v1/tontines/:id
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      if (!id) {
        throw new Error('Tontine ID is required');
      }
      await tontinesService.deleteTontine(userId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/tontines/:id/contributions
  async addContribution(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      if (!id) {
        throw new Error('Tontine ID is required');
      }
      const contribution = await tontinesService.addContribution(userId, id, req.body);
      res.status(201).json({ data: contribution });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/tontines/:id/stats
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      if (!id) {
        throw new Error('Tontine ID is required');
      }
      const stats = await tontinesService.getTontineStats(userId, id);
      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/v1/tontines/:id/contributions/:contributionId
  async deleteContribution(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id, contributionId } = req.params;
      if (!id || !contributionId) {
        throw new Error('Tontine ID and Contribution ID are required');
      }
      const result = await tontinesService.deleteContribution(userId, id, contributionId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new TontinesController();
