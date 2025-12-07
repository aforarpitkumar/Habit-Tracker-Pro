/**
 * Habit Dependencies and Conditional Logic Service
 * Manages relationships between habits and conditional execution
 */

import type { Habit, HabitCompletion } from '@/types';

interface HabitDependency {
  id: string;
  dependentHabitId: string;
  parentHabitId: string;
  conditionType: 'requires_completion' | 'requires_streak' | 'blocks_if_incomplete' | 'triggers_on_completion';
  conditionValue?: number; // For streak requirements
  isActive: boolean;
  createdAt: Date;
}

interface ConditionalRule {
  id: string;
  habitId: string;
  ruleName: string;
  conditions: Condition[];
  actions: Action[];
  isActive: boolean;
  priority: number;
}

interface Condition {
  type: 'time_of_day' | 'day_of_week' | 'habit_completed' | 'habit_streak' | 'weather' | 'custom';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
  habitId?: string;
}

interface Action {
  type: 'enable_habit' | 'disable_habit' | 'suggest_habit' | 'send_notification' | 'adjust_frequency';
  targetHabitId?: string;
  parameters?: any;
}

interface DependencyValidation {
  isValid: boolean;
  blockedBy: string[];
  requiredCompletions: string[];
  warnings: string[];
}

class HabitDependencyService {
  private dependencies: HabitDependency[] = [];
  private conditionalRules: ConditionalRule[] = [];

  constructor() {
    this.loadDependencies();
    this.loadConditionalRules();
  }

