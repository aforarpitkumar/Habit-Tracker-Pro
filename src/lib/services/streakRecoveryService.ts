/**
 * Streak Recovery and Motivation System
 * Helps users recover from streak breaks and stay motivated
 */

import type { Habit, HabitCompletion } from '@/types';

interface StreakBreak {
  habitId: string;
  previousStreak: number;
  breakDate: Date;
  daysBroken: number;
  recoveryStreak: number;
}

interface MotivationalMessage {
  type: 'recovery' | 'encouragement' | 'milestone' | 'comeback';
  title: string;
  message: string;
  action?: string;
  icon: string;
}

interface RecoveryStrategy {
  id: string;
  name: string;
  description: string;
  steps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  effectiveness: number; // 0-1
}

class StreakRecoveryService {
  private streakBreaks: StreakBreak[] = [];

  constructor() {
    this.loadStreakBreaks();
  }

  /**
   * Detect streak breaks and initiate recovery
   */
  checkForStreakBreaks(habits: Habit[], completions: HabitCompletion[]): StreakBreak[] {
    const newBreaks: StreakBreak[] = [];

    for (const habit of habits) {
      const habitCompletions = completions
        .filter(c => c.habitUuid === habit.uuid)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const streakBreak = this.detectStreakBreak(habit, habitCompletions);
      if (streakBreak) {
        const existingBreak = this.streakBreaks.find(b => 
          b.habitId === habit.uuid && 
          b.breakDate.getTime() === streakBreak.breakDate.getTime()
        );

        if (!existingBreak) {
          newBreaks.push(streakBreak);
          this.streakBreaks.push(streakBreak);
        } else {
          // Update existing break
          existingBreak.daysBroken = streakBreak.daysBroken;
          existingBreak.recoveryStreak = streakBreak.recoveryStreak;
        }
      }
    }

    this.saveStreakBreaks();
    return newBreaks;
  }

  /**
   * Generate motivational messages for recovery
   */
  generateMotivationalMessage(streakBreak: StreakBreak, habit: Habit): MotivationalMessage {
    const { previousStreak, daysBroken, recoveryStreak } = streakBreak;

    // Different messages based on situation
    if (recoveryStreak === 0 && daysBroken === 1) {
      return {
        type: 'recovery',
        title: 'One Day Reset',
        message: `Don't let yesterday's miss define today! You had a ${previousStreak}-day streak with ${habit.name}. Time to start fresh! 💪`,
        action: 'Complete today to start your comeback',
        icon: '🔄'
      };
    }

    if (recoveryStreak === 0 && daysBroken <= 3) {
      return {
        type: 'encouragement',
        title: 'Quick Recovery Mode',
        message: `${daysBroken} days off track, but your ${previousStreak}-day streak proves you can do this! Every expert was once a beginner who refused to give up.`,
        action: 'Get back on track today',
        icon: '🎯'
      };
    }

    if (recoveryStreak === 0 && daysBroken > 3) {
      return {
        type: 'encouragement',
        title: 'Fresh Start Energy',
        message: `It's been ${daysBroken} days, but remember your amazing ${previousStreak}-day streak? That strength is still inside you! Today is day 1 of your comeback story.`,
        action: 'Begin your comeback',
        icon: '🌅'
      };
    }

    if (recoveryStreak > 0 && recoveryStreak < previousStreak / 2) {
      return {
        type: 'comeback',
        title: 'Recovery in Progress',
        message: `${recoveryStreak} days back on track! You're rebuilding your ${habit.name} habit. Consistency compounds! 🔨`,
        action: 'Keep the momentum going',
        icon: '⚡'
      };
    }

    if (recoveryStreak >= previousStreak / 2) {
      return {
        type: 'milestone',
        title: 'Strong Comeback!',
        message: `${recoveryStreak} days and counting! You're more than halfway back to your ${previousStreak}-day record. Resilience is your superpower! 🦸`,
        action: 'Push towards your record',
        icon: '🚀'
      };
    }

    // Default encouragement
    return {
      type: 'encouragement',
      title: 'You\'ve Got This!',
      message: `Every day is a new opportunity to build the habit of ${habit.name}. Progress over perfection! 🌟`,
      action: 'Take action today',
      icon: '💫'
    };
  }

  /**
   * Get recovery strategies based on streak break
   */
  getRecoveryStrategies(streakBreak: StreakBreak): RecoveryStrategy[] {
    const { daysBroken, previousStreak } = streakBreak;
    const strategies: RecoveryStrategy[] = [];

    // Easy comeback strategies
    if (daysBroken <= 2) {
      strategies.push({
        id: 'quick-restart',
        name: 'Quick Restart',
        description: 'Jump right back in with your usual routine',
        steps: [
          'Don\'t overthink the missed days',
          'Complete your habit today as planned',
          'Focus on the next 3 days to rebuild momentum'
        ],
        difficulty: 'easy',
        effectiveness: 0.8
      });
    }

    // Medium recovery strategies
    if (daysBroken > 2 && daysBroken <= 7) {
      strategies.push({
        id: 'gradual-rebuild',
        name: 'Gradual Rebuild',
        description: 'Ease back into your habit with a gentler approach',
        steps: [
          'Start with 50% of your usual habit intensity',
          'Focus on consistency over performance',
          'Gradually increase back to full intensity over 1 week',
          'Celebrate small wins along the way'
        ],
        difficulty: 'medium',
        effectiveness: 0.85
      });
    }

    // Advanced recovery strategies
    if (daysBroken > 7 || previousStreak > 30) {
      strategies.push({
        id: 'habit-redesign',
        name: 'Habit Redesign',
        description: 'Analyze and improve your habit approach',
        steps: [
          'Reflect on what caused the break',
          'Identify potential obstacles and solutions',
          'Simplify the habit if it was too ambitious',
          'Create stronger environmental cues',
          'Build in accountability measures'
        ],
        difficulty: 'hard',
        effectiveness: 0.9
      });
    }

    // Universal strategies
    strategies.push({
      id: 'accountability-boost',
      name: 'Accountability Boost',
      description: 'Add external motivation and support',
      steps: [
        'Share your comeback goal with someone',
        'Set up daily check-ins',
        'Use habit tracking for visibility',
        'Reward yourself for 3-day streaks'
      ],
      difficulty: 'medium',
      effectiveness: 0.75
    });

    return strategies.sort((a, b) => b.effectiveness - a.effectiveness);
  }

