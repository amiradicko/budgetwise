import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import insightsService from '../services/insights.service';
import type { InsightData, Prediction, Anomaly, Recommendation, CategoryTrend, SpendingPattern } from '@budgetwise/shared';
import { Card } from '../components/ui/Card';
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';

const InsightsPage = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const {
    data: insights,
    isLoading,
    error,
  } = useQuery<InsightData>({
    queryKey: ['insights', selectedMonth, selectedYear],
    queryFn: () => insightsService.getInsights(selectedMonth, selectedYear),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Erreur lors du chargement des insights</div>
      </div>
    );
  }

  if (!insights) return null;

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'danger':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ArrowUp className="w-4 h-4 text-red-600" />;
      case 'decreasing':
        return <ArrowDown className="w-4 h-4 text-green-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-red-600';
      case 'decreasing':
        return 'text-green-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Insights & IA</h1>
            </div>
            <p className="text-blue-100 text-lg">Analyses intelligentes propulsées par l'IA</p>
          </div>

          {/* Sélecteur de mois/année */}
          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-white focus:outline-none font-semibold text-gray-700 cursor-pointer hover:bg-white transition-all"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-white focus:outline-none font-semibold text-gray-700 cursor-pointer hover:bg-white transition-all"
            >
              {[2024, 2025, 2026, 2027].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Score de santé budgétaire */}
      <div className={`relative overflow-hidden rounded-2xl border-2 ${getHealthColor(insights.budgetHealth.status)} shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Santé Budgétaire</h2>
                  <p className="text-sm text-gray-600">Analyse globale de votre situation</p>
                </div>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {insights.budgetHealth.message}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-xs text-gray-600">Respectés</p>
                    <p className="text-lg font-bold text-green-700">{insights.budgetHealth.budgetsOnTrack}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 rounded-xl border border-orange-200">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-xs text-gray-600">Dépassés</p>
                    <p className="text-lg font-bold text-orange-700">{insights.budgetHealth.budgetsOverBudget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-xs text-gray-600">Épargne</p>
                    <p className="text-lg font-bold text-blue-700">{insights.budgetHealth.savingsRate}%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40 drop-shadow-lg">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={`${(insights.budgetHealth.score / 100) * 439.8} 439.8`}
                    className="transition-all duration-1000 drop-shadow-xl"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {insights.budgetHealth.score}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold mt-1">/ 100</span>
                </div>
              </div>
              <div className="mt-3 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg">
                <span className="text-sm font-bold text-white">Score Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prédictions */}
      {insights.predictions.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Prédictions IA</h2>
              <p className="text-sm text-gray-600">Anticipez vos finances futures</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {insights.predictions.map((prediction: Prediction) => (
              <div
                key={prediction.id}
                className={`group relative overflow-hidden rounded-xl border-l-4 ${getSeverityColor(prediction.severity)} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform">
                      {prediction.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-gray-900">{prediction.title}</h3>
                      <p className="text-gray-700 mb-4 text-sm leading-relaxed">{prediction.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Niveau de confiance</span>
                          <span className="font-bold">{prediction.confidence}%</span>
                        </div>
                        <div className="relative bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 shadow-lg"
                            style={{ width: `${prediction.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anomalies */}
      {insights.anomalies.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Anomalies Détectées</h2>
              <p className="text-sm text-gray-600">Dépenses inhabituelles identifiées</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {insights.anomalies.map((anomaly: Anomaly) => (
              <div
                key={anomaly.id}
                className={`group relative overflow-hidden rounded-xl border-l-4 ${getSeverityColor(anomaly.severity)} shadow-md hover:shadow-xl transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white via-orange-50/30 to-transparent"></div>
                <div className="relative p-5 flex items-center justify-between">
                  <div className="flex-1 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{anomaly.title}</h3>
                      <p className="text-gray-700 mb-2">{anomaly.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          Écart: <span className="font-bold text-orange-600">+{Math.round(anomaly.deviationPercent)}%</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md ${getSeverityColor(
                        anomaly.severity
                      )}`}
                    >
                      {anomaly.severity === 'high' ? '🔴 Élevé' : anomaly.severity === 'medium' ? '🟡 Moyen' : '🟢 Faible'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations */}
      {insights.recommendations.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recommandations Intelligentes</h2>
              <p className="text-sm text-gray-600">Conseils personnalisés pour optimiser vos finances</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {insights.recommendations.map((rec: Recommendation) => (
              <div
                key={rec.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-bl-full"></div>
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform">
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{rec.title}</h3>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(rec.priority)} shadow-lg`}></div>
                      </div>
                      <p className="text-gray-700 mb-4 text-sm leading-relaxed">{rec.description}</p>
                      {rec.potentialSavings && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-3 rounded-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">💰</span>
                            <div>
                              <p className="text-xs text-gray-600">Économie potentielle</p>
                              <p className="text-lg font-bold text-green-700">
                                {Math.round(rec.potentialSavings)} XOF
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tendances par catégorie */}
      {insights.trends.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tendances par Catégorie</h2>
              <p className="text-sm text-gray-600">Évolution de vos dépenses</p>
            </div>
          </div>
          <div className="rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-5">
              {insights.trends.slice(0, 8).map((trend: CategoryTrend, index: number) => (
                <div
                  key={trend.categoryId}
                  className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: trend.color }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg text-gray-900">{trend.categoryName}</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                          {getTrendIcon(trend.trend)}
                          <span className={`text-sm font-bold ${getTrendColor(trend.trend)}`}>
                            {trend.changePercent > 0 ? '+' : ''}
                            {Math.round(trend.changePercent)}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 px-3 py-2 rounded-lg">
                          <p className="text-xs text-gray-600">Ce mois</p>
                          <p className="text-sm font-bold text-blue-700">{Math.round(trend.currentMonthSpending)} XOF</p>
                        </div>
                        <div className="bg-purple-50 px-3 py-2 rounded-lg">
                          <p className="text-xs text-gray-600">Mois dernier</p>
                          <p className="text-sm font-bold text-purple-700">{Math.round(trend.lastMonthSpending)} XOF</p>
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-lg">
                          <p className="text-xs text-gray-600">Moyenne</p>
                          <p className="text-sm font-bold text-gray-700">{Math.round(trend.averageMonthlySpending)} XOF</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Patterns de dépenses */}
      {insights.spendingPatterns.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vos Habitudes de Dépenses</h2>
              <p className="text-sm text-gray-600">Patterns détectés dans votre comportement</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {insights.spendingPatterns.map((pattern: SpendingPattern, index: number) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/20 rounded-bl-full"></div>
                <div className="relative p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl">📊</div>
                    <h3 className="font-bold text-xl text-gray-900 leading-tight">{pattern.pattern}</h3>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{pattern.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Impact financier</p>
                      <p className="text-lg font-bold text-purple-700">{Math.round(pattern.impact)} XOF</p>
                    </div>
                    <div className="flex-1 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Fréquence</p>
                      <p className="text-lg font-bold text-purple-700 capitalize">{pattern.frequency}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucune donnée */}
      {insights.predictions.length === 0 &&
        insights.anomalies.length === 0 &&
        insights.recommendations.length === 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-purple-200 shadow-xl">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative text-center py-20">
              <div className="text-8xl mb-6 animate-bounce">📊</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Pas assez de données</h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
                Ajoutez plus de transactions et de budgets pour générer des insights personnalisés par notre IA
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl transition-all cursor-pointer">
                  Ajouter des transactions
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default InsightsPage;
