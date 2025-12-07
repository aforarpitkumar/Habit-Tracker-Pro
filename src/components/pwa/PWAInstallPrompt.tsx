'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone, Laptop } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const daysSinceDismissed = lastDismissed ? 
        (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : 999;
      
      if (daysSinceDismissed > 7) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="w-5 h-5" />
            Install App
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          Install for offline access and better performance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Button onClick={handleInstall} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Install Now
        </Button>
      </CardContent>
    </Card>
  );
}