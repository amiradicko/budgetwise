import { useEffect, useState } from 'react';
import { Trophy, Star, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import achievementsService from '../services/achievements.service';
import type { UserStats } from '@budgetwise/shared';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

export default function GamificationWidget() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentBadgesCount, setRecentBadgesCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [statsData, achievementsData] = await Promise.all([
        achievementsService.getStats(),
        achievementsService.getMy(),
      ]);
      setStats(statsData);
      
      // Compter les badges débloqués dans les dernières 24h
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const recent = achievementsData.unlocked.filter(
        (a) => a.unlockedAt && new Date(a.unlockedAt) > oneDayAgo
      );
      setRecentBadgesCount(recent.length);
    } catch (error) {
      console.error('Error loading gamification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  // Calculer la progression vers le prochain niveau
  const pointsForCurrentLevel = (stats.level - 1) * 100;
  const currentLevelPoints = stats.totalPoints - pointsForCurrentLevel;
  const progressPercentage = (currentLevelPoints / 100) * 100;

  return (
    <Card hover className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10"></div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Votre Progression
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Niveau et Points */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Niveau</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.level}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
            <p className="text-2xl font-bold text-gradient">
              {stats.totalPoints}
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span>Niveau {stats.level}</span>
            <span>{currentLevelPoints}/100 pts</span>
            <span>Niveau {stats.level + 1}</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500 shadow-glow"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <Flame className="h-5 w-5 text-orange-500" />
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Streak Actuel</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {stats.currentStreak} jour{stats.currentStreak > 1 ? 's' : ''} 🔥
            </p>
          </div>
          {stats.longestStreak > stats.currentStreak && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-500">
              Record: {stats.longestStreak}
            </div>
          )}
        </div>

        {/* Badges récents */}
        {recentBadgesCount > 0 && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              ✨ Nouveau{recentBadgesCount > 1 ? 'x' : ''} !
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {recentBadgesCount} badge{recentBadgesCount > 1 ? 's' : ''} débloqué{recentBadgesCount > 1 ? 's' : ''} récemment
            </p>
          </div>
        )}

        {/* Lien vers la page */}
        <Link
          to="/achievements"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl gradient-primary text-white font-medium hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Trophy className="h-4 w-4" />
          Voir tous les badges
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">Transactions</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {stats.totalTransactions}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">Budgets</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {stats.totalBudgetsCreated}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">Objectifs</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {stats.totalGoalsCompleted}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
