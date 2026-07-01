import prisma from '../../config/database';

// Définition des badges disponibles
export const ACHIEVEMENTS = [
  // ===== BEGINNER =====
  {
    key: 'FIRST_TRANSACTION',
    name: 'Premier Pas',
    description: 'Enregistrez votre première transaction',
    icon: '🎯',
    category: 'BEGINNER',
    tier: 'BRONZE',
    points: 10,
    requirement: { type: 'transaction_count', value: 1 },
  },
  {
    key: 'FIRST_BUDGET',
    name: 'Planificateur',
    description: 'Créez votre premier budget',
    icon: '📊',
    category: 'BEGINNER',
    tier: 'BRONZE',
    points: 15,
    requirement: { type: 'budget_count', value: 1 },
  },
  {
    key: 'FIRST_GOAL',
    name: 'Visionnaire',
    description: 'Définissez votre premier objectif d\'épargne',
    icon: '🎯',
    category: 'BEGINNER',
    tier: 'BRONZE',
    points: 15,
    requirement: { type: 'goal_count', value: 1 },
  },
  
  // ===== STREAKS =====
  {
    key: 'STREAK_7',
    name: 'Semaine Parfaite',
    description: 'Connectez-vous 7 jours consécutifs',
    icon: '🔥',
    category: 'STREAK',
    tier: 'BRONZE',
    points: 25,
    requirement: { type: 'streak', value: 7 },
  },
  {
    key: 'STREAK_30',
    name: 'Mois Exceptionnel',
    description: 'Connectez-vous 30 jours consécutifs',
    icon: '🔥',
    category: 'STREAK',
    tier: 'SILVER',
    points: 100,
    requirement: { type: 'streak', value: 30 },
  },
  {
    key: 'STREAK_90',
    name: 'Discipline de Fer',
    description: 'Connectez-vous 90 jours consécutifs',
    icon: '🔥',
    category: 'STREAK',
    tier: 'GOLD',
    points: 300,
    requirement: { type: 'streak', value: 90 },
  },
  
  // ===== SAVER =====
  {
    key: 'SAVE_10K',
    name: 'Petit Économe',
    description: 'Économisez 10 000 FCFA',
    icon: '💰',
    category: 'SAVER',
    tier: 'BRONZE',
    points: 20,
    requirement: { type: 'total_saved', value: 10000 },
  },
  {
    key: 'SAVE_100K',
    name: 'Grand Économe',
    description: 'Économisez 100 000 FCFA',
    icon: '💰',
    category: 'SAVER',
    tier: 'SILVER',
    points: 50,
    requirement: { type: 'total_saved', value: 100000 },
  },
  {
    key: 'SAVE_1M',
    name: 'Millionnaire',
    description: 'Économisez 1 000 000 FCFA',
    icon: '💎',
    category: 'SAVER',
    tier: 'GOLD',
    points: 200,
    requirement: { type: 'total_saved', value: 1000000 },
  },
  
  // ===== BUDGETER =====
  {
    key: 'BUDGET_MASTER',
    name: 'Maître du Budget',
    description: 'Respectez votre budget pendant 3 mois consécutifs',
    icon: '🎓',
    category: 'BUDGETER',
    tier: 'GOLD',
    points: 150,
    requirement: { type: 'budget_respected', value: 3 },
  },
  
  // ===== GOAL_ACHIEVER =====
  {
    key: 'FIRST_GOAL_COMPLETED',
    name: 'Objectif Atteint',
    description: 'Complétez votre premier objectif d\'épargne',
    icon: '🏆',
    category: 'GOAL_ACHIEVER',
    tier: 'SILVER',
    points: 75,
    requirement: { type: 'goals_completed', value: 1 },
  },
  {
    key: 'GOAL_CHAMPION',
    name: 'Champion des Objectifs',
    description: 'Complétez 5 objectifs d\'épargne',
    icon: '🏆',
    category: 'GOAL_ACHIEVER',
    tier: 'GOLD',
    points: 250,
    requirement: { type: 'goals_completed', value: 5 },
  },
  
  // ===== TRANSACTION =====
  {
    key: 'TRANSACTION_50',
    name: 'Actif',
    description: 'Enregistrez 50 transactions',
    icon: '📝',
    category: 'BEGINNER',
    tier: 'SILVER',
    points: 40,
    requirement: { type: 'transaction_count', value: 50 },
  },
  {
    key: 'TRANSACTION_200',
    name: 'Super Actif',
    description: 'Enregistrez 200 transactions',
    icon: '📝',
    category: 'BEGINNER',
    tier: 'GOLD',
    points: 100,
    requirement: { type: 'transaction_count', value: 200 },
  },
];

class AchievementsService {
  // Initialiser les achievements dans la DB (à appeler au démarrage)
  async seedAchievements() {
    for (const achievement of ACHIEVEMENTS) {
      await prisma.achievement.upsert({
        where: { key: achievement.key },
        create: achievement,
        update: achievement,
      });
    }
  }

