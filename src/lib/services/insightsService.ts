/**
 * AI-powered Insights and Recommendations Service
 * Analyzes habit patterns and provides intelligent recommendations
 */

import type { Habit, HabitCompletion } from '@/types';

interface HabitInsight {
  type: 'strength' | 'opportunity' | 'warning' | 'recommendation';
  title: string;
  description: string;
  habitId?: string;
  confidence: number; // 0-1
  actionable: boolean;
  icon: string;
}

interface PersonalizedRecommendation {
  id: string;
  type: 'new_habit' | 'schedule_optimization' | 'habit_combination' | 'difficulty_adjustment';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  estimatedImpact: 'low' | 'medium' | 'high';
  habitTemplate?: Partial<Habit>;
}

interface PatternAnalysis {
  bestPerformingDays: number[];
  bestPerformingTimes: string[];
  consistencyScore: number;
  trendDirection: 'improving' | 'declining' | 'stable';
  seasonalPatterns: Record<string, number>;
  streakPatterns: {
    averageStreak: number;
    longestStreak: number;
    breakFrequency: number;
  };
}

class InsightsService {
  /**
   * Generate insights for all habits
   */
  generateInsights(habits: Habit[], completions: HabitCompletion[]): HabitInsight[] {
    const insights: HabitInsight[] = [];
    
    for (const habit of habits) {
      const habitCompletions = completions.filter(c => c.habitUuid === habit.uuid);
      insights.push(...this.analyzeHabitPerformance(habit, habitCompletions));
    }
    
    // Add overall insights
    insights.push(...this.generateOverallInsights(habits, completions));
    
    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Analyze individual habit performance
   */
  private analyzeHabitPerformance(habit: Habit, completions: HabitCompletion[]): HabitInsight[] {
    const insights: HabitInsight[] = [];
    const recentCompletions = this.getRecentCompletions(completions, 30);
    
    if (recentCompletions.length === 0) {
      insights.push({
        type: 'warning',
        title: 'Habit Needs Attention',
        description: `${habit.name} hasn't been completed recently. Consider adjusting your approach.`,
        habitId: habit.uuid,
        confidence: 0.9,
        actionable: true,
        icon: '⚠️'
      });
      return insights;
    }

    const completionRate = this.calculateCompletionRate(recentCompletions, 30);
    const streak = this.calculateCurrentStreak(completions);
    const dayPattern = this.analyzeDayPatterns(recentCompletions);
    
    // High performance insight
    if (completionRate >= 0.8) {
      insights.push({
        type: 'strength',
        title: 'Excellent Consistency',
        description: `${habit.name} has ${Math.round(completionRate * 100)}% completion rate! Keep up the great work.`,
        habitId: habit.uuid,
        confidence: 0.95,
        actionable: false,
        icon: '🌟'
      });
    }
    
    // Declining performance
    else if (completionRate < 0.5) {
      const suggestion = this.generateImprovementSuggestion(habit, recentCompletions);
      insights.push({
        type: 'opportunity',
        title: 'Room for Improvement',
        description: `${habit.name} completion rate is ${Math.round(completionRate * 100)}%. ${suggestion}`,
        habitId: habit.uuid,
        confidence: 0.8,
        actionable: true,
        icon: '💡'
      });
    }
    
    // Day pattern insights
    if (dayPattern.bestDay !== null) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      insights.push({
        type: 'recommendation',
        title: 'Optimal Day Identified',
        description: `You're most consistent with ${habit.name} on ${dayNames[dayPattern.bestDay]}s. Consider focusing your efforts on this day.`,
        habitId: habit.uuid,
        confidence: 0.7,
        actionable: true,
        icon: '📅'
      });
    }
    
    return insights;
  }

