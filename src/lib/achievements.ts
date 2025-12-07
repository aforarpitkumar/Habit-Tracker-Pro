import type { Habit, HabitCompletion } from '@/types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'completion' | 'consistency' | 'variety' | 'milestone';
  requirement: number;
  earned: boolean;
  earnedAt?: Date;
  progress: number;
  maxProgress: number;
}

export const ACHIEVEMENT_DEFINITIONS = [
  // Streak Achievements
  {
    id: 'streak_week',
    name: 'Week Warrior',
    description: 'Complete a habit for 7 days in a row',
    icon: '🔥',
    category: 'streak' as const,
    requirement: 7,
  },
  {
    id: 'streak_month',
    name: 'Monthly Master',
    description: 'Complete a habit for 30 days in a row',
    icon: '💪',
    category: 'streak' as const,
    requirement: 30,
  },
  {
    id: 'streak_hundred',
    name: 'Century Champion',
    description: 'Complete a habit for 100 days in a row',
    icon: '👑',
    category: 'streak' as const,
    requirement: 100,
  },

  // Completion Achievements
  {
    id: 'total_50',
    name: 'Half Century',
    description: 'Complete any habit 50 times',
    icon: '🎯',
    category: 'completion' as const,
    requirement: 50,
  },
  {
    id: 'total_365',
    name: 'Year Round',
    description: 'Complete any habit 365 times',
    icon: '🌟',
    category: 'completion' as const,
    requirement: 365,
  },

  // Consistency Achievements
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete all habits for 7 days in a row',
    icon: '✨',
    category: 'consistency' as const,
    requirement: 7,
  },
  {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: 'Complete all habits for 30 days in a row',
    icon: '🏆',
    category: 'consistency' as const,
    requirement: 30,
  },

  // Variety Achievements
  {
    id: 'habit_collector',
    name: 'Habit Collector',
    description: 'Create 10 different habits',
    icon: '📚',
    category: 'variety' as const,
    requirement: 10,
  },
  {
    id: 'category_master',
    name: 'Category Master',
    description: 'Have habits in 5 different categories',
    icon: '🎨',
    category: 'variety' as const,
    requirement: 5,
  },

  // Milestone Achievements
  {
    id: 'first_habit',
    name: 'First Steps',
    description: 'Create your first habit',
    icon: '🌱',
    category: 'milestone' as const,
    requirement: 1,
  },
  {
    id: 'first_completion',
    name: 'Getting Started',
    description: 'Complete your first habit',
    icon: '✅',
    category: 'milestone' as const,
    requirement: 1,
  },
  {
    id: 'habit_sharer',
    name: 'Habit Sharer',
    description: 'Share your first habit with others',
    icon: '🤝',
    category: 'milestone' as const,
    requirement: 1,
  },
];

/**
 * Calculate achievements based on user's habits and completions
 */
export function calculateAchievements(
  habits: Habit[],
  completions: HabitCompletion[],
  getStreakForHabit: (habitUuid: string) => number,
  getCompletionRate: (habitUuid: string, days: number) => number
): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map(def => {
    let progress = 0;
    let earned = false;
    let earnedAt: Date | undefined;

    switch (def.category) {
      case 'streak':
        // Find the longest streak across all habits
        const maxStreak = Math.max(0, ...habits.map(h => getStreakForHabit(h.uuid)));
        progress = Math.min(maxStreak, def.requirement);
        earned = maxStreak >= def.requirement;
        break;

      case 'completion':
        // Count total completions across all habits
        const totalCompletions = completions.filter(c => c.completed).length;
        progress = Math.min(totalCompletions, def.requirement);
        earned = totalCompletions >= def.requirement;
        break;

      case 'consistency':
        // Check if all habits were completed for the required period
        // This is a simplified check - in a real app, you'd check consecutive days
        if (habits.length > 0) {
          const allHabitsRate = habits.reduce((acc, h) => 
            acc + getCompletionRate(h.uuid, def.requirement), 0) / habits.length;
          progress = Math.min(Math.floor(allHabitsRate / 100 * def.requirement), def.requirement);
          earned = allHabitsRate >= 95; // 95% completion rate for "perfect"
        }
        break;

      case 'variety':
        if (def.id === 'habit_collector') {
          progress = Math.min(habits.length, def.requirement);
          earned = habits.length >= def.requirement;
        } else if (def.id === 'category_master') {
          // Count unique categories (simplified - using first letter of name as category)
          const categories = new Set(habits.map(h => h.name.charAt(0).toLowerCase()));
          progress = Math.min(categories.size, def.requirement);
          earned = categories.size >= def.requirement;
        }
        break;

      case 'milestone':
        if (def.id === 'first_habit') {
          progress = Math.min(habits.length, 1);
          earned = habits.length >= 1;
          if (earned && habits.length > 0) {
            earnedAt = habits[0].createdAt;
          }
        } else if (def.id === 'first_completion') {
          const hasCompletion = completions.some(c => c.completed);
          progress = hasCompletion ? 1 : 0;
          earned = hasCompletion;
          if (earned) {
            const firstCompletion = completions.find(c => c.completed);
            earnedAt = firstCompletion?.createdAt;
          }
        } else if (def.id === 'habit_sharer') {
          // This would be tracked when user uses the share feature
          // For now, we'll mark it as not earned
          progress = 0;
          earned = false;
        }
        break;
    }

    return {
      ...def,
      earned,
      earnedAt,
      progress,
      maxProgress: def.requirement,
    };
  });
}

/**
 * Get recently earned achievements (within last 7 days)
 */
export function getRecentAchievements(achievements: Achievement[]): Achievement[] {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return achievements.filter(a => 
    a.earned && 
    a.earnedAt && 
    a.earnedAt >= sevenDaysAgo
  );
}

/**
 * Get next achievement to work towards
 */
export function getNextAchievement(achievements: Achievement[]): Achievement | null {
  const unearned = achievements
    .filter(a => !a.earned)
    .sort((a, b) => (a.progress / a.maxProgress) - (b.progress / b.maxProgress));

  return unearned.length > 0 ? unearned[0] : null;
}

/**
 * Calculate overall progress percentage
 */
export function getOverallProgress(achievements: Achievement[]): number {
  if (achievements.length === 0) return 0;
  
  const earnedCount = achievements.filter(a => a.earned).length;
  return Math.round((earnedCount / achievements.length) * 100);
}