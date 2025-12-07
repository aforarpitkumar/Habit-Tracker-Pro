import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, subDays, startOfDay, differenceInCalendarDays, parseISO } from 'date-fns';
import { HABIT_ICONS } from '@/lib/constants/habits'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID(): string {
  return crypto.randomUUID()
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function calculateStreak(completions: Array<{ date: string, completed: boolean }>): number {
  if (completions.length === 0) return 0;

  // Create a set of all completed dates for quick lookup
  const completedSet = new Set(
    completions
      .filter(c => c.completed)
      .map(c => c.date)
  );

  if (completedSet.size === 0) return 0;

  // Start with today
  const today = startOfDay(new Date());
  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterday = subDays(today, 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

  const isTodayCompleted = completedSet.has(todayStr);
  const isYesterdayCompleted = completedSet.has(yesterdayStr);

  // If neither today nor yesterday is completed, streak is 0
  if (!isTodayCompleted && !isYesterdayCompleted) {
    return 0;
  }

  // Start counting
  // If today is completed, streak starts from 1 (today)
  // If only yesterday is completed, streak starts from 1 (yesterday)
  let streak = isTodayCompleted ? 1 : 1;

  // Start checking from yesterday (if today is the start) or day before yesterday (if yesterday is the start)
  let currentDate = isTodayCompleted ? yesterday : subDays(yesterday, 1);

  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    if (completedSet.has(dateStr)) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

// Calculate the longest consecutive streak in the entire history
export function calculateLongestStreak(completions: Array<{ date: string, completed: boolean }>): number {
  if (completions.length === 0) return 0;

  const completedDates = completions
    .filter(c => c.completed)
    .map(c => c.date)
    .sort(); // String sort is fine for YYYY-MM-DD

  if (completedDates.length === 0) return 0;
  if (completedDates.length === 1) return 1;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = parseISO(completedDates[i - 1]);
    const currDate = parseISO(completedDates[i]);

    const diffDays = differenceInCalendarDays(currDate, prevDate);

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffDays > 1) {
      // Logic check: if multiple entries for same day (shouldn't happen but defensive), diffDays is 0
      // If diffDays === 0, we do nothing (streak continues but doesn't increment)
      currentStreak = 1;
    }
  }

  return maxStreak;
}

export function getHabitIconEmoji(iconId: string): string {
  const habitIcon = HABIT_ICONS.find(icon => icon.id === iconId)
  return habitIcon?.icon || '🎯' // Default to target emoji if not found
}