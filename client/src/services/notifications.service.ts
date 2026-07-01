import api from '../lib/api';
import type { Notification } from '../types/notification.types';

interface NotificationResponse {
  success: boolean;
  data: Notification[];
}

interface UnreadCountResponse {
  success: boolean;
  data: { count: number };
}

class NotificationsService {
  async getAll(unreadOnly: boolean = false): Promise<Notification[]> {
    const params = unreadOnly ? { unread: 'true' } : {};
    const response = await api.get<NotificationResponse>('/notifications', { params });
    return response.data.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data.data.count;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await api.put(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  }

  async delete(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }
}

export default new NotificationsService();
