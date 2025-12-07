'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, TrendingUp, Flame } from 'lucide-react';
import { getHabitIconEmoji } from '@/lib/utils';
import type { HabitStats } from '@/lib/utils/analytics';

interface HabitLeaderboardProps {
  habits: HabitStats[];
  title?: string;
  limit?: number;
}

export function HabitLeaderboard({ 
  habits, 
  title = "Top Performing Habits", 
  limit = 5 
}: HabitLeaderboardProps) {
  const topHabits = habits.slice(0, limit);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getConsistencyColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (topHabits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No habits to display yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topHabits.map((habit, index) => (
          <div 
            key={habit.habitUuid}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 flex justify-center">
              {getRankIcon(index)}
            </div>

            {/* Habit Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getHabitIconEmoji('target')}</span>
                <h3 className="font-medium truncate">{habit.habitName}</h3>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  <span>{habit.currentStreak} day streak</span>
                </div>
                <div>
                  {habit.completionRate.toFixed(1)}% completion
                </div>
                <div>
                  {habit.totalCompletions} total
                </div>
              </div>
            </div>

            {/* Consistency Score */}
            <div className="flex-shrink-0 text-right">
              <div className={`px-2 py-1 rounded text-xs font-medium ${getConsistencyColor(habit.consistencyScore)}`}>
                {habit.consistencyScore}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                consistency
              </div>
            </div>
          </div>
        ))}
        
        {habits.length > limit && (
          <div className="text-center text-xs text-muted-foreground pt-2">
            Showing top {limit} of {habits.length} habits
          </div>
        )}
      </CardContent>
    </Card>
  );
}