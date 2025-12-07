export interface Habit {
  id?: number;
  uuid: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    target: number;
    period: number;
    // Advanced scheduling options
    daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc. for weekly habits
    daysOfMonth?: number[]; // 1-31 for monthly habits
    skipWeekends?: boolean; // for daily habits
    customPattern?: 'every-other-day' | 'weekdays-only' | 'custom-interval';
  };
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
  archivedAt?: Date;
  reminderTime?: string;
  order: number;
}

export interface HabitCompletion {
  id?: number;
  habitUuid: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  id?: number;
  theme: 'light' | 'dark' | 'system';
  gridSize: 'small' | 'medium' | 'large';
  startOfWeek: 0 | 1;
  timezone: string;
  notifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: Habit['frequency'];
  category: string;
  tags: string[];
}