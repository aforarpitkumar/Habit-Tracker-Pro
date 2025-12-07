'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Quote, Lightbulb, RefreshCw, Heart, Star } from 'lucide-react';
import { getRandomQuote, getRandomTip, getDailyMotivation } from '@/lib/constants/motivationalContent';
import type { MotivationalQuote, MotivationalTip } from '@/lib/constants/motivationalContent';

interface MotivationalDisplayProps {
  className?: string;
  showDailyContent?: boolean;
}

export function MotivationalDisplay({ className, showDailyContent = true }: MotivationalDisplayProps) {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(null);
  const [currentTip, setCurrentTip] = useState<MotivationalTip | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (showDailyContent) {
      const { quote, tip } = getDailyMotivation();
      setCurrentQuote(quote);
      setCurrentTip(tip);
    } else {
      setCurrentQuote(getRandomQuote());
      setCurrentTip(getRandomTip());
    }
  }, [showDailyContent]);

  const refreshContent = () => {
    setCurrentQuote(getRandomQuote());
    setCurrentTip(getRandomTip());
    setIsLiked(false);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'motivation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'persistence': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'success': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'mindset': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'habit-building': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'productivity': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'wellness': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'strategy': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!currentQuote || !currentTip) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Daily Quote */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-3xl" />
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Quote className="h-5 w-5 text-blue-600" />
              {showDailyContent ? 'Quote of the Day' : 'Inspirational Quote'}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                className={`h-8 w-8 p-0 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              {!showDailyContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshContent}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <blockquote className="text-lg font-medium leading-relaxed text-gray-900 dark:text-gray-100">
              "{currentQuote.text}"
            </blockquote>
            <div className="flex items-center justify-between">
              {currentQuote.author && (
                <cite className="text-sm text-muted-foreground">
                  — {currentQuote.author}
                </cite>
              )}
              <Badge className={getCategoryColor(currentQuote.category)}>
                {currentQuote.category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Tip */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-bl-3xl" />
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              {showDailyContent ? 'Tip of the Day' : 'Habit Building Tip'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTip.icon}</span>
              <Badge className={getCategoryColor(currentTip.category)}>
                {currentTip.category}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {currentTip.title}
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {currentTip.content}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {currentTip.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Compact version for dashboard
export function MotivationalWidget() {
  const [content, setContent] = useState<{ quote: MotivationalQuote; tip: MotivationalTip } | null>(null);

  useEffect(() => {
    setContent(getDailyMotivation());
  }, []);

  if (!content) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Quote className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <blockquote className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
              "{content.quote.text}"
              {content.quote.author && (
                <cite className="block text-xs text-muted-foreground mt-1">
                  — {content.quote.author}
                </cite>
              )}
            </blockquote>
          </div>
          
          <div className="flex items-start gap-3 pt-2 border-t">
            <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {content.tip.icon} {content.tip.title}
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {content.tip.content.length > 120 
                  ? content.tip.content.substring(0, 120) + '...'
                  : content.tip.content
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}