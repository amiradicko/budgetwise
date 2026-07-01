import { Response } from 'express';
import { notificationsService } from './notifications.service';
import { AuthRequest } from '../../middlewares/auth';

class NotificationsController {
  /**
   * Get all notifications
   */
  async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const onlyUnread = req.query.unread === 'true';

      const notifications = await notificationsService.getNotifications(
        userId,
        onlyUnread
      );

      res.json({
        success: true,
        data: notifications,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      const count = await notificationsService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Notification ID is required',
        });
      }

      const notification = await notificationsService.markAsRead(id, userId);

      return res.json({
        success: true,
        data: notification,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      await notificationsService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Delete notification
   */
  async delete(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Notification ID is required',
        });
      }

      await notificationsService.deleteNotification(id, userId);

      return res.json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export const notificationsController = new NotificationsController();
