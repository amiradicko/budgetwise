import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all notifications (or only unread with ?unread=true)
router.get('/', notificationsController.getAll);

// Get unread count
router.get('/unread-count', notificationsController.getUnreadCount);

// Mark all as read
router.put('/mark-all-read', notificationsController.markAllAsRead);

// Mark specific notification as read
router.put('/:id/read', notificationsController.markAsRead);

// Delete notification
router.delete('/:id', notificationsController.delete);

export default router;
