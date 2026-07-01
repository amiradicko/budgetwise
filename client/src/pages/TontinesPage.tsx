import { useState, useEffect } from 'react';
import { Users, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import tontinesService, { type Tontine } from '../services/tontines.service';

export default function TontinesPage() {
  const [tontines, setTontines] = useState<Tontine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTontines();
  }, []);

  const loadTontines = async () => {
    try {
      setLoading(true);
      const data = await tontinesService.getAll();
      setTontines(data);
    } catch (error) {
      console.error('Error loading tontines:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'COMPLETED':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'PAUSED':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Terminée';
      case 'PAUSED':
        return 'En pause';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'WEEKLY':
        return 'Hebdomadaire';
      case 'BIWEEKLY':
        return 'Bi-hebdomadaire';
      case 'MONTHLY':
        return 'Mensuelle';
      default:
        return frequency;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient flex items-center gap-3">
                <Users className="h-10 w-10" />
                Mes Tontines
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gérez vos tontines et contributions facilement 🌍
              </p>
            </div>
            <Link to="/tontines/new">
              <Button variant="primary" size="lg">
                <Plus className="h-5 w-5" />
                Nouvelle Tontine
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          {tontines.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card hover>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl gradient-primary">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {tontines.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card hover>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Actives</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {tontines.filter((t) => t.status === 'ACTIVE').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card hover>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Terminées</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {tontines.filter((t) => t.status === 'COMPLETED').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card hover>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Membres Total</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {tontines.reduce((sum, t) => sum + t.totalMembers, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tontines List */}
          {tontines.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <Users className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Aucune tontine
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Créez votre première tontine pour commencer à épargner en groupe !
                  </p>
                  <Link to="/tontines/new">
                    <Button variant="primary">
                      <Plus className="h-5 w-5" />
                      Créer une tontine
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tontines.map((tontine) => (
                <Link key={tontine.id} to={`/tontines/${tontine.id}`}>
                  <Card hover className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {tontine.name}
                        </CardTitle>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                            tontine.status
                          )}`}
                        >
                          {getStatusLabel(tontine.status)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {tontine.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {tontine.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Contribution</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(
                              Number(tontine.contributionAmount),
                              tontine.currency
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Fréquence</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {getFrequencyLabel(tontine.frequency)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Membres</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {tontine.totalMembers}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Tour actuel</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {tontine.currentRound} / {tontine.totalMembers}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                          <span>Progression</span>
                          <span>{Math.round(tontine.progress || 0)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
                            style={{ width: `${tontine.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {tontine.status === 'ACTIVE' && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <div className="flex-1 text-xs">
                            <p className="text-blue-600 dark:text-blue-400 font-semibold">
                              Prochain paiement
                            </p>
                            <p className="text-blue-700 dark:text-blue-300">
                              {formatDate(tontine.nextPaymentDate)}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
