import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateNotificationDTO {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
}

class NotificationsService {
  /**
   * Get all notifications for a user
   */
  async getNotifications(userId: string, onlyUnread: boolean = false) {
    const where: any = { userId };
    
    if (onlyUnread) {
      where.isRead = false;
    }

    return await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  /**
   * Create a notification
   */
  async createNotification(data: CreateNotificationDTO) {
    // Check if similar notification already exists (to avoid duplicates)
    const existing = await prisma.notification.findFirst({
      where: {
        userId: data.userId,
        type: data.type,
        isRead: false,
        metadata: data.metadata ? {
          equals: data.metadata,
        } : undefined,
      },
    });

    if (existing) {
      return existing; // Don't create duplicate
    }

    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return await prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  /**
   * Create Tontine payment due notification
   */
  async createTontinePaymentNotification(
    userId: string,
    tontineId: string,
    tontineName: string,
    amount: number,
    currency: string,
    dueDate: Date
  ) {
    return await this.createNotification({
      userId,
      type: 'TONTINE_PAYMENT_DUE',
      title: '💰 Contribution Tontine à payer',
      message: `Il est temps de payer votre contribution de ${amount} ${currency} pour "${tontineName}". Date limite: ${dueDate.toLocaleDateString('fr-FR')}`,
      metadata: {
        tontineId,
        tontineName,
        amount,
        currency,
        dueDate: dueDate.toISOString(),
      },
    });
  }

  /**
   * Create Tontine turn to receive notification
   */
  async createTontineTurnToReceiveNotification(
    userId: string,
    tontineId: string,
    tontineName: string,
    amount: number,
    currency: string,
    round: number
  ) {
    return await this.createNotification({
      userId,
      type: 'TONTINE_TURN_TO_RECEIVE',
      title: '🎁 C\'est votre tour de recevoir !',
      message: `Félicitations ! C'est votre tour de recevoir ${amount} ${currency} pour la tontine "${tontineName}" (Tour ${round}).`,
      metadata: {
        tontineId,
        tontineName,
        amount,
        currency,
        round,
      },
    });
  }
}

export const notificationsService = new NotificationsService();
