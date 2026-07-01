import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import smartAlertsService from '../services/smartAlerts.service';
import type { SmartAlert } from '@budgetwise/shared';
import { Card } from '../components/ui/Card';
import { Bell, AlertTriangle, AlertCircle, Info, TrendingUp, Sparkles, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

const SmartAlertsPage = () => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const queryClient = useQueryClient();

  // Récupérer les alertes
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['smartAlerts', showUnreadOnly],
    queryFn: () => smartAlertsService.getAlerts(showUnreadOnly),
  });

  // Générer les alertes
  const generateMutation = useMutation({
    mutationFn: () => smartAlertsService.generateAlerts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smartAlerts'] });
    },
  });

  // Marquer comme lue
  const markAsReadMutation = useMutation({
    mutationFn: (alertId: string) => smartAlertsService.markAsRead(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smartAlerts'] });
    },
  });

  // Marquer toutes comme lues
  const markAllAsReadMutation = useMutation({
    mutationFn: () => smartAlertsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smartAlerts'] });
    },
  });

  // Supprimer une alerte
  const deleteMutation = useMutation({
    mutationFn: (alertId: string) => smartAlertsService.deleteAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smartAlerts'] });
    },
  });

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'ERROR' || type === 'BUDGET_EXCEEDED') {
      return <AlertCircle className="w-6 h-6" />;
    }
    if (severity === 'WARNING' || type === 'BUDGET_WARNING') {
      return <AlertTriangle className="w-6 h-6" />;
    }
    if (type === 'SAVING_OPPORTUNITY') {
      return <TrendingUp className="w-6 h-6" />;
    }
    if (type === 'GOAL_PROGRESS') {
      return <CheckCircle className="w-6 h-6" />;
    }
    return <Info className="w-6 h-6" />;
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'ERROR':
        return 'from-red-500 to-rose-500 border-red-300';
      case 'WARNING':
        return 'from-yellow-500 to-amber-500 border-yellow-300';
      case 'SUCCESS':
        return 'from-green-500 to-emerald-500 border-green-300';
      default:
        return 'from-blue-500 to-indigo-500 border-blue-300';
    }
  };

  const getAlertBgColor = (severity: string) => {
    switch (severity) {
      case 'ERROR':
        return 'bg-red-50 border-red-200';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200';
      case 'SUCCESS':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'BUDGET_WARNING':
        return 'Alerte Budget';
      case 'BUDGET_EXCEEDED':
        return 'Budget Dépassé';
      case 'UNUSUAL_SPENDING':
        return 'Dépense Inhabituelle';
      case 'SAVING_OPPORTUNITY':
        return 'Opportunité d\'Épargne';
      case 'GOAL_PROGRESS':
        return 'Progression Objectif';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadCount = alerts?.filter((a: SmartAlert) => !a.isRead).length || 0;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alertes Intelligentes</h1>
          <p className="text-gray-600 mt-1">
            Restez informé de votre situation financière en temps réel
          </p>
        </div>
        <button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {generateMutation.isPending ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {generateMutation.isPending ? 'Génération...' : 'Générer Alertes'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alertes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{alerts?.length || 0}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non Lues</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{unreadCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Opportunités</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {alerts?.filter((a: SmartAlert) => a.type === 'SAVING_OPPORTUNITY').length || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              showUnreadOnly
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showUnreadOnly ? 'Afficher toutes' : 'Non lues seulement'}
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Marquer toutes comme lues
          </button>
        )}
      </div>

      {/* Liste des alertes */}
      {alerts && alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert: SmartAlert) => (
            <Card
              key={alert.id}
              className={`${getAlertBgColor(alert.severity)} hover:shadow-lg transition-shadow ${
                !alert.isRead ? 'border-l-4' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icône */}
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getAlertColor(alert.severity)} text-white`}>
                    {getAlertIcon(alert.type, alert.severity)}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-1 bg-white rounded-full border">
                            {getAlertTypeLabel(alert.type)}
                          </span>
                          {!alert.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{alert.title}</h3>
                        <p className="text-gray-700 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(alert.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!alert.isRead && (
                          <button
                            onClick={() => markAsReadMutation.mutate(alert.id)}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                            title="Marquer comme lue"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMutation.mutate(alert.id)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {showUnreadOnly ? 'Aucune alerte non lue' : 'Aucune alerte'}
          </h3>
          <p className="text-gray-600 mb-6">
            {showUnreadOnly
              ? 'Toutes vos alertes ont été lues'
              : 'Générez des alertes intelligentes pour suivre votre budget'}
          </p>
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2 disabled:opacity-50"
          >
            {generateMutation.isPending ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {generateMutation.isPending ? 'Génération...' : 'Générer Alertes'}
          </button>
        </Card>
      )}
    </div>
  );
};

export default SmartAlertsPage;
