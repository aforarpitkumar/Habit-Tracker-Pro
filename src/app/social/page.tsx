'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MotivationalDisplay, MotivationalWidget } from '@/components/social/MotivationalDisplay';
import { CommunityChallenges } from '@/components/social/CommunityChallenges';
import { CelebrationDisplay, useCelebration, CelebrationToast } from '@/components/social/CelebrationDisplay';
import { Heart, Users, Trophy, Sparkles, Target, Zap, Star, Gift, X } from 'lucide-react';

export default function SocialPage() {
  const router = useRouter();
  const { celebration, triggerCelebration, CelebrationComponent } = useCelebration();
  const [toastCelebrations, setToastCelebrations] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => router.push('/'), 150); // Small delay for animation
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  const handleTestCelebration = (eventType: string, value: number) => {
    triggerCelebration(eventType, value);
  };

  const handleTestToast = (eventType: string, value: number) => {
    // This would be used for smaller celebrations
    const newToast = {
      id: Date.now(),
      eventType,
      value,
      timestamp: Date.now()
    };
    setToastCelebrations(prev => [...prev, newToast]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToastCelebrations(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Social & Motivation
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] px-1">
          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <p className="text-muted-foreground text-sm">
              Stay motivated, connect with the community, and celebrate your progress with inspirational content, challenges, and achievements.
            </p>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="motivation" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="motivation" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Motivation</span>
                <span className="sm:hidden">Motivate</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Challenges</span>
                <span className="sm:hidden">Challenge</span>
              </TabsTrigger>
              <TabsTrigger value="celebrations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Celebrations</span>
                <span className="sm:hidden">Celebrate</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Achievements</span>
                <span className="sm:hidden">Achieve</span>
              </TabsTrigger>
            </TabsList>

        {/* Motivation Tab */}
        <TabsContent value="motivation" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Daily Motivation */}
            <div className="lg:col-span-2">
              <MotivationalDisplay showDailyContent={true} />
            </div>
            
            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Habits</span>
                    <Badge variant="secondary">5 habits</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Streak</span>
                    <Badge className="bg-orange-100 text-orange-800">12 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <Badge className="bg-green-100 text-green-800">87%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Challenges Joined</span>
                    <Badge className="bg-purple-100 text-purple-800">3 active</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Motivational Widget */}
              <MotivationalWidget />
            </div>
          </div>

          {/* Random Motivation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Need a boost?
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Get Random Quote
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MotivationalDisplay showDailyContent={false} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <CommunityChallenges />
        </TabsContent>

        {/* Celebrations Tab */}
        <TabsContent value="celebrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-yellow-600" />
                Celebration System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Test out the celebration system to see how achievements and milestones are celebrated in the app.
              </p>

              {/* Test Celebration Buttons */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Button
                  variant="outline"
                  onClick={() => handleTestCelebration('habit_completed', 1)}
                  className="flex items-center gap-2"
                >
                  <span>🎉</span>
                  First Completion
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestCelebration('streak_reached', 3)}
                  className="flex items-center gap-2"
                >
                  <span>🔥</span>
                  3-Day Streak
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestCelebration('streak_reached', 7)}
                  className="flex items-center gap-2"
                >
                  <span>🏆</span>
                  One Week Strong
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestCelebration('streak_reached', 30)}
                  className="flex items-center gap-2"
                >
                  <span>👑</span>
                  30-Day Champion
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestCelebration('perfect_day', 1)}
                  className="flex items-center gap-2"
                >
                  <span>⭐</span>
                  Perfect Day
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestCelebration('challenge_completed', 1)}
                  className="flex items-center gap-2"
                >
                  <span>🏅</span>
                  Challenge Complete
                </Button>
              </div>

              {/* Celebration Types */}
              <div className="space-y-4">
                <h4 className="font-semibold">Celebration Types</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="p-4">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <span>🎯</span>
                      Milestone Celebrations
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Major achievements like streak milestones, perfect days, and habit formations.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <span>✨</span>
                      Progress Celebrations
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Daily wins, consistency rewards, and incremental progress recognition.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <span>🏆</span>
                      Achievement Unlocks
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Special badges, titles, and rewards for reaching significant milestones.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <span>🎊</span>
                      Community Celebrations
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Challenge completions, community milestones, and social achievements.
                    </p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                    Achievement System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-xs sm:text-sm">
                    The achievement system integrates with your existing achievements modal and provides additional social recognition features.
                  </p>
                  <div className="text-center py-6 sm:py-8">
                    <Trophy className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-yellow-500" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Achievement system is integrated!</h3>
                    <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">
                      Your achievements are already available through the main navigation.
                    </p>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      View Achievements
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

      {/* Celebration Components */}
      {CelebrationComponent}
      
      {/* Toast Celebrations */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toastCelebrations.map((toast) => (
          <div key={toast.id} className="animate-in slide-in-from-right-2 duration-300">
            {/* Toast content would go here */}
          </div>
        ))}
      </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-3 sm:pt-4 border-t">
          <p>💪 Stay motivated and celebrate every step of your journey!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}