  /**
   * Calculate recovery statistics
   */
  getRecoveryStats(habitId: string): {
    totalBreaks: number;
    averageRecoveryTime: number;
    longestBreak: number;
    successfulRecoveries: number;
    resilienceScore: number;
  } {
    const habitBreaks = this.streakBreaks.filter(b => b.habitId === habitId);
    
    if (habitBreaks.length === 0) {
      return {
        totalBreaks: 0,
        averageRecoveryTime: 0,
        longestBreak: 0,
        successfulRecoveries: 0,
        resilienceScore: 1
      };
    }

    const recoveredBreaks = habitBreaks.filter(b => b.recoveryStreak > 0);
    const averageRecoveryTime = recoveredBreaks.length > 0 
      ? recoveredBreaks.reduce((sum, b) => sum + b.daysBroken, 0) / recoveredBreaks.length
      : 0;

    const longestBreak = Math.max(...habitBreaks.map(b => b.daysBroken));
    const resilienceScore = recoveredBreaks.length / habitBreaks.length;

    return {
      totalBreaks: habitBreaks.length,
      averageRecoveryTime,
      longestBreak,
      successfulRecoveries: recoveredBreaks.length,
      resilienceScore
    };
  }

  /**
   * Get inspirational quotes for recovery
   */
  getRecoveryQuotes(): string[] {
    return [
      "Fall seven times, stand up eight. 🇯🇵",
      "It's not about perfect days, it's about not giving up. 💪",
      "Every expert was once a beginner who refused to give up. 🌱",
      "Progress, not perfection. 📈",
      "The comeback is always stronger than the setback. 🔥",
      "Consistency beats perfection every time. ⚡",
      "Your only competition is who you were yesterday. 🏆",
      "Small steps daily lead to big changes yearly. 👣",
      "Resilience is your superpower. 🦸‍♀️",
      "Today's a new day to build better habits. 🌅"
    ];
  }

  /**
   * Track recovery milestones
   */
  checkRecoveryMilestones(streakBreak: StreakBreak): { milestone: string; message: string } | null {
    const { recoveryStreak, previousStreak } = streakBreak;

    if (recoveryStreak === 3) {
      return {
        milestone: '3-Day Recovery',
        message: '3 days back on track! Momentum is building! 🔥'
      };
    }

    if (recoveryStreak === 7) {
      return {
        milestone: 'Week Strong',
        message: 'One week of consistency! You\'re back in the groove! 📅'
      };
    }

    if (recoveryStreak === previousStreak) {
      return {
        milestone: 'Full Recovery',
        message: `Back to your ${previousStreak}-day record! You\'ve proven your resilience! 🎉`
      };
    }

    if (recoveryStreak > previousStreak) {
      return {
        milestone: 'New Record',
        message: `${recoveryStreak} days - NEW PERSONAL BEST! Your comeback is complete! 🏆`
      };
    }

    return null;
  }

  /**
   * Detect streak break for a habit
   */
  private detectStreakBreak(habit: Habit, completions: HabitCompletion[]): StreakBreak | null {
    if (completions.length < 2) return null;

    // Find the most recent break
    let streakCount = 0;
    let breakDetected = false;
    let breakDate: Date | null = null;
    let previousStreak = 0;

    // Count current streak from the end
    for (let i = 0; i < completions.length; i++) {
      if (completions[i].completed) {
        streakCount++;
      } else {
        if (streakCount === 0) {
          // Still in break period
          continue;
        } else {
          // Found the break point
          breakDetected = true;
          breakDate = new Date(completions[i].date);
          break;
        }
      }
    }

    if (!breakDetected || !breakDate) return null;

    // Count the previous streak before the break
    for (let i = completions.findIndex(c => c.date === breakDate.toISOString().split('T')[0]) + 1; i < completions.length; i++) {
      if (completions[i].completed) {
        previousStreak++;
      } else {
        break;
      }
    }

    // Count days broken
    const daysBroken = completions
      .slice(0, completions.findIndex(c => c.completed))
      .filter(c => !c.completed).length;

    if (previousStreak < 3) return null; // Only track breaks of meaningful streaks

    return {
      habitId: habit.uuid,
      previousStreak,
      breakDate,
      daysBroken: Math.max(1, daysBroken),
      recoveryStreak: streakCount
    };
  }

  /**
   * Load streak breaks from storage
   */
  private loadStreakBreaks() {
    try {
      const stored = localStorage.getItem('streakBreaks');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.streakBreaks = parsed.map((b: any) => ({
          ...b,
          breakDate: new Date(b.breakDate)
        }));
      }
    } catch (error) {
      console.error('Failed to load streak breaks:', error);
    }
  }

  /**
   * Save streak breaks to storage
   */
  private saveStreakBreaks() {
    try {
      localStorage.setItem('streakBreaks', JSON.stringify(this.streakBreaks));
    } catch (error) {
      console.error('Failed to save streak breaks:', error);
    }
  }
}

export const streakRecoveryService = new StreakRecoveryService();
export type { StreakBreak, MotivationalMessage, RecoveryStrategy };