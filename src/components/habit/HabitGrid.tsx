'use client';

import React from 'react';
import { format, subDays, startOfDay } from 'date-fns';
import { useHabitStore } from '@/lib/stores/habitStore';
import { useAppearanceStore } from '@/lib/stores/appearanceStore';
import { cn } from '@/lib/utils';

interface HabitGridProps {
  habitUuid: string;
  days?: number;
  className?: string;
}

export function HabitGrid({ habitUuid, days = 365, className }: HabitGridProps) {
  const { getCompletionsForHabit, toggleCompletion } = useHabitStore();
  const { settings } = useAppearanceStore();
  const completions = getCompletionsForHabit(habitUuid);
  
  const completionMap = new Map(
    completions.map(c => [c.date, c.completed])
  );
  
  const gridDays = Array.from({ length: days }, (_, i) => {
    const date = subDays(startOfDay(new Date()), days - 1 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isCompleted = completionMap.get(dateStr) || false;
    
    return {
      date,
      dateStr,
      isCompleted,
    };
  });
  
  const handleTileClick = async (dateStr: string) => {
    const date = new Date(dateStr);
    try {
      await toggleCompletion(habitUuid, date);
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };
  
  const weeksToShow = Math.ceil(days / 7);
  
  // Get tile size based on grid size setting
  const getTileSize = () => {
    switch (settings.gridSize) {
      case 'small': return 'w-2 h-2';
      case 'large': return 'w-4 h-4';
      default: return 'w-3 h-3'; // medium
    }
  };
  
  const tileSize = getTileSize();
  
  return (
    <div className={cn("p-4", className)}>
      <div 
        className="grid gap-1" 
        style={{
          gridTemplateColumns: `repeat(${weeksToShow}, 1fr)`,
          gridTemplateRows: `repeat(7, 1fr)`,
        }}
      >
        {gridDays.map(({ dateStr, isCompleted }, index) => (
          <button
            key={dateStr}
            onClick={() => handleTileClick(dateStr)}
            className={cn(
              `${tileSize} rounded-sm transition-all duration-200 hover:scale-110`,
              isCompleted 
                ? "bg-green-500 hover:bg-green-600 shadow-sm" 
                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            )}
            title={`${dateStr} - ${isCompleted ? 'Completed' : 'Not completed'}`}
            style={{
              gridColumn: Math.floor(index / 7) + 1,
              gridRow: (index % 7) + 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}