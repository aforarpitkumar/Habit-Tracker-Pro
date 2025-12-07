export interface CelebrationTrigger {
  id: string;
  type: 'streak' | 'completion' | 'milestone' | 'challenge' | 'achievement';
  condition: {
    event: string;
    value: number;
    comparison: 'equals' | 'greater_than' | 'multiple_of';
  };
  priority: 'low' | 'medium' | 'high' | 'epic';
  animation: CelebrationAnimation;
  message: CelebrationMessage;
  sound?: string;
  duration: number; // milliseconds
}

export interface CelebrationAnimation {
  type: 'confetti' | 'fireworks' | 'sparkles' | 'bounce' | 'pulse' | 'glow';
  variant: 'basic' | 'colorful' | 'rainbow' | 'gold' | 'gradient';
  intensity: 'subtle' | 'medium' | 'intense' | 'epic';
  elements: string[]; // emojis or icons
}

export interface CelebrationMessage {
  primary: string;
  secondary?: string;
  emoji: string;
  color: string;
  encouragement: string[];
}

export const CELEBRATION_TRIGGERS: CelebrationTrigger[] = [
  // Streak Celebrations
  {
    id: 'first-completion',
    type: 'completion',
    condition: {
      event: 'habit_completed',
      value: 1,
      comparison: 'equals'
    },
    priority: 'medium',
    animation: {
      type: 'sparkles',
      variant: 'colorful',
      intensity: 'medium',
      elements: ['✨', '🌟', '⭐']
    },
    message: {
      primary: 'Great Start!',
      secondary: 'You completed your first habit today!',
      emoji: '🎉',
      color: '#10B981',
      encouragement: [
        'Every journey begins with a single step!',
        'You\'re off to a fantastic start!',
        'This is the beginning of something amazing!'
      ]
    },
    duration: 3000
  },
  {
    id: 'streak-3',
    type: 'streak',
    condition: {
      event: 'streak_reached',
      value: 3,
      comparison: 'equals'
    },
    priority: 'medium',
    animation: {
      type: 'confetti',
      variant: 'basic',
      intensity: 'medium',
      elements: ['🔥', '🎯', '💪']
    },
    message: {
      primary: '3-Day Streak!',
      secondary: 'You\'re building momentum!',
      emoji: '🔥',
      color: '#F59E0B',
      encouragement: [
        'Consistency is key!',
        'You\'re forming a real habit!',
        'Keep the fire burning!'
      ]
    },
    duration: 4000
  },
  {
    id: 'streak-7',
    type: 'streak',
    condition: {
      event: 'streak_reached',
      value: 7,
      comparison: 'equals'
    },
    priority: 'high',
    animation: {
      type: 'fireworks',
      variant: 'rainbow',
      intensity: 'intense',
      elements: ['🎆', '🎇', '✨', '🌟']
    },
    message: {
      primary: 'One Week Strong!',
      secondary: 'You\'ve completed a full week!',
      emoji: '🏆',
      color: '#8B5CF6',
      encouragement: [
        'A week of dedication pays off!',
        'You\'re proving your commitment!',
        'This is what consistency looks like!'
      ]
    },
    duration: 5000
  },
  {
    id: 'streak-30',
    type: 'streak',
    condition: {
      event: 'streak_reached',
      value: 30,
      comparison: 'equals'
    },
    priority: 'epic',
    animation: {
      type: 'fireworks',
      variant: 'gold',
      intensity: 'epic',
      elements: ['🏆', '👑', '🥇', '⭐', '✨']
    },
    message: {
      primary: '30-Day Champion!',
      secondary: 'You\'ve built a lasting habit!',
      emoji: '👑',
      color: '#FFD700',
      encouragement: [
        'You\'ve officially formed a habit!',
        'Science says 30 days creates lasting change!',
        'You\'re absolutely incredible!'
      ]
    },
    duration: 8000
  },
  {
    id: 'streak-100',
    type: 'streak',
    condition: {
      event: 'streak_reached',
      value: 100,
      comparison: 'equals'
    },
    priority: 'epic',
    animation: {
      type: 'fireworks',
      variant: 'rainbow',
      intensity: 'epic',
      elements: ['🌈', '🦄', '💎', '🏆', '👑', '⭐']
    },
    message: {
      primary: '100-Day Legend!',
      secondary: 'You\'re in the top 1% of habit builders!',
      emoji: '🦄',
      color: '#FF6B9D',
      encouragement: [
        'You\'re officially a habit legend!',
        'Only 1% of people reach 100 days!',
        'You\'ve achieved something truly special!'
      ]
    },
    duration: 10000
  },
  // Multiple streak celebrations
  {
    id: 'streak-milestone',
    type: 'milestone',
    condition: {
      event: 'streak_reached',
      value: 10,
      comparison: 'multiple_of'
    },
    priority: 'medium',
    animation: {
      type: 'bounce',
      variant: 'colorful',
      intensity: 'medium',
      elements: ['🎯', '📈', '⚡']
    },
    message: {
      primary: 'Milestone Reached!',
      emoji: '🎯',
      color: '#06B6D4',
      encouragement: [
        'Every milestone matters!',
        'You\'re making steady progress!',
        'Keep climbing higher!'
      ]
    },
    duration: 3000
  },
  // Challenge completions
  {
    id: 'challenge-completed',
    type: 'challenge',
    condition: {
      event: 'challenge_completed',
      value: 1,
      comparison: 'equals'
    },
    priority: 'high',
    animation: {
      type: 'confetti',
      variant: 'rainbow',
      intensity: 'intense',
      elements: ['🏅', '🎊', '🎉', '✨']
    },
    message: {
      primary: 'Challenge Complete!',
      secondary: 'You conquered the challenge!',
      emoji: '🏅',
      color: '#EC4899',
      encouragement: [
        'You rose to the challenge!',
        'Challenges make you stronger!',
        'What an achievement!'
      ]
    },
    duration: 6000
  },
  // Perfect day (all habits completed)
  {
    id: 'perfect-day',
    type: 'completion',
    condition: {
      event: 'perfect_day',
      value: 1,
      comparison: 'equals'
    },
    priority: 'high',
    animation: {
      type: 'glow',
      variant: 'gold',
      intensity: 'intense',
      elements: ['⭐', '🌟', '✨', '💫']
    },
    message: {
      primary: 'Perfect Day!',
      secondary: 'You completed all your habits today!',
      emoji: '⭐',
      color: '#F59E0B',
      encouragement: [
        'You nailed every single habit!',
        'Perfection in action!',
        'Today was absolutely amazing!'
      ]
    },
    duration: 5000
  }
];

