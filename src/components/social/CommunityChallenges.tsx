'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Target, Trophy, Clock, Star, ChevronRight } from 'lucide-react';
import {
  getActiveChallenges,
  getChallengesByCategory,
  getChallengesByDifficulty,
  getDaysRemaining,
  formatParticipants,
  calculateChallengeProgress
} from '@/lib/constants/communityChallenges';
import type { CommunityChallenge, UserChallengeProgress } from '@/lib/constants/communityChallenges';

interface CommunityChallengesProps {
  className?: string;
  showJoinedOnly?: boolean;
}

export function CommunityChallenges({ className, showJoinedOnly = false }: CommunityChallengesProps) {
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set());
  const [selectedChallenge, setSelectedChallenge] = useState<CommunityChallenge | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setChallenges(getActiveChallenges());
  }, []);

  const handleJoinChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => new Set([...prev, challengeId]));
  };

  const handleLeaveChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => {
      const newSet = new Set(prev);
      newSet.delete(challengeId);
      return newSet;
    });
  };

  const filteredChallenges = showJoinedOnly
    ? challenges.filter(c => joinedChallenges.has(c.id))
    : challenges;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weekly': return '📅';
      case 'monthly': return '🗓️';
      case 'seasonal': return '🌱';
      case 'special': return '⭐';
      default: return '🎯';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Community Challenges
          </h2>
          <p className="text-muted-foreground">
            Join others in building better habits together
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {formatParticipants(challenges.reduce((sum, c) => sum + c.participants, 0))} participants
        </Badge>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="joined">Joined</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ChallengeGrid 
            challenges={filteredChallenges}
            joinedChallenges={joinedChallenges}
            onJoin={handleJoinChallenge}
            onLeave={handleLeaveChallenge}
            onViewDetails={setSelectedChallenge}
          />
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <ChallengeGrid 
            challenges={getChallengesByCategory('weekly')}
            joinedChallenges={joinedChallenges}
            onJoin={handleJoinChallenge}
            onLeave={handleLeaveChallenge}
            onViewDetails={setSelectedChallenge}
          />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <ChallengeGrid 
            challenges={getChallengesByCategory('monthly')}
            joinedChallenges={joinedChallenges}
            onJoin={handleJoinChallenge}
            onLeave={handleLeaveChallenge}
            onViewDetails={setSelectedChallenge}
          />
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          <ChallengeGrid 
            challenges={challenges.filter(c => joinedChallenges.has(c.id))}
            joinedChallenges={joinedChallenges}
            onJoin={handleJoinChallenge}
            onLeave={handleLeaveChallenge}
            onViewDetails={setSelectedChallenge}
            showProgress={true}
          />
        </TabsContent>
      </Tabs>

      {/* Challenge Details Dialog */}
      {selectedChallenge && (
        <ChallengeDetailsDialog
          challenge={selectedChallenge}
          isJoined={joinedChallenges.has(selectedChallenge.id)}
          onJoin={() => handleJoinChallenge(selectedChallenge.id)}
          onLeave={() => handleLeaveChallenge(selectedChallenge.id)}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
}

interface ChallengeGridProps {
  challenges: CommunityChallenge[];
  joinedChallenges: Set<string>;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  onViewDetails: (challenge: CommunityChallenge) => void;
  showProgress?: boolean;
}

function ChallengeGrid({ 
  challenges, 
  joinedChallenges, 
  onJoin, 
  onLeave, 
  onViewDetails,
  showProgress = false
}: ChallengeGridProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="font-semibold mb-2">No challenges found</h3>
        <p className="text-muted-foreground">
          Check back later for new community challenges!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => {
        const isJoined = joinedChallenges.has(challenge.id);
        const daysLeft = getDaysRemaining(challenge);

        return (
          <Card key={challenge.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-3xl" />
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{challenge.icon}</span>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <Badge variant="outline">
                  {challenge.category}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">
                {challenge.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {challenge.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {challenge.target.description}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {daysLeft} days left
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {formatParticipants(challenge.participants)}
                  </span>
                </div>
              </div>

              {showProgress && isJoined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(challenge)}
                  className="flex-1"
                >
                  Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                
                {isJoined ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onLeave(challenge.id)}
                  >
                    Leave
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => onJoin(challenge.id)}
                  >
                    Join
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface ChallengeDetailsDialogProps {
  challenge: CommunityChallenge;
  isJoined: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onClose: () => void;
}

function ChallengeDetailsDialog({ 
  challenge, 
  isJoined, 
  onJoin, 
  onLeave, 
  onClose 
}: ChallengeDetailsDialogProps) {
  const daysLeft = getDaysRemaining(challenge);

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{challenge.icon}</span>
            {challenge.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {challenge.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{challenge.duration}</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="font-semibold">{daysLeft}</div>
              <div className="text-xs text-muted-foreground">Days Left</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="font-semibold">{formatParticipants(challenge.participants)}</div>
              <div className="text-xs text-muted-foreground">Participants</div>
            </div>
            <div className="text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="font-semibold">{challenge.rewards.length}</div>
              <div className="text-xs text-muted-foreground">Rewards</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Challenge Goal
            </h4>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{challenge.target.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Target: {challenge.target.value} {challenge.target.type}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Rewards
            </h4>
            <div className="space-y-2">
              {challenge.rewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <span className="text-2xl">
                    {reward.type === 'badge' ? '🏆' : reward.type === 'points' ? '⭐' : '👑'}
                  </span>
                  <div>
                    <div className="font-medium">{reward.value}</div>
                    <div className="text-sm text-muted-foreground">{reward.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {isJoined ? (
              <Button variant="destructive" onClick={onLeave} className="flex-1">
                Leave Challenge
              </Button>
            ) : (
              <Button onClick={onJoin} className="flex-1">
                Join Challenge
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}