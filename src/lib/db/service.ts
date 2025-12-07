import { db } from './schema';
import type { Habit, HabitCompletion, AppSettings } from '@/types';
import { generateUUID, formatDate } from '@/lib/utils';

export class HabitService {
  static async getAllHabits(): Promise<Habit[]> {
    return await db.habits.orderBy('order').toArray();
  }

  static async getActiveHabits(): Promise<Habit[]> {
    return await db.habits.where('archived').equals(0).sortBy('order');
  }

  static async createHabit(habitData: Omit<Habit, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'order'>): Promise<string> {
    const habit: Habit = {
      ...habitData,
      uuid: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      order: await db.habits.count(),
    };
    
    await db.habits.add(habit);
    return habit.uuid;
  }

  static async updateHabit(uuid: string, updates: Partial<Habit>): Promise<void> {
    await db.habits.where('uuid').equals(uuid).modify({
      ...updates,
      updatedAt: new Date(),
    });
  }

  static async deleteHabit(uuid: string): Promise<void> {
    await db.transaction('rw', [db.habits, db.completions], async () => {
      await db.habits.where('uuid').equals(uuid).delete();
      await db.completions.where('habitUuid').equals(uuid).delete();
    });
  }

  static async archiveHabit(uuid: string): Promise<void> {
    await this.updateHabit(uuid, {
      archived: true,
      archivedAt: new Date(),
    });
  }

  static async restoreHabit(uuid: string): Promise<void> {
    await this.updateHabit(uuid, {
      archived: false,
      archivedAt: undefined,
    });
  }

  static async getCompletionsForHabit(habitUuid: string): Promise<HabitCompletion[]> {
    return await db.completions.where('habitUuid').equals(habitUuid).toArray();
  }

  static async toggleCompletion(habitUuid: string, date: Date): Promise<void> {
    const dateStr = formatDate(date);
    
    // Find existing completion by filtering
    const existingCompletions = await db.completions
      .where('habitUuid')
      .equals(habitUuid)
      .and(completion => completion.date === dateStr)
      .toArray();
    
    if (existingCompletions.length > 0) {
      // Update existing completion
      const existing = existingCompletions[0];
      await db.completions.update(existing.id!, {
        completed: !existing.completed,
        updatedAt: new Date(),
      });
    } else {
      // Create new completion
      const newCompletion = {
        habitUuid,
        date: dateStr,
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.completions.add(newCompletion);
    }
  }

  static async exportData(): Promise<string> {
    const habits = await db.habits.toArray();
    const completions = await db.completions.toArray();
    const settings = await db.settings.toArray();

    return JSON.stringify({
      habits,
      completions,
      settings,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  static async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    
    await db.transaction('rw', [db.habits, db.completions, db.settings], async () => {
      // Clear existing data
      await db.habits.clear();
      await db.completions.clear();
      await db.settings.clear();
      
      // Import new data
      if (data.habits) await db.habits.bulkAdd(data.habits);
      if (data.completions) await db.completions.bulkAdd(data.completions);
      if (data.settings) await db.settings.bulkAdd(data.settings);
    });
  }

  static async getSettings(): Promise<AppSettings | undefined> {
    return await db.settings.orderBy('id').first();
  }

  static async updateSettings(settings: Partial<AppSettings>): Promise<void> {
    const existing = await this.getSettings();
    
    if (existing) {
      await db.settings.update(existing.id!, {
        ...settings,
        updatedAt: new Date(),
      });
    } else {
      await db.settings.add({
        theme: 'system',
        gridSize: 'medium',
        startOfWeek: 1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications: true,
        ...settings,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
}