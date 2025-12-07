/**
 * Habit Journaling and Reflection Service
 * Enables users to add notes, reflections, and track mood with habits
 */

interface JournalEntry {
  id: string;
  habitId?: string;
  date: string;
  type: 'reflection' | 'note' | 'mood' | 'challenge' | 'success';
  title?: string;
  content: string;
  mood?: 1 | 2 | 3 | 4 | 5; // 1=very bad, 5=excellent
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ReflectionPrompt {
  id: string;
  prompt: string;
  category: 'daily' | 'weekly' | 'habit-specific' | 'challenge' | 'gratitude';
  difficulty: 'easy' | 'medium' | 'deep';
}

class JournalingService {
  private entries: JournalEntry[] = [];
  private prompts: ReflectionPrompt[] = [
    {
      id: '1',
      prompt: 'What went well with your habits today?',
      category: 'daily',
      difficulty: 'easy'
    },
    {
      id: '2', 
      prompt: 'What challenged you the most today and how did you overcome it?',
      category: 'challenge',
      difficulty: 'medium'
    },
    {
      id: '3',
      prompt: 'How did completing this habit make you feel?',
      category: 'habit-specific',
      difficulty: 'easy'
    },
    {
      id: '4',
      prompt: 'What are you most grateful for in your habit journey?',
      category: 'gratitude',
      difficulty: 'easy'
    },
    {
      id: '5',
      prompt: 'Reflect on your progress this week. What patterns do you notice?',
      category: 'weekly',
      difficulty: 'deep'
    }
  ];

  constructor() {
    this.loadEntries();
  }

  /**
   * Add a journal entry
   */
  addEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): string {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.entries.push(newEntry);
    this.saveEntries();
    
    console.log('📝 Journal entry added:', newEntry);
    return newEntry.id;
  }

  /**
   * Update an existing entry
   */
  updateEntry(id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>): boolean {
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) return false;

    this.entries[index] = {
      ...this.entries[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveEntries();
    return true;
  }

  /**
   * Get entries for a specific date or date range
   */
  getEntriesForDate(date: string): JournalEntry[] {
    return this.entries
      .filter(e => e.date === date)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get entries for a specific habit
   */
  getEntriesForHabit(habitId: string): JournalEntry[] {
    return this.entries
      .filter(e => e.habitId === habitId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get reflection prompts based on context
   */
  getReflectionPrompts(category?: ReflectionPrompt['category']): ReflectionPrompt[] {
    let filteredPrompts = this.prompts;
    
    if (category) {
      filteredPrompts = this.prompts.filter(p => p.category === category);
    }

    // Shuffle prompts for variety
    return filteredPrompts.sort(() => Math.random() - 0.5);
  }

  /**
   * Generate mood analytics
   */
  getMoodAnalytics(days: number = 30): {
    averageMood: number;
    moodTrend: 'improving' | 'declining' | 'stable';
    moodByDay: Record<string, number>;
    totalEntries: number;
  } {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentEntries = this.entries.filter(e => 
      e.mood && new Date(e.date) >= cutoffDate
    );

    if (recentEntries.length === 0) {
      return {
        averageMood: 0,
        moodTrend: 'stable',
        moodByDay: {},
        totalEntries: 0
      };
    }

    const totalMood = recentEntries.reduce((sum, e) => sum + (e.mood || 0), 0);
    const averageMood = totalMood / recentEntries.length;

    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(recentEntries.length / 2);
    const firstHalf = recentEntries.slice(0, midpoint);
    const secondHalf = recentEntries.slice(midpoint);

    const firstHalfAvg = firstHalf.reduce((sum, e) => sum + (e.mood || 0), 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, e) => sum + (e.mood || 0), 0) / secondHalf.length;

    let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (secondHalfAvg > firstHalfAvg + 0.3) moodTrend = 'improving';
    else if (secondHalfAvg < firstHalfAvg - 0.3) moodTrend = 'declining';

    // Group by day
    const moodByDay: Record<string, number> = {};
    recentEntries.forEach(entry => {
      if (entry.mood) {
        moodByDay[entry.date] = entry.mood;
      }
    });

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      moodTrend,
      moodByDay,
      totalEntries: recentEntries.length
    };
  }

  /**
   * Search journal entries
   */
  searchEntries(query: string, filters?: {
    type?: JournalEntry['type'];
    habitId?: string;
    tags?: string[];
    dateRange?: { start: string; end: string };
  }): JournalEntry[] {
    let results = this.entries;

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(e => 
        e.content.toLowerCase().includes(searchTerm) ||
        e.title?.toLowerCase().includes(searchTerm) ||
        e.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.type) {
        results = results.filter(e => e.type === filters.type);
      }
      
      if (filters.habitId) {
        results = results.filter(e => e.habitId === filters.habitId);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(e => 
          filters.tags!.some(tag => e.tags.includes(tag))
        );
      }
      
      if (filters.dateRange) {
        results = results.filter(e => 
          e.date >= filters.dateRange!.start && 
          e.date <= filters.dateRange!.end
        );
      }
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get popular tags
   */
  getPopularTags(limit: number = 20): { tag: string; count: number }[] {
    const tagCounts = new Map<string, number>();
    
    this.entries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Generate weekly reflection summary
   */
  getWeeklyReflectionSummary(weekStartDate: string): {
    totalEntries: number;
    averageMood: number;
    topChallenges: string[];
    keySuccesses: string[];
    reflectionPrompts: string[];
  } {
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekEntries = this.entries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    const moodEntries = weekEntries.filter(e => e.mood);
    const averageMood = moodEntries.length > 0 
      ? moodEntries.reduce((sum, e) => sum + (e.mood || 0), 0) / moodEntries.length
      : 0;

    const challenges = weekEntries
      .filter(e => e.type === 'challenge')
      .map(e => e.content)
      .slice(0, 3);

    const successes = weekEntries
      .filter(e => e.type === 'success')
      .map(e => e.content)
      .slice(0, 3);

    const reflectionPrompts = [
      'What habit pattern served you best this week?',
      'How can you build on this week\'s successes?',
      'What would you do differently next week?'
    ];

    return {
      totalEntries: weekEntries.length,
      averageMood: Math.round(averageMood * 10) / 10,
      topChallenges: challenges,
      keySuccesses: successes,
      reflectionPrompts
    };
  }

  /**
   * Export journal entries
   */
  exportEntries(format: 'json' | 'text' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.entries, null, 2);
    }

    // Text format
    return this.entries
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map(entry => {
        let text = `Date: ${entry.date}\n`;
        text += `Type: ${entry.type}\n`;
        if (entry.title) text += `Title: ${entry.title}\n`;
        if (entry.mood) text += `Mood: ${entry.mood}/5\n`;
        if (entry.tags.length > 0) text += `Tags: ${entry.tags.join(', ')}\n`;
        text += `Content: ${entry.content}\n`;
        text += `---\n\n`;
        return text;
      })
      .join('');
  }

  private loadEntries() {
    try {
      const stored = localStorage.getItem('journalEntries');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.entries = parsed.map((e: any) => ({
          ...e,
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    }
  }

  private saveEntries() {
    try {
      localStorage.setItem('journalEntries', JSON.stringify(this.entries));
    } catch (error) {
      console.error('Failed to save journal entries:', error);
    }
  }
}

export const journalingService = new JournalingService();
export type { JournalEntry, ReflectionPrompt };