'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getHabitIconEmoji } from '@/lib/utils';
import { getFrequencyDescription } from '@/lib/utils/frequency';
import { useHabitStore } from '@/lib/stores/habitStore';
import { Plus, ArrowLeft, Share2, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Habit } from '@/types';

interface ShareableHabit {
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: Habit['frequency'];
  sharedBy: string;
  sharedAt: string;
}

export default function SharedHabitPage() {
  const searchParams = useSearchParams();
  const { addHabit } = useHabitStore();
  const [sharedHabit, setSharedHabit] = useState<ShareableHabit | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const decodedData = atob(data);
        const habit = JSON.parse(decodedData) as ShareableHabit;
        setSharedHabit(habit);
      } catch (err) {
        setError('Invalid habit data. The link may be corrupted.');
        console.error('Failed to decode habit data:', err);
      }
    } else {
      setError('No habit data found in the link.');
    }
  }, [searchParams]);

  const handleAddHabit = async () => {
    if (!sharedHabit) return;
    
    setIsAdding(true);
    try {
      await addHabit({
        name: sharedHabit.name,
        description: sharedHabit.description,
        icon: sharedHabit.icon,
        color: sharedHabit.color,
        frequency: sharedHabit.frequency,
        archived: false,
      });
      
      // Redirect to main page after adding
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to add habit:', error);
      setError('Failed to add habit. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const shareHabit = () => {
    if (navigator.share && sharedHabit) {
      navigator.share({
        title: `${sharedHabit.name} - Habit Tracker`,
        text: `Check out this habit: "${sharedHabit.name}" shared by ${sharedHabit.sharedBy}`,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Oops! Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Habit Tracker
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sharedHabit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={shareHabit}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Shared Habit Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <span 
                className="text-4xl p-3 rounded-xl shadow-sm"
                style={{ backgroundColor: `${sharedHabit.color}20` }}
              >
                {getHabitIconEmoji(sharedHabit.icon)}
              </span>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{sharedHabit.name}</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">
                    {getFrequencyDescription(sharedHabit.frequency)}
                  </Badge>
                  <Badge variant="outline">
                    by {sharedHabit.sharedBy}
                  </Badge>
                  <Badge variant="outline">
                    {new Date(sharedHabit.sharedAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          {sharedHabit.description && (
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {sharedHabit.description}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Frequency Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Frequency Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">{sharedHabit.frequency.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target:</span>
                <span className="font-medium">
                  {sharedHabit.frequency.target} time{sharedHabit.frequency.target !== 1 ? 's' : ''}
                </span>
              </div>
              {sharedHabit.frequency.period > 1 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period:</span>
                  <span className="font-medium">Every {sharedHabit.frequency.period} days</span>
                </div>
              )}
              {sharedHabit.frequency.daysOfWeek && sharedHabit.frequency.daysOfWeek.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days:</span>
                  <span className="font-medium">
                    {sharedHabit.frequency.daysOfWeek.map(day => 
                      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
                    ).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">
                Want to track this habit too?
              </h3>
              <p className="text-muted-foreground">
                Add this habit to your personal tracker and start building this positive routine.
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/">
                  <Button variant="outline">
                    View My Habits
                  </Button>
                </Link>
                <Button 
                  onClick={handleAddHabit} 
                  disabled={isAdding}
                  className="min-w-[120px]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isAdding ? 'Adding...' : 'Add Habit'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <Link href="/" className="font-medium hover:underline">
              Habit Tracker PWA
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}