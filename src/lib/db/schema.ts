import Dexie, { Table } from 'dexie';
import type { Habit, HabitCompletion, AppSettings } from '@/types';

export class HabitDatabase extends Dexie {
  habits!: Table<Habit>;
  completions!: Table<HabitCompletion>;
  settings!: Table<AppSettings>;

  constructor() {
    super('HabitTrackerDB');
    
    this.version(1).stores({
      habits: '++id, uuid, name, archived, createdAt, order',
      completions: '++id, habitUuid, date, completed, [habitUuid+date]',
      settings: '++id'
    });
  }
}

export const db = new HabitDatabase();