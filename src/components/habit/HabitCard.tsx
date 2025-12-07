'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HabitGrid } from './HabitGrid';
import { useHabitStore } from '@/lib/stores/habitStore';
import { useAppearanceStore } from '@/lib/stores/appearanceStore';
import { getHabitIconEmoji } from '@/lib/utils';
import { getFrequencyDescription } from '@/lib/utils/frequency';
import type { Habit } from '@/types';
import { Archive, MoreHorizontal, Target, Edit, Share2, Trash2 } from 'lucide-react';
import { HabitEditModal } from './HabitEditModal';
import { HabitSharingModal } from '../social/HabitSharingModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { archiveHabit, deleteHabit, getStreakForHabit, getLongestStreakForHabit, getCompletionRate, toggleCompletion, getCompletionsForHabit } = useHabitStore();
  const { getCardStyleClass, getLayoutDensityClass } = useAppearanceStore();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  
  const currentStreak = getStreakForHabit(habit.uuid);
  const longestStreak = getLongestStreakForHabit(habit.uuid);
  const completionRate = getCompletionRate(habit.uuid, 30); // 30-day completion rate
  const completions = getCompletionsForHabit(habit.uuid);
  
  // Calculate total completions for additional context
  const totalCompletions = completions.filter(c => c.completed).length;
  
  // Demo function to add sample completions (for testing)
  const addDemoCompletions = async () => {
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      await toggleCompletion(habit.uuid, date);
    }
  };
  
  // Find the actual emoji icon from the icon ID
  const habitIcon = getHabitIconEmoji(habit.icon);
  
  const handleArchive = () => {
    archiveHabit(habit.uuid);
  };

  const handleDelete = () => {
    deleteHabit(habit.uuid);
  };
  
  return (
    <Card className={`w-full ${getCardStyleClass()}`}>
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${getLayoutDensityClass()}`}>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">{habitIcon}</span>
          <span>{habit.name}</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Demo button for testing (development only) */}
          {process.env.NODE_ENV === 'development' && currentStreak === 0 && longestStreak === 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={addDemoCompletions}
              title="Add demo completions"
              className="text-xs"
            >
              ➕ Demo
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditModal(true)}
            title="Edit habit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowShareModal(true)}
            title="Share habit"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="More options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Archive Habit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Habit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className={getLayoutDensityClass()}>
        {habit.description && (
          <p className="text-sm text-muted-foreground mb-4">{habit.description}</p>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{longestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
              <div className="text-xs text-muted-foreground">30-Day Rate</div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {getFrequencyDescription(habit.frequency)}
          </div>
        </div>
        
        <HabitGrid habitUuid={habit.uuid} days={90} />
      </CardContent>
      
      {/* Edit Modal */}
      <HabitEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        habit={habit}
      />
      
      {/* Share Modal */}
      <HabitSharingModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        habit={habit}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Habit"
        description={`Do you really want to delete "${habit.name}"? This action cannot be undone and will permanently remove all progress data for this habit.`}
        confirmText="Yes, Delete"
        cancelText="No, Keep It"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </Card>
  );
}