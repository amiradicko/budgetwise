// Achievement types
export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: 'BEGINNER' | 'SAVER' | 'BUDGETER' | 'STREAK' | 'GOAL_ACHIEVER';
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  points: number;
  requirement: {
    type: string;
    value: number;
  };
  isSecret: boolean;
  locked?: boolean;
  unlockedAt?: Date;
  progress?: number;
}

export interface UserAchievements {
  unlocked: Achievement[];
  locked: Achievement[];
  stats: {
    total: number;
    unlocked: number;
    points: number;
  };
}

export interface UserStats {
  id: string;
  userId: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  totalTransactions: number;
  totalBudgetsCreated: number;
  totalGoalsCompleted: number;
  totalSaved: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  level: number;
  points: number;
  streak: number;
}
