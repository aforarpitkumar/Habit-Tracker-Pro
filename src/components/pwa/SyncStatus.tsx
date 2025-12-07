'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { syncService } from '@/lib/services/syncService';

export function SyncStatus() {
  const [syncStatus, setSyncStatus] = useState(syncService.getSyncStatus());
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      setSyncStatus(syncService.getSyncStatus());
    };

    const handleSyncEvent = (event: CustomEvent) => {
      updateStatus();
      if (event.detail.event === 'syncComplete') {
        setLastSync(new Date());
      }
    };

    // Update status periodically
    const interval = setInterval(updateStatus, 1000);
    
    // Listen for sync events
    window.addEventListener('syncEvent', handleSyncEvent as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('syncEvent', handleSyncEvent as EventListener);
    };
  }, []);

  const handleForceSync = async () => {
    try {
      await syncService.forceSync();
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  };

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff className="w-3 h-3" />;
    }
    
    if (syncStatus.syncInProgress) {
      return <RefreshCw className="w-3 h-3 animate-spin" />;
    }
    
    return syncStatus.queueLength > 0 ? 
      <CloudOff className="w-3 h-3" /> : 
      <Cloud className="w-3 h-3" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return 'Offline';
    }
    
    if (syncStatus.syncInProgress) {
      return 'Syncing...';
    }
    
    if (syncStatus.queueLength > 0) {
      return `${syncStatus.queueLength} pending`;
    }
    
    return 'Synced';
  };

  const getStatusVariant = () => {
    if (!syncStatus.isOnline) return 'destructive';
    if (syncStatus.queueLength > 0) return 'secondary';
    return 'default';
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusVariant()} className="flex items-center gap-1">
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>
      
      {syncStatus.isOnline && syncStatus.queueLength > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleForceSync}
          disabled={syncStatus.syncInProgress}
        >
          <RefreshCw className={`w-3 h-3 ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
        </Button>
      )}
      
      {lastSync && (
        <span className="text-xs text-muted-foreground">
          Last sync: {lastSync.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}