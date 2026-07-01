import { useState, useEffect } from 'react';
import { Trophy, Star, TrendingUp, Flame, Target, Award } from 'lucide-react';
import achievementsService from '../services/achievements.service';
import type { Achievement, UserStats } from '@budgetwise/shared';
import { Card, CardContent } from '../components/ui/Card';

export default function AchievementsPage() {
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [locked, setLocked] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [achievementsData, statsData] = await Promise.all([
        achievementsService.getMy(),
        achievementsService.getStats(),
      ]);
      setUnlocked(achievementsData.unlocked);
      setLocked(achievementsData.locked);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'ALL', label: 'Tous', icon: Trophy },
    { key: 'BEGINNER', label: 'Débutant', icon: Star },
    { key: 'SAVER', label: 'Épargnant', icon: TrendingUp },
    { key: 'STREAK', label: 'Régularité', icon: Flame },
    { key: 'BUDGETER', label: 'Budgétaire', icon: Target },
    { key: 'GOAL_ACHIEVER', label: 'Objectifs', icon: Award },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BRONZE':
        return 'from-amber-600 to-amber-800';
      case 'SILVER':
        return 'from-gray-400 to-gray-600';
      case 'GOLD':
        return 'from-yellow-400 to-yellow-600';
      case 'PLATINUM':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'BRONZE':
        return 'Bronze';
      case 'SILVER':
        return 'Argent';
      case 'GOLD':
        return 'Or';
      case 'PLATINUM':
        return 'Platine';
      default:
        return tier;
    }
  };

  const filteredUnlocked =
    activeCategory === 'ALL'
      ? unlocked
      : unlocked.filter((a) => a.category === activeCategory);

  const filteredLocked =
    activeCategory === 'ALL'
      ? locked
      : locked.filter((a) => a.category === activeCategory);

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient flex items-center gap-3">
              <Trophy className="h-10 w-10" />
              Réalisations
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Débloquez des badges en utilisant BudgetWise !
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl gradient-primary">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Niveau</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalPoints}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-600">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Streak Actuel</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.currentStreak} 🔥
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Badges</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {unlocked.length}/{unlocked.length + locked.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === cat.key
                    ? 'gradient-primary text-white shadow-lg scale-105'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Unlocked Achievements */}
        {filteredUnlocked.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Débloqués ({filteredUnlocked.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUnlocked.map((achievement) => (
                <Card
                  key={achievement.id}
                  hover
                  className="relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getTierColor(
                      achievement.tier
                    )} opacity-10`}
                  ></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                            {achievement.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${getTierColor(
                              achievement.tier
                            )}`}
                          >
                            {getTierLabel(achievement.tier)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            +{achievement.points} points
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Débloqué ✓
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {filteredLocked.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Award className="h-6 w-6 text-gray-400" />
              À Débloquer ({filteredLocked.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocked.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="opacity-75 hover:opacity-90 transition-opacity"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl grayscale">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                            {achievement.name}
                          </h3>
                          <span className="px-2 py-1 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700">
                            {getTierLabel(achievement.tier)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-500 dark:text-gray-500">
                            +{achievement.points} points
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-600">
                            🔒 Verrouillé
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
