'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHabitStore } from '@/lib/stores/habitStore';
import { StatsOverview } from '@/components/analytics/StatsOverview';
import { TrendChart } from '@/components/analytics/TrendChart';
import { HabitLeaderboard } from '@/components/analytics/HabitLeaderboard';
import { 
  calculateOverallStats, 
  generateTrendData, 
  getTopPerformingHabits,
  calculateHabitStats
} from '@/lib/utils/analytics';

export default function AnalyticsPage() {
  const router = useRouter();
  const { habits, completions } = useHabitStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const overallStats = calculateOverallStats(habits, completions, selectedPeriod);
  const trendData = generateTrendData(habits, completions, selectedPeriod);
  const topHabits = getTopPerformingHabits(habits, completions);

  // Calculate additional insights
  const habitStats = habits
    .filter(h => !h.archived)
    .map(habit => calculateHabitStats(habit, completions, selectedPeriod));

  const averageStreak = habitStats.length > 0 
    ? habitStats.reduce((sum, stat) => sum + stat.currentStreak, 0) / habitStats.length 
    : 0;

  const periodsData = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Insights and trends for your habit tracking journey
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {periodsData.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="mb-6">
          <StatsOverview stats={overallStats} isLoading={isLoading} />
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Trend Chart */}
          <TrendChart 
            data={trendData} 
            title={`Completion Trends (${selectedPeriod} days)`}
          />

          {/* Habit Leaderboard */}
          <HabitLeaderboard habits={topHabits} />
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Average Streak Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {averageStreak.toFixed(1)} days
              </div>
              <p className="text-sm text-muted-foreground">
                Across all active habits
              </p>
            </CardContent>
          </Card>

          {/* Completion Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const dayData = trendData.slice(-7)[index];
                  const completions = dayData?.completions || 0;
                  const maxWeekly = Math.max(...trendData.slice(-7).map(d => d.completions), 1);
                  const percentage = (completions / maxWeekly) * 100;
                  
                  return (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-xs w-8">{day}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="h-2 bg-green-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs w-6">{completions}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Most productive day</span>
                <span className="text-sm font-medium">
                  {trendData.length > 0 
                    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                        trendData.reduce((maxIndex, current, index) => 
                          current.completions > (trendData[maxIndex]?.completions || 0) ? index : maxIndex, 0
                        ) % 7
                      ]
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total active days</span>
                <span className="text-sm font-medium">{overallStats.activeDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average per day</span>
                <span className="text-sm font-medium">
                  {overallStats.activeDays > 0 
                    ? (overallStats.totalCompletions / overallStats.activeDays).toFixed(1)
                    : '0'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Analytics are calculated based on your local data and updated in real-time
        </div>
      </div>
    </div>
  );
}