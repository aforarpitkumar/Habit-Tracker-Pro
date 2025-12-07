'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, Target, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { StreakBreak, MotivationalMessage, RecoveryStrategy } from '@/lib/services/streakRecoveryService';
import type { Habit } from '@/types';

interface StreakRecoveryCardProps {
  habit: Habit;
  streakBreak: StreakBreak;
  motivationalMessage: MotivationalMessage;
  recoveryStrategies: RecoveryStrategy[];
  onComplete: () => void;
}

export function StreakRecoveryCard({ 
  habit, 
  streakBreak, 
  motivationalMessage, 
  recoveryStrategies,
  onComplete 
}: StreakRecoveryCardProps) {
  const [showStrategies, setShowStrategies] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const getMessageIcon = (type: MotivationalMessage['type']) => {
    switch (type) {
      case 'recovery': return '🔄';
      case 'encouragement': return '💪';
      case 'milestone': return '🏆';
      case 'comeback': return '🚀';
      default: return '✨';
    }
  };

  const getProgressPercentage = () => {
    if (streakBreak.previousStreak === 0) return 0;
    return Math.min((streakBreak.recoveryStreak / streakBreak.previousStreak) * 100, 100);
  };

  const getDifficultyColor = (difficulty: RecoveryStrategy['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getMessageIcon(motivationalMessage.type)}</span>
            <div>
              <CardTitle className="text-lg">{motivationalMessage.title}</CardTitle>
              <CardDescription className="font-medium text-primary">
                {habit.name}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary">
            {motivationalMessage.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Motivational Message */}
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm leading-relaxed">{motivationalMessage.message}</p>
          {motivationalMessage.action && (
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              💡 {motivationalMessage.action}
            </p>
          )}
        </div>

        {/* Recovery Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Recovery Progress</span>
            <span className="text-muted-foreground">
              {streakBreak.recoveryStreak} / {streakBreak.previousStreak} days
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Previous streak: {streakBreak.previousStreak} days</span>
            <span>{Math.round(getProgressPercentage())}% recovered</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-red-500">{streakBreak.daysBroken}</p>
            <p className="text-xs text-muted-foreground">Days Broken</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-500">{streakBreak.recoveryStreak}</p>
            <p className="text-xs text-muted-foreground">Recovery Streak</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-blue-500">{streakBreak.previousStreak}</p>
            <p className="text-xs text-muted-foreground">Previous Best</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={onComplete} className="flex-1">
            <Target className="w-4 h-4 mr-2" />
            Complete Today
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowStrategies(!showStrategies)}
            className="flex-shrink-0"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Strategies
            {showStrategies ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>
        </div>

        {/* Recovery Strategies */}
        {showStrategies && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recovery Strategies
            </h4>
            
            <div className="space-y-2">
              {recoveryStrategies.slice(0, 3).map((strategy) => (
                <div 
                  key={strategy.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedStrategy === strategy.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">{strategy.name}</h5>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getDifficultyColor(strategy.difficulty)}`} />
                      <Badge variant="outline" className="text-xs">
                        {Math.round(strategy.effectiveness * 100)}% effective
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {strategy.description}
                  </p>
                  
                  {selectedStrategy === strategy.id && (
                    <div className="space-y-1 pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">Action Steps:</p>
                      <ul className="space-y-1">
                        {strategy.steps.map((step, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inspirational Quote */}
        <div className="text-center pt-2 border-t">
          <p className="text-sm italic text-muted-foreground">
            "The comeback is always stronger than the setback." 💪
          </p>
        </div>
      </CardContent>
    </Card>
  );
}