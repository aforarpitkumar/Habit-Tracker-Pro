import type { Habit } from '@/types';
import { format, parseISO, isAfter, isBefore, addDays, getDay, getDate } from 'date-fns';

/**
 * Check if a habit should be active on a given date based on its frequency settings
 */
export function isHabitActiveOnDate(habit: Habit, date: Date): boolean {
  const frequency = habit.frequency;
  
  switch (frequency.type) {
    case 'daily':
      return isDailyHabitActive(frequency, date);
    case 'weekly':
      return isWeeklyHabitActive(frequency, date);
    case 'monthly':
      return isMonthlyHabitActive(frequency, date);
    case 'custom':
      return isCustomHabitActive(frequency, date, habit.createdAt);
    default:
      return false;
  }
}

/**
 * Check if a daily habit should be active on a given date
 */
function isDailyHabitActive(frequency: Habit['frequency'], date: Date): boolean {
  if (frequency.customPattern === 'weekdays-only') {
    const dayOfWeek = getDay(date);
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
  }
  
  if (frequency.customPattern === 'every-other-day') {
    // This would need a reference date to calculate properly
    // For simplicity, we'll consider it active on odd days of month
    const dayOfMonth = getDate(date);
    return dayOfMonth % 2 === 1;
  }
  
  return true; // Every day
}

/**
 * Check if a weekly habit should be active on a given date
 */
function isWeeklyHabitActive(frequency: Habit['frequency'], date: Date): boolean {
  if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
    const dayOfWeek = getDay(date);
    return frequency.daysOfWeek.includes(dayOfWeek);
  }
  
  // Fallback to target-based logic (not specific about which days)
  return true;
}

/**
 * Check if a monthly habit should be active on a given date
 */
function isMonthlyHabitActive(frequency: Habit['frequency'], date: Date): boolean {
  if (frequency.daysOfMonth && frequency.daysOfMonth.length > 0) {
    const dayOfMonth = getDate(date);
    return frequency.daysOfMonth.includes(dayOfMonth);
  }
  
  // Fallback to target-based logic (not specific about which days)
  return true;
}

/**
 * Check if a custom habit should be active on a given date
 */
function isCustomHabitActive(frequency: Habit['frequency'], date: Date, createdAt: Date): boolean {
  const daysSinceCreation = Math.floor((date.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceCreation % frequency.period < frequency.target;
}

/**
 * Get the next scheduled date for a habit
 */
export function getNextScheduledDate(habit: Habit, fromDate: Date = new Date()): Date | null {
  const frequency = habit.frequency;
  let checkDate = new Date(fromDate);
  
  // Check up to 60 days in the future
  for (let i = 0; i < 60; i++) {
    checkDate = addDays(checkDate, 1);
    if (isHabitActiveOnDate(habit, checkDate)) {
      return checkDate;
    }
  }
  
  return null;
}

/**
 * Calculate how many times a habit should be completed in a given period
 */
export function getExpectedCompletionsInPeriod(
  habit: Habit, 
  startDate: Date, 
  endDate: Date
): number {
  let count = 0;
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (isHabitActiveOnDate(habit, currentDate)) {
      count++;
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return count;
}

/**
 * Get a human-readable description of the habit frequency
 */
export function getFrequencyDescription(frequency: Habit['frequency']): string {
  switch (frequency.type) {
    case 'daily':
      if (frequency.customPattern === 'weekdays-only') return 'Weekdays only';
      if (frequency.customPattern === 'every-other-day') return 'Every other day';
      return 'Daily';
      
    case 'weekly':
      if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const selectedDays = frequency.daysOfWeek.map(d => dayNames[d]).join(', ');
        return `${selectedDays} each week`;
      }
      return `${frequency.target} times per week`;
      
    case 'monthly':
      if (frequency.daysOfMonth && frequency.daysOfMonth.length > 0) {
        return `Days ${frequency.daysOfMonth.join(', ')} each month`;
      }
      return `${frequency.target} times per month`;
      
    case 'custom':
      return `${frequency.target} times every ${frequency.period} days`;
      
    default:
      return 'Unknown frequency';
  }
}

/**
 * Validate a frequency configuration
 */
export function validateFrequency(frequency: Habit['frequency']): { valid: boolean; error?: string } {
  if (frequency.target <= 0) {
    return { valid: false, error: 'Target must be greater than 0' };
  }
  
  if (frequency.period <= 0) {
    return { valid: false, error: 'Period must be greater than 0' };
  }
  
  if (frequency.type === 'weekly' && frequency.daysOfWeek) {
    if (frequency.daysOfWeek.length === 0) {
      return { valid: false, error: 'At least one day must be selected for weekly habits' };
    }
    if (frequency.daysOfWeek.some(d => d < 0 || d > 6)) {
      return { valid: false, error: 'Invalid day of week' };
    }
  }
  
  if (frequency.type === 'monthly' && frequency.daysOfMonth) {
    if (frequency.daysOfMonth.length === 0) {
      return { valid: false, error: 'At least one day must be selected for monthly habits' };
    }
    if (frequency.daysOfMonth.some(d => d < 1 || d > 31)) {
      return { valid: false, error: 'Invalid day of month' };
    }
  }
  
  return { valid: true };
}