  // Obtenir tous les achievements
  async getAllAchievements() {
    return await prisma.achievement.findMany({
      orderBy: [{ category: 'asc' }, { tier: 'asc' }],
    });
  }

  // Obtenir les achievements d'un utilisateur
  async getUserAchievements(userId: string) {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    const allAchievements = await this.getAllAchievements();
    const unlockedIds = new Set(userAchievements.map((ua: any) => ua.achievementId));

    const locked = allAchievements
      .filter((a: any) => !unlockedIds.has(a.id) && !a.isSecret)
      .map((a: any) => ({ ...a, locked: true, progress: 0 }));

    const unlocked = userAchievements.map((ua: any) => ({
      ...ua.achievement,
      locked: false,
      unlockedAt: ua.unlockedAt,
      progress: 100,
    }));

    return {
      unlocked,
      locked,
      stats: {
        total: allAchievements.length,
        unlocked: unlocked.length,
        points: unlocked.reduce((sum: number, a: any) => sum + a.points, 0),
      },
    };
  }

  // Obtenir les stats d'un utilisateur
  async getUserStats(userId: string) {
    let stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      stats = await prisma.userStats.create({
        data: { userId },
      });
    }

    return stats;
  }

  // Mettre à jour le streak
  async updateStreak(userId: string) {
    const stats = await this.getUserStats(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = stats.lastActivityDate;
    let newStreak = stats.currentStreak;

    if (!lastActivity) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastActivity);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Même jour, pas de changement
        return stats;
      } else if (diffDays === 1) {
        // Jour consécutif
        newStreak = stats.currentStreak + 1;
      } else {
        // Streak cassé
        newStreak = 1;
      }
    }

    const updatedStats = await prisma.userStats.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, stats.longestStreak),
        lastActivityDate: new Date(),
      },
    });

    // Vérifier les achievements de streak
    await this.checkAchievements(userId);

    return updatedStats;
  }

  // Incrémenter les stats de transaction
  async incrementTransactionCount(userId: string) {
    const stats = await prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalTransactions: 1,
      },
      update: {
        totalTransactions: { increment: 1 },
      },
    });

    await this.checkAchievements(userId);
    return stats;
  }

  // Incrémenter les stats de budget
  async incrementBudgetCount(userId: string) {
    const stats = await prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalBudgetsCreated: 1,
      },
      update: {
        totalBudgetsCreated: { increment: 1 },
      },
    });

    await this.checkAchievements(userId);
    return stats;
  }

  // Incrémenter les stats de goal
  async incrementGoalCompleted(userId: string) {
    const stats = await prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalGoalsCompleted: 1,
      },
      update: {
        totalGoalsCompleted: { increment: 1 },
      },
    });

    await this.checkAchievements(userId);
    return stats;
  }

  // Mettre à jour le total épargné
  async updateTotalSaved(userId: string, amount: number) {
    const stats = await prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalSaved: amount,
      },
      update: {
        totalSaved: { increment: amount },
      },
    });

    await this.checkAchievements(userId);
    return stats;
  }

  // Vérifier et débloquer les achievements
  async checkAchievements(userId: string) {
    const stats = await this.getUserStats(userId);
    const allAchievements = await this.getAllAchievements();
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });

    const unlockedIds = new Set(userAchievements.map((ua: any) => ua.achievementId));
    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;

      const req = achievement.requirement as any;
      let unlocked = false;

      switch (req.type) {
        case 'transaction_count':
          unlocked = stats.totalTransactions >= req.value;
          break;
        case 'budget_count':
          unlocked = stats.totalBudgetsCreated >= req.value;
          break;
        case 'goal_count':
          const goalCount = await prisma.savingGoal.count({
            where: { userId },
          });
          unlocked = goalCount >= req.value;
          break;
        case 'goals_completed':
          unlocked = stats.totalGoalsCompleted >= req.value;
          break;
        case 'streak':
          unlocked = stats.currentStreak >= req.value;
          break;
        case 'total_saved':
          unlocked = Number(stats.totalSaved) >= req.value;
          break;
      }

      if (unlocked) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        // Ajouter des points
        await prisma.userStats.update({
          where: { userId },
          data: {
            totalPoints: { increment: achievement.points },
            level: {
              set: Math.floor((stats.totalPoints + achievement.points) / 100) + 1,
            },
          },
        });

        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  // Obtenir le leaderboard (top 10 utilisateurs)
  async getLeaderboard() {
    const topUsers = await prisma.userStats.findMany({
      take: 10,
      orderBy: { totalPoints: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return topUsers.map((stat: any, index: number) => ({
      rank: index + 1,
      userId: stat.userId,
      name: `${stat.user.firstName} ${stat.user.lastName}`,
      avatar: stat.user.avatar,
      level: stat.level,
      points: stat.totalPoints,
      streak: stat.currentStreak,
    }));
  }
}

export default new AchievementsService();