  /**
   * Generate overall insights across all habits
   */
  private generateOverallInsights(habits: Habit[], completions: HabitCompletion[]): HabitInsight[] {
    const insights: HabitInsight[] = [];
    const activeHabits = habits.filter(h => !h.archived);
    
    // Too many habits warning
    if (activeHabits.length > 7) {
      insights.push({
        type: 'warning',
        title: 'Habit Overload',
        description: `You have ${activeHabits.length} active habits. Consider focusing on 3-5 core habits for better success.`,
        confidence: 0.85,
        actionable: true,
        icon: '🎯'
      });
    }
    
    // Suggest habit stacking
    const highPerformingHabits = this.getHighPerformingHabits(habits, completions);
    if (highPerformingHabits.length >= 2) {
      insights.push({
        type: 'recommendation',
        title: 'Habit Stacking Opportunity',
        description: 'You could stack new habits with your consistent ones for better adoption.',
        confidence: 0.75,
        actionable: true,
        icon: '🔗'
      });
    }
    
    return insights;
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(habits: Habit[], completions: HabitCompletion[]): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];
    const analysis = this.analyzePatterns(habits, completions);
    
    // Schedule optimization recommendations
    if (analysis.bestPerformingTimes.length > 0) {
      recommendations.push({
        id: 'schedule-optimization',
        type: 'schedule_optimization',
        title: 'Optimize Your Schedule',
        description: `Schedule habits during your peak performance times: ${analysis.bestPerformingTimes.join(', ')}`,
        reasoning: 'Based on your completion patterns, you perform better at specific times.',
        confidence: 0.8,
        estimatedImpact: 'medium'
      });
    }
    
