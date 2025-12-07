'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useHabitStore } from '@/lib/stores/habitStore';
import { calculateAchievements, getRecentAchievements, getNextAchievement, getOverallProgress } from '@/lib/achievements';
import { Trophy, Star, Target, Gift, Calendar, Users, Zap, X } from 'lucide-react';
import type { Achievement } from '@/lib/achievements';

interface AchievementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AchievementsModal({ open, onOpenChange }: AchievementsModalProps) {
  const { habits, completions, getStreakForHabit, getCompletionRate } = useHabitStore();

  const achievements = calculateAchievements(
    habits,
    completions,
    getStreakForHabit,
    getCompletionRate
  );

  const recentAchievements = getRecentAchievements(achievements);
  const nextAchievement = getNextAchievement(achievements);
  const overallProgress = getOverallProgress(achievements);

  const earnedAchievements = achievements.filter(a => a.earned);
  const unearnedAchievements = achievements.filter(a => !a.earned);

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'streak': return '🔥';
      case 'completion': return '🎯';
      case 'consistency': return '✨';
      case 'variety': return '🎨';
      case 'milestone': return '🌟';
      default: return '🏆';
    }
  };

  const getCategoryName = (category: Achievement['category']) => {
    switch (category) {
      case 'streak': return 'Streak';
      case 'completion': return 'Completion';
      case 'consistency': return 'Consistency';
      case 'variety': return 'Variety';
      case 'milestone': return 'Milestone';
      default: return 'General';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements & Progress
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

        <div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] px-1">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Overall Progress
                </span>
                <Badge variant="secondary">
                  {earnedAchievements.length}/{achievements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={overallProgress} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{overallProgress}% Complete</span>
                  <span>{earnedAchievements.length} earned</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Recently Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                  {recentAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted rounded-lg"
                    >
                      <span className="text-xl sm:text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">{achievement.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {achievement.earnedAt?.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryName(achievement.category)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Achievement */}
          {nextAchievement && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Next Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <span className="text-2xl sm:text-3xl">{nextAchievement.icon}</span>
                  <div className="flex-1 w-full">
                    <h4 className="font-semibold text-sm sm:text-base mb-1">{nextAchievement.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      {nextAchievement.description}
                    </p>
                    <div className="space-y-2">
                      <Progress
                        value={(nextAchievement.progress / nextAchievement.maxProgress) * 100}
                        className="h-2"
                      />
                      <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0 text-xs sm:text-sm text-muted-foreground">
                        <span>
                          {nextAchievement.progress} / {nextAchievement.maxProgress}
                        </span>
                        <span>
                          {Math.round((nextAchievement.progress / nextAchievement.maxProgress) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs mt-2 sm:mt-0">
                    {getCategoryName(nextAchievement.category)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Earned Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Earned Achievements ({earnedAchievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {earnedAchievements.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-semibold mb-2">No achievements yet</h3>
                  <p className="text-muted-foreground">
                    Start completing habits to earn your first achievement!
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {earnedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">{achievement.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm">{achievement.name}</h4>
                          <p className="text-xs text-muted-foreground mb-1 sm:mb-2 line-clamp-2">
                            {achievement.description}
                          </p>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryName(achievement.category)}
                            </Badge>
                            {achievement.earnedAt && (
                              <span className="text-xs text-muted-foreground">
                                {achievement.earnedAt.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* In Progress Achievements */}
          {unearnedAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  In Progress ({unearnedAchievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                  {unearnedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-2 sm:p-3 border rounded-lg opacity-75"
                    >
                      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="text-xl sm:text-2xl grayscale">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-xs sm:text-sm">{achievement.name}</h4>
                          <p className="text-xs text-muted-foreground mb-1 sm:mb-2">
                            {achievement.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(achievement.category)}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Progress
                          value={(achievement.progress / achievement.maxProgress) * 100}
                          className="h-1.5 sm:h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {achievement.progress} / {achievement.maxProgress}
                          </span>
                          <span>
                            {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-3 sm:pt-4 border-t">
          <p>🏆 Keep building great habits to unlock more achievements!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}