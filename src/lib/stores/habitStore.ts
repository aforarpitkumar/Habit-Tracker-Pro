import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HabitService } from '@/lib/db/service';
import type { Habit, HabitCompletion } from '@/types';
import { calculateStreak, calculateLongestStreak } from '@/lib/utils';
import { syncService } from '@/lib/services/syncService';
import { notificationService } from '@/lib/services/notificationService';
import { startOfDay, subDays, parseISO } from 'date-fns';

interface HabitStore {
  // State
  habits: Habit[];
  completions: HabitCompletion[];
  selectedDate: Date;
  viewMode: 'grid' | 'list' | 'calendar';
  isLoading: boolean;

  // Actions
  loadHabits: () => Promise<void>;
  loadCompletions: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<void>;
  updateHabit: (uuid: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (uuid: string) => Promise<void>;
  archiveHabit: (uuid: string) => Promise<void>;
  restoreHabit: (uuid: string) => Promise<void>;
  toggleCompletion: (habitUuid: string, date: Date) => Promise<void>;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: 'grid' | 'list' | 'calendar') => void;

  // Computed
  getActiveHabits: () => Habit[];
  getArchivedHabits: () => Habit[];
  getHabitById: (uuid: string) => Habit | undefined;
  getCompletionsForHabit: (habitUuid: string) => HabitCompletion[];
  getStreakForHabit: (habitUuid: string) => number;
  getLongestStreakForHabit: (habitUuid: string) => number;
  getCompletionRate: (habitUuid: string, days: number) => number;

  // Data operations
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<void>;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      // Initial state
      habits: [],
      completions: [],
      selectedDate: new Date(),
      viewMode: 'grid',
      isLoading: false,

      // Actions
      loadHabits: async () => {
        set({ isLoading: true });
        try {
          const habits = await HabitService.getAllHabits();
          set({ habits });
          // Automatically load completions after habits are loaded
          await get().loadCompletions();
        } catch (error) {
          console.error('Failed to load habits:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      loadCompletions: async () => {
        try {
          const allCompletions: HabitCompletion[] = [];
          const habits = get().habits;

          for (const habit of habits) {
            const habitCompletions = await HabitService.getCompletionsForHabit(habit.uuid);
            allCompletions.push(...habitCompletions);
          }

          set({ completions: allCompletions });
        } catch (error) {
          console.error('Failed to load completions:', error);
        }
      },

      addHabit: async (habitData) => {
        try {
          await HabitService.createHabit(habitData);
          await get().loadHabits();

          // Add to sync queue for background sync
          syncService.addToSyncQueue('habit', 'create', habitData);
        } catch (error) {
          console.error('Failed to add habit:', error);
          throw error;
        }
      },

      updateHabit: async (uuid, updates) => {
        try {
          await HabitService.updateHabit(uuid, updates);
          await get().loadHabits();
        } catch (error) {
          console.error('Failed to update habit:', error);
          throw error;
        }
      },

      deleteHabit: async (uuid) => {
        try {
          await HabitService.deleteHabit(uuid);
          await get().loadHabits();
          await get().loadCompletions();
        } catch (error) {
          console.error('Failed to delete habit:', error);
          throw error;
        }
      },

      archiveHabit: async (uuid) => {
        try {
          await HabitService.archiveHabit(uuid);
          await get().loadHabits();
        } catch (error) {
          console.error('Failed to archive habit:', error);
          throw error;
        }
      },

      restoreHabit: async (uuid) => {
        try {
          await HabitService.restoreHabit(uuid);
          await get().loadHabits();
        } catch (error) {
          console.error('Failed to restore habit:', error);
          throw error;
        }
      },

      toggleCompletion: async (habitUuid, date) => {
        try {
          const habit = get().getHabitById(habitUuid);
          const oldStreak = habit ? get().getStreakForHabit(habitUuid) : 0;

          await HabitService.toggleCompletion(habitUuid, date);
          await get().loadCompletions();

          // Check for streak milestone after completion update
          if (habit) {
            const newStreak = get().getStreakForHabit(habitUuid);
            if (newStreak > oldStreak && newStreak > 0) {
              notificationService.showStreakMilestone(habit.name, newStreak);
            }
          }

          // Add to sync queue
          syncService.addToSyncQueue('completion', 'update', { habitUuid, date });
        } catch (error) {
          console.error('Failed to toggle completion:', error);
          throw error;
        }
      },

      setSelectedDate: (date) => set({ selectedDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),

      // Computed functions
      getActiveHabits: () => get().habits.filter(h => !h.archived),
      getArchivedHabits: () => get().habits.filter(h => h.archived),
      getHabitById: (uuid) => get().habits.find(h => h.uuid === uuid),

      getCompletionsForHabit: (habitUuid) =>
        get().completions.filter(c => c.habitUuid === habitUuid),

      getStreakForHabit: (habitUuid) => {
        const completions = get().getCompletionsForHabit(habitUuid);
        return calculateStreak(completions);
      },

      getLongestStreakForHabit: (habitUuid) => {
        const completions = get().getCompletionsForHabit(habitUuid);
        return calculateLongestStreak(completions);
      },

      getCompletionRate: (habitUuid, days) => {
        const completions = get().getCompletionsForHabit(habitUuid);
        const today = startOfDay(new Date());
        // Calculate cutoff: if days=30, looking for last 30 days inclusive of today
        const cutoffDate = subDays(today, days - 1);

        const recentCompletions = completions.filter(c => {
          // Parse YYYY-MM-DD string to date
          const completionDate = parseISO(c.date);
          return completionDate >= cutoffDate && c.completed;
        });

        return days > 0 ? Math.round((recentCompletions.length / days) * 100) : 0;
      },

      exportData: () => HabitService.exportData(),

      importData: async (jsonData) => {
        try {
          await HabitService.importData(jsonData);
          await get().loadHabits();
          await get().loadCompletions();
        } catch (error) {
          console.error('Failed to import data:', error);
          throw error;
        }
      },
    }),
    {
      name: 'habit-store',
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        viewMode: state.viewMode,
      }),
    }
  )
);