    // New habit suggestions based on successful patterns
    const successfulCategories = this.getSuccessfulHabitCategories(habits, completions);
    if (successfulCategories.length > 0) {
      recommendations.push({
        id: 'similar-habit',
        type: 'new_habit',
        title: 'Add a Complementary Habit',
        description: 'Based on your success with certain types of habits, consider adding similar ones.',
        reasoning: `You excel at ${successfulCategories[0]} habits.`,
        confidence: 0.7,
        estimatedImpact: 'high',
        habitTemplate: {
          name: this.suggestComplementaryHabit(successfulCategories[0]),
          frequency: { type: 'daily' as const, target: 1, period: 1 }
        }
      });
    }
    
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Analyze patterns across all habits
   */
  private analyzePatterns(habits: Habit[], completions: HabitCompletion[]): PatternAnalysis {
    const dayPerformance = new Array(7).fill(0);
    const timePerformance: Record<string, number> = {};
    
    completions.forEach(completion => {
      if (completion.completed) {
        const date = new Date(completion.date);
        dayPerformance[date.getDay()]++;
        
        const hour = date.getHours();
        const timeSlot = this.getTimeSlot(hour);
        timePerformance[timeSlot] = (timePerformance[timeSlot] || 0) + 1;
      }
    });
    
    const bestPerformingDays = dayPerformance
      .map((count, day) => ({ day, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.day);
    
    const bestPerformingTimes = Object.entries(timePerformance)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([time]) => time);
    
    return {
      bestPerformingDays,
      bestPerformingTimes,
      consistencyScore: this.calculateOverallConsistency(habits, completions),
      trendDirection: this.analyzeTrend(completions),
      seasonalPatterns: {},
      streakPatterns: {
        averageStreak: this.calculateAverageStreak(habits, completions),
        longestStreak: Math.max(...habits.map(h => 
          this.calculateCurrentStreak(completions.filter(c => c.habitUuid === h.uuid))
        )),
        breakFrequency: 0
      }
    };
  }

  // Helper methods
  private getRecentCompletions(completions: HabitCompletion[], days: number): HabitCompletion[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return completions.filter(c => new Date(c.date) >= cutoff);
  }

  private calculateCompletionRate(completions: HabitCompletion[], days: number): number {
    const completed = completions.filter(c => c.completed).length;
    return completed / days;
  }

  private calculateCurrentStreak(completions: HabitCompletion[]): number {
    const sorted = completions
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    for (let i = 0; i < sorted.length; i++) {
      streak++;
      // Break if there's a gap (simplified logic)
      if (i < sorted.length - 1) {
        const current = new Date(sorted[i].date);
        const next = new Date(sorted[i + 1].date);
        const dayDiff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
        if (dayDiff > 1) break;
      }
    }
    
    return streak;
  }

  private analyzeDayPatterns(completions: HabitCompletion[]): { bestDay: number | null } {
    const dayCount = new Array(7).fill(0);
    completions.filter(c => c.completed).forEach(c => {
      dayCount[new Date(c.date).getDay()]++;
    });
    
    const maxCount = Math.max(...dayCount);
    const bestDay = maxCount > 0 ? dayCount.indexOf(maxCount) : null;
    
    return { bestDay };
  }

  private generateImprovementSuggestion(habit: Habit, completions: HabitCompletion[]): string {
    const suggestions = [
      'Try reducing the habit to a smaller, more manageable version.',
      'Set a specific time and location for this habit.',
      'Consider pairing it with an existing routine.',
      'Break it down into smaller steps.',
      'Set up environmental cues to remind yourself.'
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  private getHighPerformingHabits(habits: Habit[], completions: HabitCompletion[]): Habit[] {
    return habits.filter(habit => {
      const habitCompletions = completions.filter(c => c.habitUuid === habit.uuid);
      const recentCompletions = this.getRecentCompletions(habitCompletions, 30);
      const rate = this.calculateCompletionRate(recentCompletions, 30);
      return rate >= 0.7;
    });
  }

  private getTimeSlot(hour: number): string {
    if (hour < 6) return 'Early Morning (12-6 AM)';
    if (hour < 12) return 'Morning (6 AM-12 PM)';
    if (hour < 18) return 'Afternoon (12-6 PM)';
    return 'Evening (6 PM-12 AM)';
  }

  private calculateOverallConsistency(habits: Habit[], completions: HabitCompletion[]): number {
    const rates = habits.map(habit => {
      const habitCompletions = completions.filter(c => c.habitUuid === habit.uuid);
      const recent = this.getRecentCompletions(habitCompletions, 30);
      return this.calculateCompletionRate(recent, 30);
    });
    
    return rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
  }

  private analyzeTrend(completions: HabitCompletion[]): 'improving' | 'declining' | 'stable' {
    const recentWeek = this.getRecentCompletions(completions, 7);
    const previousWeek = completions.filter(c => {
      const date = new Date(c.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      return date >= twoWeeksAgo && date < weekAgo;
    });
    
    const recentRate = recentWeek.filter(c => c.completed).length / 7;
    const previousRate = previousWeek.filter(c => c.completed).length / 7;
    
    if (recentRate > previousRate + 0.1) return 'improving';
    if (recentRate < previousRate - 0.1) return 'declining';
    return 'stable';
  }

  private calculateAverageStreak(habits: Habit[], completions: HabitCompletion[]): number {
    const streaks = habits.map(habit => {
      const habitCompletions = completions.filter(c => c.habitUuid === habit.uuid);
      return this.calculateCurrentStreak(habitCompletions);
    });
    
    return streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length;
  }

  private getSuccessfulHabitCategories(habits: Habit[], completions: HabitCompletion[]): string[] {
    // Simplified categorization based on habit names
    const categories = ['exercise', 'health', 'productivity', 'learning', 'mindfulness'];
    return categories.filter(category => {
      const categoryHabits = habits.filter(h => 
        h.name.toLowerCase().includes(category) || 
        h.description?.toLowerCase().includes(category)
      );
      
      if (categoryHabits.length === 0) return false;
      
      const avgRate = categoryHabits.reduce((sum, habit) => {
        const habitCompletions = completions.filter(c => c.habitUuid === habit.uuid);
        const recent = this.getRecentCompletions(habitCompletions, 30);
        return sum + this.calculateCompletionRate(recent, 30);
      }, 0) / categoryHabits.length;
      
      return avgRate >= 0.7;
    });
  }

  private suggestComplementaryHabit(category: string): string {
    const suggestions = {
      exercise: 'Daily stretching routine',
      health: 'Drink more water',
      productivity: 'Weekly planning session',
      learning: 'Read for 15 minutes',
      mindfulness: 'Practice gratitude'
    };
    
    return suggestions[category as keyof typeof suggestions] || 'New positive habit';
  }
}

export const insightsService = new InsightsService();
export type { HabitInsight, PersonalizedRecommendation, PatternAnalysis };