'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { 
  getCelebrationTrigger, 
  getRandomEncouragement,
  ANIMATION_CONFIG 
} from '@/lib/constants/celebrations';
import type { CelebrationTrigger } from '@/lib/constants/celebrations';

interface CelebrationDisplayProps {
  eventType: string;
  value: number;
  onComplete?: () => void;
  className?: string;
}

export function CelebrationDisplay({ 
  eventType, 
  value, 
  onComplete,
  className 
}: CelebrationDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [trigger, setTrigger] = useState<CelebrationTrigger | null>(null);
  const [encouragement, setEncouragement] = useState<string>('');

  useEffect(() => {
    const celebrationTrigger = getCelebrationTrigger(eventType, value);
    if (celebrationTrigger) {
      setTrigger(celebrationTrigger);
      setEncouragement(getRandomEncouragement(celebrationTrigger));
      setIsVisible(true);

      // Auto-hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete?.();
        }, 500); // Allow fade-out animation
      }, celebrationTrigger.duration);

      return () => clearTimeout(timer);
    }
  }, [eventType, value, onComplete]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 500);
  };

  if (!trigger || !isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className={`relative max-w-md w-full mx-auto transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${className}`}>
          {/* Animation Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <AnimationElements trigger={trigger} />
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 h-8 w-8 p-0 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>

          <CardContent className="relative z-10 p-8 text-center">
            {/* Main Emoji */}
            <div className={`text-6xl mb-4 animate-bounce`}>
              {trigger.message.emoji}
            </div>

            {/* Primary Message */}
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: trigger.message.color }}
            >
              {trigger.message.primary}
            </h2>

            {/* Secondary Message */}
            {trigger.message.secondary && (
              <p className="text-lg text-muted-foreground mb-4">
                {trigger.message.secondary}
              </p>
            )}

            {/* Encouragement */}
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-6">
              {encouragement}
            </p>

            {/* Continue Button */}
            <Button 
              onClick={handleClose}
              className="w-full"
              style={{ backgroundColor: trigger.message.color }}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

interface AnimationElementsProps {
  trigger: CelebrationTrigger;
}

function AnimationElements({ trigger }: AnimationElementsProps) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      const particleCount = getParticleCount(trigger.animation.intensity);
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          emoji: trigger.animation.elements[Math.floor(Math.random() * trigger.animation.elements.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 2 + Math.random() * 3,
          scale: 0.5 + Math.random() * 0.5
        });
      }
      
      setParticles(newParticles);
    };

    createParticles();
  }, [trigger]);

  const getParticleCount = (intensity: string) => {
    switch (intensity) {
      case 'subtle': return 8;
      case 'medium': return 15;
      case 'intense': return 25;
      case 'epic': return 40;
      default: return 15;
    }
  };

  const getAnimationClass = (type: string) => {
    switch (type) {
      case 'confetti':
        return 'animate-confetti';
      case 'fireworks':
        return 'animate-fireworks';
      case 'sparkles':
        return 'animate-sparkles';
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      case 'glow':
        return 'animate-glow';
      default:
        return 'animate-float';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute text-lg select-none ${getAnimationClass(trigger.animation.type)}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            transform: `scale(${particle.scale})`
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
}

// Hook for easy celebration triggering
export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    eventType: string;
    value: number;
  } | null>(null);

  const triggerCelebration = (eventType: string, value: number) => {
    const trigger = getCelebrationTrigger(eventType, value);
    if (trigger) {
      setCelebration({ eventType, value });
    }
  };

  const clearCelebration = () => {
    setCelebration(null);
  };

  return {
    celebration,
    triggerCelebration,
    clearCelebration,
    CelebrationComponent: celebration ? (
      <CelebrationDisplay
        eventType={celebration.eventType}
        value={celebration.value}
        onComplete={clearCelebration}
      />
    ) : null
  };
}

// Compact celebration for in-line use
export function MiniCelebration({ 
  emoji, 
  message, 
  color = '#10B981' 
}: {
  emoji: string;
  message: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg animate-in slide-in-from-top-2 duration-300">
      <span className="text-xl animate-bounce">{emoji}</span>
      <span className="text-sm font-medium" style={{ color }}>
        {message}
      </span>
    </div>
  );
}

// Toast-style celebration
export function CelebrationToast({ 
  trigger, 
  onClose 
}: { 
  trigger: CelebrationTrigger; 
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, trigger.duration);

    return () => clearTimeout(timer);
  }, [trigger.duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <Card className="max-w-sm shadow-lg border-l-4" style={{ borderLeftColor: trigger.message.color }}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{trigger.message.emoji}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-sm" style={{ color: trigger.message.color }}>
                {trigger.message.primary}
              </h4>
              {trigger.message.secondary && (
                <p className="text-xs text-muted-foreground mt-1">
                  {trigger.message.secondary}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}