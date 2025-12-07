'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHabitStore } from '@/lib/stores/habitStore';
import { getHabitIconEmoji } from '@/lib/utils';
import { Trophy, Users, TrendingUp, Star, Search, Filter, Medal, Target, X } from 'lucide-react';
import type { Habit } from '@/types';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  totalHabits: number;
  completedToday: number;
  streak: number;
  completionRate: number;
  habitCategories: string[];
  badges: string[];
  rank: number;
}

interface HabitComparison {
  habitName: string;
  icon: string;
  color: string;
  yourProgress: {
    streak: number;
    completionRate: number;
    totalCompletions: number;
  };
  communityAverage: {
    averageStreak: number;
    averageCompletionRate: number;
    totalUsers: number;
  };
  ranking: number;
  percentile: number;
}

interface SocialProgressProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SocialProgressModal({ open, onOpenChange }: SocialProgressProps) {
  const { habits, getStreakForHabit, getCompletionRate } = useHabitStore();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'compare'>('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHabit, setSelectedHabit] = useState<string>('');

  // Mock data for demonstration - in a real app, this would come from a backend
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      totalHabits: 8,
      completedToday: 7,
      streak: 45,
      completionRate: 92,
      habitCategories: ['fitness', 'productivity', 'mindfulness'],
      badges: ['💪', '🎯', '🔥'],
      rank: 1,
    },
    {
      id: '2',
      name: 'Sarah Chen',
      totalHabits: 6,
      completedToday: 6,
      streak: 38,
      completionRate: 89,
      habitCategories: ['health', 'learning', 'creativity'],
      badges: ['🌟', '📚', '🎨'],
      rank: 2,
    },
    {
      id: '3',
      name: 'Mike Wilson',
      totalHabits: 10,
      completedToday: 8,
      streak: 32,
      completionRate: 85,
      habitCategories: ['fitness', 'productivity', 'social'],
      badges: ['💪', '⚡', '👥'],
      rank: 3,
    },
    {
      id: '4',
      name: 'You',
      totalHabits: habits.filter(h => !h.archived).length,
      completedToday: Math.floor(habits.length * 0.7), // Mock completion
      streak: Math.max(...habits.map(h => getStreakForHabit(h.uuid))),
      completionRate: Math.round(habits.reduce((acc, h) => acc + getCompletionRate(h.uuid, 30), 0) / Math.max(habits.length, 1)),
      habitCategories: ['personal'],
      badges: ['🆕'],
      rank: 4,
    },
    {
      id: '5',
      name: 'Emma Davis',
      totalHabits: 7,
      completedToday: 5,
      streak: 28,
      completionRate: 82,
      habitCategories: ['wellness', 'productivity'],
      badges: ['🧘', '✅'],
      rank: 5,
    },
  ];

  const generateHabitComparisons = (): HabitComparison[] => {
    return habits.filter(h => !h.archived).map((habit, index) => ({
      habitName: habit.name,
      icon: habit.icon,
      color: habit.color,
      yourProgress: {
        streak: getStreakForHabit(habit.uuid),
        completionRate: getCompletionRate(habit.uuid, 30),
        totalCompletions: getStreakForHabit(habit.uuid) * 0.8, // Mock calculation
      },
      communityAverage: {
        averageStreak: 15 + Math.random() * 20,
        averageCompletionRate: 60 + Math.random() * 30,
        totalUsers: 150 + Math.floor(Math.random() * 500),
      },
      ranking: index + 1,
      percentile: 70 + Math.random() * 25,
    }));
  };

  const habitComparisons = generateHabitComparisons();
  const filteredComparisons = selectedHabit
    ? habitComparisons.filter(comp => comp.habitName.toLowerCase().includes(selectedHabit.toLowerCase()))
    : habitComparisons;

  const filteredLeaderboard = searchQuery
    ? mockLeaderboard.filter(entry => entry.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockLeaderboard;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getPercentileMessage = (percentile: number) => {
    if (percentile >= 90) return 'Exceptional! Top 10%';
    if (percentile >= 75) return 'Great! Top 25%';
    if (percentile >= 50) return 'Good! Above average';
    return 'Keep going! Room for improvement';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Social Progress & Leaderboards
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('leaderboard')}
            className="flex-1"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </Button>
          <Button
            variant={activeTab === 'compare' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('compare')}
            className="flex-1"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Compare Habits
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] px-1">
          {activeTab === 'leaderboard' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Leaderboard */}
              <div className="space-y-2 sm:space-y-3">
                {filteredLeaderboard.map((entry) => (
                  <Card key={entry.id} className={entry.name === 'You' ? 'border-primary' : ''}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="text-xl sm:text-2xl font-bold text-center min-w-[2.5rem] sm:min-w-[3rem]">
                            {getRankIcon(entry.rank)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <h3 className="font-semibold text-sm sm:text-base">{entry.name}</h3>
                              {entry.name === 'You' && <Badge variant="secondary" className="text-xs">You</Badge>}
                              <div className="flex gap-1">
                                {entry.badges.map((badge, i) => (
                                  <span key={i} className="text-xs sm:text-sm">{badge}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <span>{entry.totalHabits} habits</span>
                              <span>{entry.completedToday}/{entry.totalHabits} today</span>
                              <span>{entry.streak} day streak</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-bold text-primary">
                            {entry.completionRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            completion rate
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Legend */}
              <Card className="bg-muted/50">
                <CardContent className="p-3 sm:p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Star className="h-4 w-4" />
                    Achievement Badges
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm">
                    <div>💪 Fitness Master</div>
                    <div>🎯 Goal Crusher</div>
                    <div>🔥 Streak Champion</div>
                    <div>🌟 Consistency Star</div>
                    <div>📚 Learning Enthusiast</div>
                    <div>🎨 Creative Spirit</div>
                    <div>⚡ Productivity Pro</div>
                    <div>👥 Community Leader</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Habit Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search your habits..."
                  value={selectedHabit}
                  onChange={(e) => setSelectedHabit(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Habit Comparisons */}
              <div className="space-y-3 sm:space-y-4">
                {filteredComparisons.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 sm:p-8 text-center">
                      <Target className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">No habits to compare</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Create some habits first to see how you compare with the community!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredComparisons.map((comparison) => (
                    <Card key={comparison.habitName}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 sm:gap-3">
                          <span
                            className="text-xl sm:text-2xl p-1.5 sm:p-2 rounded-lg"
                            style={{ backgroundColor: `${comparison.color}20` }}
                          >
                            {getHabitIconEmoji(comparison.icon)}
                          </span>
                          <div className="flex-1">
                            <div className="text-sm sm:text-base">{comparison.habitName}</div>
                            <div className="text-xs sm:text-sm font-normal text-muted-foreground">
                              Rank #{comparison.ranking} • {getPercentileMessage(comparison.percentile)}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(comparison.percentile)}th percentile
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          {/* Your Progress */}
                          <div>
                            <h4 className="font-semibold mb-2 sm:mb-3 text-foreground text-sm sm:text-base">Your Progress</h4>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Current Streak:</span>
                                <span className="font-medium text-xs sm:text-sm">{comparison.yourProgress.streak} days</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">30-day Rate:</span>
                                <span className="font-medium text-xs sm:text-sm">{comparison.yourProgress.completionRate}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Total Completions:</span>
                                <span className="font-medium text-xs sm:text-sm">{Math.round(comparison.yourProgress.totalCompletions)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Community Average */}
                          <div>
                            <h4 className="font-semibold mb-2 sm:mb-3 text-muted-foreground text-sm sm:text-base">Community Average</h4>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Average Streak:</span>
                                <span className="font-medium text-xs sm:text-sm">{Math.round(comparison.communityAverage.averageStreak)} days</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Average Rate:</span>
                                <span className="font-medium text-xs sm:text-sm">{Math.round(comparison.communityAverage.averageCompletionRate)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Total Users:</span>
                                <span className="font-medium text-xs sm:text-sm">{comparison.communityAverage.totalUsers}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Comparison */}
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span>vs Community Average:</span>
                            <div className="flex items-center gap-1 sm:gap-2">
                              {comparison.yourProgress.completionRate > comparison.communityAverage.averageCompletionRate ? (
                                <>
                                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                  <span className="text-green-600 font-medium">
                                    +{Math.round(comparison.yourProgress.completionRate - comparison.communityAverage.averageCompletionRate)}% better
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-orange-600 font-medium">
                                    {Math.round(comparison.communityAverage.averageCompletionRate - comparison.yourProgress.completionRate)}% behind
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-3 sm:pt-4 border-t">
          <p>
            🔒 Your data is private. Community stats are anonymized and aggregated.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}