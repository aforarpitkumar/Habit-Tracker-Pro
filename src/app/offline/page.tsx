'use client';

import React from 'react';
import { Target, Wifi, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Icon */}
        <div className="mb-6">
          <div className="relative">
            <Target className="w-16 h-16 mx-auto text-primary mb-4" />
            <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
              <Wifi className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">You're offline</h1>
        
        {/* Description */}
        <p className="text-muted-foreground mb-6">
          Don't worry! Your habits are still accessible. You can continue tracking 
          and your data will sync when you're back online.
        </p>

        {/* Features available offline */}
        <div className="bg-muted rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold mb-2">Available offline:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Mark habits as completed</li>
            <li>• View your habit grids</li>
            <li>• Check your streaks</li>
            <li>• Create new habits</li>
            <li>• View analytics</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={handleRetry} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button variant="outline" onClick={handleGoBack} className="w-full">
            Go Back
          </Button>
        </div>

        {/* Additional info */}
        <p className="text-xs text-muted-foreground mt-4">
          Your data is stored locally and will automatically sync when connectivity is restored.
        </p>
      </div>
    </div>
  );
}