import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import type { Habit, HabitCompletion } from '@/types';

export interface HabitStats {
  habitUuid: string;
  habitName: string;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  weeklyAverage: number;
  monthlyAverage: number;
  lastCompleted?: Date;
  consistencyScore: number;
}

export interface PeriodStats {
  period: string;
  completions: number;
  target: number;
  rate: number;
}

export interface TrendData {
  date: string;
  completions: number;
  habits: number;
}

/**
 * Calculate comprehensive statistics for a habit
 */
export function calculateHabitStats(
  habit: Habit,
  completions: HabitCompletion[],
  days: number = 90
): HabitStats {
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  
  // Filter completions for this habit and time period
  const habitCompletions = completions
    .filter(c => c.habitUuid === habit.uuid && c.completed)
    .map(c => ({ ...c, date: new Date(c.date) }))
    .filter(c => c.date >= startDate && c.date <= endDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const totalCompletions = habitCompletions.length;
  const completionRate = totalCompletions > 0 ? (totalCompletions / days) * 100 : 0;

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(habitCompletions, endDate);

  // Calculate averages
  const weeklyAverage = calculateWeeklyAverage(habitCompletions);
  const monthlyAverage = calculateMonthlyAverage(habitCompletions);

  // Get last completion date
  const lastCompleted = habitCompletions.length > 0 
    ? habitCompletions[habitCompletions.length - 1].date 
    : undefined;

  // Calculate consistency score (0-100)
  const consistencyScore = calculateConsistencyScore(habitCompletions, days);

  return {
    habitUuid: habit.uuid,
    habitName: habit.name,
    totalCompletions,
    currentStreak,
    longestStreak,
    completionRate,
    weeklyAverage,
    monthlyAverage,
    lastCompleted,
    consistencyScore
  };
}

/**
 * Calculate current and longest streaks
 */
function calculateStreaks(completions: Array<{ date: Date }>, endDate: Date) {
  if (completions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort by date
  const sortedCompletions = [...completions].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  // Calculate longest streak
  for (let i = 1; i < sortedCompletions.length; i++) {
    const prevDate = sortedCompletions[i - 1].date;
    const currentDate = sortedCompletions[i].date;
    
    const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak (working backwards from today)
  const today = format(endDate, 'yyyy-MM-dd');
  let checkDate = endDate;
  
  while (checkDate >= sortedCompletions[0].date) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    const hasCompletion = sortedCompletions.some(c => format(c.date, 'yyyy-MM-dd') === dateStr);
    
    if (hasCompletion) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Calculate weekly average completions
 */
function calculateWeeklyAverage(completions: Array<{ date: Date }>): number {
  if (completions.length === 0) return 0;

  const weeks = new Map<string, number>();
  
  completions.forEach(completion => {
    const weekStart = startOfWeek(completion.date, { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    weeks.set(weekKey, (weeks.get(weekKey) || 0) + 1);
  });

  const totalWeeks = weeks.size;
  const totalCompletions = Array.from(weeks.values()).reduce((sum, count) => sum + count, 0);
  
  return totalWeeks > 0 ? totalCompletions / totalWeeks : 0;
}

/**
 * Calculate monthly average completions
 */
function calculateMonthlyAverage(completions: Array<{ date: Date }>): number {
  if (completions.length === 0) return 0;

  const months = new Map<string, number>();
  
  completions.forEach(completion => {
    const monthKey = format(completion.date, 'yyyy-MM');
    months.set(monthKey, (months.get(monthKey) || 0) + 1);
  });

  const totalMonths = months.size;
  const totalCompletions = Array.from(months.values()).reduce((sum, count) => sum + count, 0);
  
  return totalMonths > 0 ? totalCompletions / totalMonths : 0;
}

/**
 * Calculate consistency score based on completion gaps
 */
function calculateConsistencyScore(completions: Array<{ date: Date }>, totalDays: number): number {
  if (completions.length === 0) return 0;
  if (completions.length === 1) return 10;

  const sortedCompletions = [...completions].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  let totalGap = 0;
  let gapCount = 0;

  for (let i = 1; i < sortedCompletions.length; i++) {
    const gap = Math.floor((sortedCompletions[i].date.getTime() - sortedCompletions[i-1].date.getTime()) / (1000 * 60 * 60 * 24));
    if (gap > 1) {
      totalGap += gap - 1; // Subtract 1 because consecutive days have gap of 1
      gapCount++;
    }
  }

  const averageGap = gapCount > 0 ? totalGap / gapCount : 0;
  const score = Math.max(0, 100 - (averageGap * 10)); // Penalize larger gaps
  
  return Math.round(score);
}

/**
 * Generate trend data for charts
 */
export function generateTrendData(
  habits: Habit[],
  completions: HabitCompletion[],
  days: number = 30
): TrendData[] {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);
  
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  
  return dateRange.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayCompletions = completions.filter(c => 
      c.completed && format(new Date(c.date), 'yyyy-MM-dd') === dateStr
    ).length;
    
    return {
      date: dateStr,
      completions: dayCompletions,
      habits: habits.filter(h => !h.archived).length
    };
  });
}

/**
 * Get top performing habits
 */
export function getTopPerformingHabits(
  habits: Habit[],
  completions: HabitCompletion[],
  limit: number = 5
): HabitStats[] {
  const habitStats = habits
    .filter(h => !h.archived)
    .map(habit => calculateHabitStats(habit, completions))
    .sort((a, b) => b.consistencyScore - a.consistencyScore);
  
  return habitStats.slice(0, limit);
}

/**
 * Calculate overall user performance metrics
 */
export interface OverallStats {
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  averageCompletionRate: number;
  bestStreak: number;
  activeDays: number;
  consistencyScore: number;
}

export function calculateOverallStats(
  habits: Habit[],
  completions: HabitCompletion[],
  days: number = 30
): OverallStats {
  const activeHabits = habits.filter(h => !h.archived);
  const recentCompletions = completions.filter(c => {
    const completionDate = new Date(c.date);
    const cutoffDate = subDays(new Date(), days);
    return completionDate >= cutoffDate && c.completed;
  });

  const habitStats = activeHabits.map(habit => 
    calculateHabitStats(habit, completions, days)
  );

  const totalCompletions = recentCompletions.length;
  const averageCompletionRate = habitStats.length > 0 
    ? habitStats.reduce((sum, stat) => sum + stat.completionRate, 0) / habitStats.length 
    : 0;
  
  const bestStreak = habitStats.length > 0 
    ? Math.max(...habitStats.map(s => s.longestStreak)) 
    : 0;

  const uniqueActiveDays = new Set(
    recentCompletions.map(c => format(new Date(c.date), 'yyyy-MM-dd'))
  ).size;

  const consistencyScore = habitStats.length > 0
    ? habitStats.reduce((sum, stat) => sum + stat.consistencyScore, 0) / habitStats.length
    : 0;

  return {
    totalHabits: habits.length,
    activeHabits: activeHabits.length,
    totalCompletions,
    averageCompletionRate,
    bestStreak,
    activeDays: uniqueActiveDays,
    consistencyScore: Math.round(consistencyScore)
  };
}