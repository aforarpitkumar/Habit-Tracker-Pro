'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Target, Award, Activity, Flame } from 'lucide-react';
import type { OverallStats } from '@/lib/utils/analytics';

interface StatsOverviewProps {
  stats: OverallStats;
  isLoading?: boolean;
}

export function StatsOverview({ stats, isLoading = false }: StatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-16 mb-2" />
                <div className="h-8 bg-muted rounded w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getConsistencyColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConsistencyLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Active Habits */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">Active Habits</span>
          </div>
          <div className="text-2xl font-bold">{stats.activeHabits}</div>
          <p className="text-xs text-muted-foreground">of {stats.totalHabits} total</p>
        </CardContent>
      </Card>

      {/* Total Completions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">Completions</span>
          </div>
          <div className="text-2xl font-bold">{stats.totalCompletions}</div>
          <p className="text-xs text-muted-foreground">last 30 days</p>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-muted-foreground">Avg Rate</span>
          </div>
          <div className="text-2xl font-bold">{stats.averageCompletionRate.toFixed(1)}%</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2 w-full">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all" 
              style={{ width: `${Math.min(stats.averageCompletionRate, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Best Streak */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-muted-foreground">Best Streak</span>
          </div>
          <div className="text-2xl font-bold">{stats.bestStreak}</div>
          <p className="text-xs text-muted-foreground">days</p>
        </CardContent>
      </Card>

      {/* Active Days */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-muted-foreground">Active Days</span>
          </div>
          <div className="text-2xl font-bold">{stats.activeDays}</div>
          <p className="text-xs text-muted-foreground">of 30 days</p>
        </CardContent>
      </Card>

      {/* Consistency Score */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-muted-foreground">Consistency</span>
          </div>
          <div className={`text-2xl font-bold ${getConsistencyColor(stats.consistencyScore)}`}>
            {stats.consistencyScore}
          </div>
          <span className={`text-xs px-2 py-1 rounded ${getConsistencyColor(stats.consistencyScore)} bg-muted`}>
            {getConsistencyLabel(stats.consistencyScore)}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}