  /**
   * Add a dependency relationship between habits
   */
  addDependency(dependency: Omit<HabitDependency, 'id' | 'createdAt'>): string {
    // Validate dependency to prevent circular references
    if (this.wouldCreateCircularDependency(dependency.dependentHabitId, dependency.parentHabitId)) {
      throw new Error('Cannot create dependency: would result in circular reference');
    }

    const newDependency: HabitDependency = {
      ...dependency,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    this.dependencies.push(newDependency);
    this.saveDependencies();
    
    console.log('✅ Dependency added:', newDependency);
    return newDependency.id;
  }

  /**
   * Remove a dependency
   */
  removeDependency(dependencyId: string): boolean {
    const index = this.dependencies.findIndex(d => d.id === dependencyId);
    if (index === -1) return false;

    this.dependencies.splice(index, 1);
    this.saveDependencies();
    return true;
  }

  /**
   * Check if a habit can be completed based on its dependencies
   */
  validateHabitCompletion(habitId: string, completions: HabitCompletion[], targetDate: Date = new Date()): DependencyValidation {
    const result: DependencyValidation = {
      isValid: true,
      blockedBy: [],
      requiredCompletions: [],
      warnings: []
    };

    const habitDependencies = this.dependencies.filter(d => 
      d.dependentHabitId === habitId && d.isActive
    );

    for (const dependency of habitDependencies) {
      const validation = this.validateSingleDependency(dependency, completions, targetDate);
      
      if (!validation.isValid) {
        result.isValid = false;
        result.blockedBy.push(dependency.parentHabitId);
        
        switch (dependency.conditionType) {
          case 'requires_completion':
            result.requiredCompletions.push(dependency.parentHabitId);
            break;
          case 'requires_streak':
            result.warnings.push(`Requires ${dependency.conditionValue}-day streak of parent habit`);
            break;
          case 'blocks_if_incomplete':
            result.warnings.push('Blocked until parent habit is completed');
            break;
        }
      }
    }

    return result;
  }

  /**
   * Get habits that should be triggered by completion of another habit
   */
  getTriggeredHabits(completedHabitId: string): string[] {
    return this.dependencies
      .filter(d => 
        d.parentHabitId === completedHabitId && 
        d.conditionType === 'triggers_on_completion' &&
        d.isActive
      )
      .map(d => d.dependentHabitId);
  }

  /**
   * Add a conditional rule
   */
  addConditionalRule(rule: Omit<ConditionalRule, 'id'>): string {
    const newRule: ConditionalRule = {
      ...rule,
      id: crypto.randomUUID()
    };

    this.conditionalRules.push(newRule);
    this.saveConditionalRules();
    
    return newRule.id;
  }

  /**
   * Evaluate conditional rules for a habit
   */
  evaluateConditionalRules(habitId: string, context: {
    habits: Habit[];
    completions: HabitCompletion[];
    currentTime: Date;
  }): Action[] {
    const applicableRules = this.conditionalRules
      .filter(rule => rule.habitId === habitId && rule.isActive)
      .sort((a, b) => b.priority - a.priority);

    const triggeredActions: Action[] = [];

    for (const rule of applicableRules) {
      const allConditionsMet = rule.conditions.every(condition => 
        this.evaluateCondition(condition, context)
      );

      if (allConditionsMet) {
        triggeredActions.push(...rule.actions);
      }
    }

    return triggeredActions;
  }

  /**
   * Get dependency graph for visualization
   */
  getDependencyGraph(habits: Habit[]): {
    nodes: { id: string; name: string; type: 'habit' }[];
    edges: { from: string; to: string; type: string; label: string }[];
  } {
    const nodes = habits.map(habit => ({
      id: habit.uuid,
      name: habit.name,
      type: 'habit' as const
    }));

    const edges = this.dependencies
      .filter(d => d.isActive)
      .map(dependency => ({
        from: dependency.parentHabitId,
        to: dependency.dependentHabitId,
        type: dependency.conditionType,
        label: this.getDependencyLabel(dependency)
      }));

    return { nodes, edges };
  }

  /**
   * Get suggested habit chains based on successful patterns
   */
  suggestHabitChains(habits: Habit[], completions: HabitCompletion[]): {
    chain: string[];
    confidence: number;
    reason: string;
  }[] {
    const suggestions: { chain: string[]; confidence: number; reason: string }[] = [];

    // Find habits often completed together
    const coOccurrenceMap = new Map<string, Map<string, number>>();
    
    // Group completions by date
    const completionsByDate = new Map<string, string[]>();
    completions
      .filter(c => c.completed)
      .forEach(completion => {
        const date = completion.date;
        if (!completionsByDate.has(date)) {
          completionsByDate.set(date, []);
        }
        completionsByDate.get(date)!.push(completion.habitUuid);
      });

    // Calculate co-occurrence
    completionsByDate.forEach(habitsOnDate => {
      for (let i = 0; i < habitsOnDate.length; i++) {
        for (let j = i + 1; j < habitsOnDate.length; j++) {
          const habit1 = habitsOnDate[i];
          const habit2 = habitsOnDate[j];
          
          if (!coOccurrenceMap.has(habit1)) {
            coOccurrenceMap.set(habit1, new Map());
          }
          
          const currentCount = coOccurrenceMap.get(habit1)!.get(habit2) || 0;
          coOccurrenceMap.get(habit1)!.set(habit2, currentCount + 1);
        }
      }
    });

    // Generate suggestions based on strong co-occurrence patterns
    coOccurrenceMap.forEach((coHabits, habit1) => {
      coHabits.forEach((count, habit2) => {
        if (count >= 5) { // At least 5 co-occurrences
          const habit1Name = habits.find(h => h.uuid === habit1)?.name || 'Unknown';
          const habit2Name = habits.find(h => h.uuid === habit2)?.name || 'Unknown';
          
          suggestions.push({
            chain: [habit1, habit2],
            confidence: Math.min(count / 10, 1), // Max confidence of 1 at 10+ occurrences
            reason: `Often completed together: ${habit1Name} → ${habit2Name}`
          });
        }
      });
    });

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  // Private helper methods

  private wouldCreateCircularDependency(dependentId: string, parentId: string): boolean {
    // Simple circular dependency check - can be enhanced for complex scenarios
    const visited = new Set<string>();
    const stack = [parentId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (current === dependentId) {
        return true; // Found circular reference
      }
      
      if (visited.has(current)) {
        continue;
      }
      
      visited.add(current);
      
      // Find all dependencies of current habit
      const dependencies = this.dependencies
        .filter(d => d.dependentHabitId === current)
        .map(d => d.parentHabitId);
      
      stack.push(...dependencies);
    }

    return false;
  }

  private validateSingleDependency(
    dependency: HabitDependency, 
    completions: HabitCompletion[], 
    targetDate: Date
  ): { isValid: boolean } {
    const targetDateStr = targetDate.toISOString().split('T')[0];
    const parentCompletions = completions.filter(c => c.habitUuid === dependency.parentHabitId);

    switch (dependency.conditionType) {
      case 'requires_completion':
        const isCompletedOnDate = parentCompletions.some(c => 
          c.date === targetDateStr && c.completed
        );
        return { isValid: isCompletedOnDate };

      case 'requires_streak':
        const currentStreak = this.calculateStreak(parentCompletions);
        return { isValid: currentStreak >= (dependency.conditionValue || 1) };

      case 'blocks_if_incomplete':
        const isParentComplete = parentCompletions.some(c => 
          c.date === targetDateStr && c.completed
        );
        return { isValid: isParentComplete };

      default:
        return { isValid: true };
    }
  }

  private evaluateCondition(condition: Condition, context: {
    habits: Habit[];
    completions: HabitCompletion[];
    currentTime: Date;
  }): boolean {
    switch (condition.type) {
      case 'time_of_day':
        const currentHour = context.currentTime.getHours();
        return this.compareValues(currentHour, condition.operator, condition.value);

      case 'day_of_week':
        const currentDay = context.currentTime.getDay();
        return this.compareValues(currentDay, condition.operator, condition.value);

      case 'habit_completed':
        if (!condition.habitId) return false;
        const todayStr = context.currentTime.toISOString().split('T')[0];
        const isCompleted = context.completions.some(c => 
          c.habitUuid === condition.habitId && 
          c.date === todayStr && 
          c.completed
        );
        return condition.operator === 'equals' ? isCompleted === condition.value : !isCompleted;

      case 'habit_streak':
        if (!condition.habitId) return false;
        const habitCompletions = context.completions.filter(c => c.habitUuid === condition.habitId);
        const streak = this.calculateStreak(habitCompletions);
        return this.compareValues(streak, condition.operator, condition.value);

      default:
        return true;
    }
  }

  private compareValues(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals': return actual === expected;
      case 'greater_than': return actual > expected;
      case 'less_than': return actual < expected;
      case 'contains': return String(actual).includes(String(expected));
      default: return false;
    }
  }

  private calculateStreak(completions: HabitCompletion[]): number {
    const sorted = completions
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    let currentDate = new Date();
    
    for (const completion of sorted) {
      const completionDate = new Date(completion.date);
      const dayDiff = Math.floor((currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === streak) {
        streak++;
        currentDate = completionDate;
      } else {
        break;
      }
    }

    return streak;
  }

  private getDependencyLabel(dependency: HabitDependency): string {
    switch (dependency.conditionType) {
      case 'requires_completion': return 'Requires';
      case 'requires_streak': return `Requires ${dependency.conditionValue}-day streak`;
      case 'blocks_if_incomplete': return 'Blocks if incomplete';
      case 'triggers_on_completion': return 'Triggers';
      default: return 'Depends on';
    }
  }

  private loadDependencies() {
    try {
      const stored = localStorage.getItem('habitDependencies');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.dependencies = parsed.map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load dependencies:', error);
    }
  }

  private saveDependencies() {
    try {
      localStorage.setItem('habitDependencies', JSON.stringify(this.dependencies));
    } catch (error) {
      console.error('Failed to save dependencies:', error);
    }
  }

  private loadConditionalRules() {
    try {
      const stored = localStorage.getItem('habitConditionalRules');
      if (stored) {
        this.conditionalRules = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load conditional rules:', error);
    }
  }

  private saveConditionalRules() {
    try {
      localStorage.setItem('habitConditionalRules', JSON.stringify(this.conditionalRules));
    } catch (error) {
      console.error('Failed to save conditional rules:', error);
    }
  }
}

export const habitDependencyService = new HabitDependencyService();
export type { HabitDependency, ConditionalRule, Condition, Action, DependencyValidation };