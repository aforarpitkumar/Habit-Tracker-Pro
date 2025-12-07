'use client';

import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  parseISO
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabitStore } from '@/lib/stores/habitStore';
import { getHabitIconEmoji } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Habit } from '@/types';

interface CalendarViewProps {
  habit: Habit;
  className?: string;
}

export function CalendarView({ habit, className }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const { getCompletionsForHabit, toggleCompletion } = useHabitStore();
  
  const completions = getCompletionsForHabit(habit.uuid);
  const completionMap = new Map(
    completions.map(c => [c.date, c.completed])
  );
  
  const habitIcon = getHabitIconEmoji(habit.icon);
  
  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays: Date[] = [];
  let day = calendarStart;
  
  while (day <= calendarEnd) {
    calendarDays.push(new Date(day));
    day = addDays(day, 1);
  }
  
  // Handle day click
  const handleDayClick = async (date: Date) => {
    try {
      await toggleCompletion(habit.uuid, date);
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    }
  };
  
  // Get completion status for a day
  const isCompleted = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completionMap.get(dateStr) || false;
  };
  
  // Week days header
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">{habitIcon}</span>
            <span>{habit.name}</span>
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          </CardTitle>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="ghost" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week days header */}
          {weekDays.map(day => (
            <div 
              key={day} 
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isCompletedDay = isCompleted(date);
            const isTodayDate = isToday(date);
            const isPastMonth = !isCurrentMonth && date < monthStart;
            const isFutureMonth = !isCurrentMonth && date > monthEnd;
            
            return (
              <button
                key={index}
                onClick={() => handleDayClick(date)}
                disabled={!isCurrentMonth}
                className={cn(
                  "p-2 text-sm rounded-md transition-all duration-200 hover:scale-105",
                  "border border-transparent",
                  // Base styles
                  isCurrentMonth 
                    ? "text-foreground cursor-pointer" 
                    : "text-muted-foreground/50 cursor-not-allowed",
                  // Completion status
                  isCompletedDay && isCurrentMonth
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                    : isCurrentMonth
                    ? "bg-background hover:bg-accent hover:text-accent-foreground"
                    : "bg-transparent",
                  // Today highlight
                  isTodayDate && "ring-2 ring-primary ring-offset-1",
                  // Hover states
                  isCurrentMonth && !isCompletedDay && "hover:border-border"
                )}
                title={`${format(date, 'yyyy-MM-dd')} - ${
                  isCompletedDay ? 'Completed' : 'Not completed'
                }`}
              >
                {format(date, 'd')}
              </button>
            );
          })}
        </div>
        
        {/* Calendar Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-background border border-border rounded"></div>
            <span>Not completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-background border-2 border-primary rounded"></div>
            <span>Today</span>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {completions.filter(c => 
                c.completed && 
                format(parseISO(c.date), 'yyyy-MM') === format(currentDate, 'yyyy-MM')
              ).length}
            </div>
            <div className="text-xs text-muted-foreground">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(
                (completions.filter(c => 
                  c.completed && 
                  format(parseISO(c.date), 'yyyy-MM') === format(currentDate, 'yyyy-MM')
                ).length / new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) * 100
              ) || 0}%
            </div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {completions.filter(c => c.completed).length}
            </div>
            <div className="text-xs text-muted-foreground">Total Days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}