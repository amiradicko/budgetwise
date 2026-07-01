import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import Layout from '../components/Layout';
import { useNotifications } from '../contexts/NotificationsContext';
import { Card } from '../components/ui/Card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.metadata?.tontineId) {
      navigate(`/tontines/${notification.metadata.tontineId}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    if (confirm('Supprimer cette notification ?')) {
      await deleteNotification(notificationId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'TONTINE_PAYMENT_DUE':
        return '💰';
      case 'TONTINE_TURN_TO_RECEIVE':
        return '🎁';
      case 'BUDGET_ALERT':
        return '⚠️';
      case 'GOAL_ACHIEVED':
        return '🎯';
      default:
        return '🔔';
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="w-8 h-8 text-indigo-600" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-2">
                {unreadNotifications.length} non lue{unreadNotifications.length > 1 ? 's' : ''}
              </p>
            </div>
            {unreadNotifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Tout marquer comme lu
              </button>
            )}
          </div>

          {loading && notifications.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </Card>
          ) : notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-500">
                Vous n'avez aucune notification pour le moment.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Unread Notifications */}
              {unreadNotifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">
                    Non lues ({unreadNotifications.length})
                  </h2>
                  <div className="space-y-3">
                    {unreadNotifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className="p-4 cursor-pointer hover:shadow-lg transition-all group bg-indigo-50 border-l-4 border-indigo-600"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {notification.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-green-100 rounded"
                                  title="Marquer comme lu"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </button>
                                <button
                                  onClick={(e) => handleDelete(e, notification.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-700 mt-1">{notification.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Read Notifications */}
              {readNotifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">
                    Lues ({readNotifications.length})
                  </h2>
                  <div className="space-y-3">
                    {readNotifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-all group opacity-75 hover:opacity-100"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl flex-shrink-0 grayscale">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-gray-700">
                                {notification.title}
                              </h3>
                              <button
                                onClick={(e) => handleDelete(e, notification.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded flex-shrink-0"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-sm text-gray-400 mt-2">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
