export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'weekly' | 'monthly' | 'seasonal' | 'special';
  duration: number; // days
  startDate: Date;
  endDate: Date;
  target: {
    type: 'days' | 'streak' | 'total' | 'percentage';
    value: number;
    description: string;
  };
  rewards: {
    type: 'badge' | 'points' | 'title';
    value: string;
    description: string;
  }[];
  participants: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isActive: boolean;
}

export interface UserChallengeProgress {
  challengeId: string;
  userId: string;
  startedAt: Date;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  currentStreak: number;
  bestStreak: number;
  dailyProgress: {
    date: string;
    completed: boolean;
    value: number;
  }[];
}

// Sample challenges that rotate weekly/monthly
export const COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'challenge-1',
    title: '7-Day Consistency Challenge',
    description: 'Complete any habit for 7 consecutive days. Perfect for building momentum and establishing new routines.',
    icon: '🔥',
    category: 'weekly',
    duration: 7,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    target: {
      type: 'streak',
      value: 7,
      description: 'Achieve a 7-day streak in any habit'
    },
    rewards: [
      {
        type: 'badge',
        value: 'Consistency Champion',
        description: 'Earned for completing the 7-Day Consistency Challenge'
      },
      {
        type: 'points',
        value: '100',
        description: '100 motivation points'
      }
    ],
    participants: 1247,
    difficulty: 'beginner',
    tags: ['consistency', 'streak', 'momentum'],
    isActive: true
  },
  {
    id: 'challenge-2',
    title: 'Mindful March',
    description: 'Dedicate time to mindfulness, meditation, or mental wellness for 21 days. Transform your mental clarity and peace.',
    icon: '🧘',
    category: 'monthly',
    duration: 21,
    startDate: new Date(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    target: {
      type: 'days',
      value: 15,
      description: 'Complete mindfulness activities on 15 out of 21 days'
    },
    rewards: [
      {
        type: 'badge',
        value: 'Mindful Master',
        description: 'Achieved mindfulness mastery in March'
      },
      {
        type: 'title',
        value: 'Zen Practitioner',
        description: 'Special title for mindfulness dedication'
      }
    ],
    participants: 856,
    difficulty: 'intermediate',
    tags: ['mindfulness', 'meditation', 'wellness', 'mental-health'],
    isActive: true
  },
  {
    id: 'challenge-3',
    title: 'Hydration Hero',
    description: 'Drink your target amount of water every day for 14 days. Stay hydrated and energized!',
    icon: '💧',
    category: 'weekly',
    duration: 14,
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    target: {
      type: 'percentage',
      value: 90,
      description: 'Achieve 90% completion rate for water intake'
    },
    rewards: [
      {
        type: 'badge',
        value: 'Hydration Hero',
        description: 'Master of hydration and wellness'
      }
    ],
    participants: 2134,
    difficulty: 'beginner',
    tags: ['health', 'hydration', 'wellness'],
    isActive: true
  },
  {
    id: 'challenge-4',
    title: 'Reading Renaissance',
    description: 'Read for at least 20 minutes every day for 30 days. Expand your mind and knowledge.',
    icon: '📚',
    category: 'monthly',
    duration: 30,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    target: {
      type: 'days',
      value: 25,
      description: 'Read on 25 out of 30 days'
    },
    rewards: [
      {
        type: 'badge',
        value: 'Bookworm',
        description: 'Dedicated reader and learner'
      },
      {
        type: 'points',
        value: '200',
        description: '200 knowledge points'
      }
    ],
    participants: 743,
    difficulty: 'intermediate',
    tags: ['reading', 'learning', 'knowledge', 'growth'],
    isActive: true
  },
  {
    id: 'challenge-5',
    title: 'Exercise Every Day',
    description: 'Move your body every single day for 21 days. Any exercise counts - from walking to intense workouts!',
    icon: '💪',
    category: 'monthly',
    duration: 21,
    startDate: new Date(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    target: {
      type: 'streak',
      value: 21,
      description: 'Exercise every day for 21 consecutive days'
    },
    rewards: [
      {
        type: 'badge',
        value: 'Fitness Warrior',
        description: 'Unstoppable exercise dedication'
      },
      {
        type: 'title',
        value: 'Movement Master',
        description: 'For those who make movement a priority'
      }
    ],
    participants: 1892,
    difficulty: 'advanced',
    tags: ['exercise', 'fitness', 'health', 'movement'],
    isActive: true
  },
  {
    id: 'challenge-6',
    title: 'Digital Detox Weekend',
    description: 'Reduce screen time and practice digital wellness for 7 days. Reclaim your time and attention.',
    icon: '📵',
    category: 'weekly',
    duration: 7,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    target: {
      type: 'days',
      value: 5,
      description: 'Practice digital wellness on 5 out of 7 days'
    },
    rewards: [
      {
        type: 'badge',
        value: 'Digital Minimalist',
        description: 'Master of digital balance'
      }
    ],
    participants: 567,
    difficulty: 'intermediate',
    tags: ['digital-wellness', 'mindfulness', 'balance'],
    isActive: true
  }
];

export function getActiveChallenges(): CommunityChallenge[] {
  return COMMUNITY_CHALLENGES.filter(challenge => challenge.isActive);
}

export function getChallengesByCategory(category: CommunityChallenge['category']): CommunityChallenge[] {
  return COMMUNITY_CHALLENGES.filter(challenge => challenge.category === category);
}

export function getChallengesByDifficulty(difficulty: CommunityChallenge['difficulty']): CommunityChallenge[] {
  return COMMUNITY_CHALLENGES.filter(challenge => challenge.difficulty === difficulty);
}

export function calculateChallengeProgress(
  challenge: CommunityChallenge,
  userProgress: UserChallengeProgress
): number {
  switch (challenge.target.type) {
    case 'streak':
      return Math.min((userProgress.currentStreak / challenge.target.value) * 100, 100);
    case 'days':
      const completedDays = userProgress.dailyProgress.filter(day => day.completed).length;
      return Math.min((completedDays / challenge.target.value) * 100, 100);
    case 'percentage':
      return Math.min(userProgress.progress, challenge.target.value);
    case 'total':
      const totalValue = userProgress.dailyProgress.reduce((sum, day) => sum + day.value, 0);
      return Math.min((totalValue / challenge.target.value) * 100, 100);
    default:
      return 0;
  }
}

export function getDaysRemaining(challenge: CommunityChallenge): number {
  const now = new Date();
  const timeDiff = challenge.endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
}

export function formatParticipants(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}