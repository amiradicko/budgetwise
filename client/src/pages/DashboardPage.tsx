import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, Target, PieChart, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import GamificationWidget from '../components/GamificationWidget';
import { NDSBadge } from '../components/NDSBadge';
import { useAchievementChecker } from '../hooks/useAchievementChecker';
import { useEffect, useState } from 'react';
import { accountsService } from '../services/accounts.service';
import { transactionsService } from '../services/transactions.service';
import { goalsService } from '../services/goals.service';

interface DashboardStats {
  totalBalance: number;
  currency: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  activeGoals: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  useAchievementChecker(); // Vérifier les nouveaux badges au chargement
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    currency: 'EUR',
    monthlyIncome: 0,
    monthlyExpenses: 0,
    activeGoals: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Get current month dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        // Fetch all data in parallel
        const [balances, transactionStats, activeGoalsCount] = await Promise.all([
          accountsService.getTotalBalance().catch(() => ({})),
          transactionsService.getStats(startOfMonth, endOfMonth).catch(() => ({ 
            income: { total: 0, count: 0 }, 
            expenses: { total: 0, count: 0 },
            transfers: { total: 0, count: 0 },
            balance: 0 
          })),
          goalsService.getActiveGoalsCount().catch(() => 0),
        ]);

        // Get user's main currency or first currency found
        const userCurrency = user?.currency || 'EUR';
        const availableCurrencies = Object.keys(balances);
        const mainCurrency = availableCurrencies.includes(userCurrency) 
          ? userCurrency 
          : availableCurrencies[0] || userCurrency;

        // Use type assertion since we know balances is Record<string, number>
        const balancesMap = balances as Record<string, number>;

        setStats({
          totalBalance: mainCurrency && balancesMap[mainCurrency] ? Number(balancesMap[mainCurrency]) : 0,
          currency: mainCurrency,
          monthlyIncome: Number(transactionStats.income.total) || 0,
          monthlyExpenses: Number(transactionStats.expenses.total) || 0,
          activeGoals: activeGoalsCount,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, user?.currency]);  // Re-load when user or currency changes

  const formatCurrency = (amount: number) => {
    // Use user's preferred currency for display
    const displayCurrency = user?.currency || stats.currency || 'EUR';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: displayCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.firstName} ! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Voici un aperçu de vos finances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="group glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Solde total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : formatCurrency(stats.totalBalance)}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all">
                <Wallet className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Revenus ce mois</p>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                  {isLoading ? '...' : formatCurrency(stats.monthlyIncome)}
                </p>
              </div>
              <div className="p-4 gradient-primary rounded-2xl shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/50 transition-all">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Dépenses ce mois</p>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
                  {isLoading ? '...' : formatCurrency(stats.monthlyExpenses)}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg shadow-red-500/30 group-hover:shadow-xl group-hover:shadow-red-500/50 transition-all">
                <PieChart className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Objectifs actifs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.activeGoals}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Gamification Widget */}
        <div className="mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <GamificationWidget />
        </div>

        {/* Quick Actions */}
        <div className="glass-effect rounded-2xl p-6 mb-8 animate-slide-up" style={{animationDelay: '0.5s'}}>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Actions rapides ⚡</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/accounts"
              className="group flex items-center justify-between p-5 bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900">Mes comptes</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/transactions"
              className="group flex items-center justify-between p-5 bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="font-semibold text-gray-900">Transactions</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/budgets"
              className="group flex items-center justify-between p-5 bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <PieChart className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-900">Budgets</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/goals"
              className="group flex items-center justify-between p-5 bg-gradient-to-br from-white to-pink-50 border border-pink-100 rounded-xl hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                  <Target className="h-5 w-5 text-pink-600" />
                </div>
                <span className="font-semibold text-gray-900">Objectifs</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        <div className="glass-effect rounded-2xl p-6 animate-slide-up" style={{animationDelay: '0.6s'}}>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Pour commencer 🚀</h3>
          <div className="space-y-5">
            <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-200">
              <div className="flex-shrink-0 w-10 h-10 gradient-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Ajoutez vos comptes</h4>
                <p className="text-sm text-gray-600">
                  Créez vos comptes bancaires, en espèces, ou cartes de crédit
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-200">
              <div className="flex-shrink-0 w-10 h-10 gradient-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Enregistrez vos transactions</h4>
                <p className="text-sm text-gray-600">
                  Suivez vos revenus et dépenses au quotidien
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-200">
              <div className="flex-shrink-0 w-10 h-10 gradient-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Définissez vos budgets</h4>
                <p className="text-sm text-gray-600">
                  Créez des budgets mensuels pour mieux contrôler vos dépenses
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-200">
              <div className="flex-shrink-0 w-10 h-10 gradient-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Fixez vos objectifs</h4>
                <p className="text-sm text-gray-600">
                  Épargnez pour vos projets et suivez votre progression
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Badge Nefertiti Digital Solutions */}
      <NDSBadge />
    </Layout>
  );
}
