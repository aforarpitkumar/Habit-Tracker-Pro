'use client';

import React from 'react';
import { HabitCard } from '@/components/habit/HabitCard';
import { HabitCreationModal } from '@/components/habit/HabitCreationModal';
import { Button } from '@/components/ui/button';
import { useHabitStore } from '@/lib/stores/habitStore';
import { useAppearanceStore } from '@/lib/stores/appearanceStore';
import { Plus, Target, Calendar, BarChart3, Settings, Users, Trophy, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SocialProgressModal } from '@/components/social/SocialProgressModal';
import { AchievementsModal } from '@/components/social/AchievementsModal';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { SyncStatus } from '@/components/pwa/SyncStatus';

export default function Home() {
  const { habits, getActiveHabits, loadHabits, loadCompletions, isLoading } = useHabitStore();
  const { getGridSizeClass, getLayoutDensityClass } = useAppearanceStore();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showSocialModal, setShowSocialModal] = React.useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = React.useState(false);
  const router = useRouter();
  
  const activeHabits = getActiveHabits();
  
  // Load data on mount with error handling
  React.useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Starting to load data...');
      try {
        await loadHabits();
        console.log('✅ Habits loaded');
        await loadCompletions();
        console.log('✅ Completions loaded');
      } catch (error) {
        console.error('❌ Error loading data:', error);
      }
    };
    loadData();
  }, [loadHabits, loadCompletions]);
  
  console.log('📊 Render state:', { isLoading, habitsCount: habits.length, activeHabitsCount: activeHabits.length });
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Target className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading your habits...</p>
        </div>
      </div>
    );
  }
  
  // Main app content
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Habit Tracker Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <SyncStatus />
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => router.push('/social')}>
                  <Heart className="w-4 h-4 mr-2" />
                  Social & Motivation
                </Button>
                <Button variant="outline" onClick={() => setShowAchievementsModal(true)}>
                  <Trophy className="w-4 h-4 mr-2" />
                  Achievements
                </Button>
                <Button variant="outline" onClick={() => setShowSocialModal(true)}>
                  <Users className="w-4 h-4 mr-2" />
                  Progress
                </Button>
                <Button variant="outline" onClick={() => router.push('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" onClick={() => router.push('/analytics')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" onClick={() => router.push('/calendar')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar View
                </Button>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Habit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className={`container mx-auto px-4 py-8 ${getLayoutDensityClass()}`}>
        {activeHabits.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No habits yet</h2>
              <p className="text-muted-foreground mb-6">
                Start building better habits today. Create your first habit to get started!
              </p>
              <Button onClick={() => setShowCreateModal(true)} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Habit
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                My Habits ({activeHabits.length})
              </h2>
              <div className="text-sm text-muted-foreground">
                Keep up the great work! 🎯
              </div>
            </div>
            
            <div className={`grid ${getGridSizeClass()}`}>
              {activeHabits.map((habit: any) => (
                <HabitCard key={habit.uuid} habit={habit} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Modals */}
      <HabitCreationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
      
      <SocialProgressModal
        open={showSocialModal}
        onOpenChange={setShowSocialModal}
      />
      
      <AchievementsModal
        open={showAchievementsModal}
        onOpenChange={setShowAchievementsModal}
      />
      
      {/* PWA Features */}
      <PWAInstallPrompt />
    </div>
  );
}