export function getCelebrationTrigger(
  eventType: string,
  value: number
): CelebrationTrigger | null {
  return CELEBRATION_TRIGGERS.find(trigger => {
    const condition = trigger.condition;
    if (condition.event !== eventType) return false;
    
    switch (condition.comparison) {
      case 'equals':
        return value === condition.value;
      case 'greater_than':
        return value > condition.value;
      case 'multiple_of':
        return value % condition.value === 0 && value > 0;
      default:
        return false;
    }
  }) || null;
}

export function getRandomEncouragement(trigger: CelebrationTrigger): string {
  const encouragements = trigger.message.encouragement;
  const randomIndex = Math.floor(Math.random() * encouragements.length);
  return encouragements[randomIndex];
}

export function shouldShowCelebration(
  eventType: string,
  value: number,
  priority: CelebrationTrigger['priority'] = 'low'
): boolean {
  const trigger = getCelebrationTrigger(eventType, value);
  if (!trigger) return false;
  
  const priorityOrder = { 'low': 0, 'medium': 1, 'high': 2, 'epic': 3 };
  return priorityOrder[trigger.priority] >= priorityOrder[priority];
}

// Animation configuration
export const ANIMATION_CONFIG = {
  confetti: {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  },
  fireworks: {
    particleCount: 150,
    spread: 120,
    origin: { y: 0.4 }
  },
  sparkles: {
    particleCount: 50,
    spread: 45,
    origin: { y: 0.8 }
  }
};