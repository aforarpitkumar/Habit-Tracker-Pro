/**
 * Background Sync Service for PWA
 * Handles offline data synchronization and background sync
 */

// Extend ServiceWorkerRegistration interface for background sync
declare global {
  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }
}

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// Helper function to generate a random ID (fallback for crypto.randomUUID)
const generateRandomId = (): string => {
  if (isBrowser && typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface SyncData {
  type: 'habit' | 'completion' | 'settings';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  id: string;
}

class SyncService {
  private syncQueue: SyncData[] = [];
  private isOnline = false;
  private syncInProgress = false;
  private onlineHandler: (() => void) | null = null;
  private offlineHandler: (() => void) | null = null;

  constructor() {
    // Only initialize in browser environment
    if (isBrowser) {
      this.isOnline = typeof navigator !== 'undefined' && navigator.onLine ? navigator.onLine : false;
      this.setupEventListeners();
      this.loadSyncQueue();
    }
  }

  /**
   * Setup online/offline event listeners
   */
  private setupEventListeners() {
    // Only setup event listeners in browser environment
    if (!isBrowser) return;

    // Clean up any existing listeners
    this.removeEventListeners();

    this.onlineHandler = () => {
      console.log('🌐 Back online - starting sync');
      this.isOnline = true;
      this.processSyncQueue();
    };

    this.offlineHandler = () => {
      console.log('📱 Gone offline - queueing changes');
      this.isOnline = false;
    };

    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);

    // Register service worker for background sync
    if (isBrowser && typeof navigator !== 'undefined' && 'serviceWorker' in navigator && typeof window !== 'undefined' && 'sync' in (window.ServiceWorkerRegistration?.prototype || {})) {
      this.registerBackgroundSync().catch(error => {
        console.warn('⚠️ Background sync registration failed:', error);
      });
    }
  }

  /**
   * Remove event listeners (cleanup)
   */
  private removeEventListeners() {
    // Only remove event listeners in browser environment
    if (!isBrowser) return;

    if (this.onlineHandler) {
      window.removeEventListener('online', this.onlineHandler);
      this.onlineHandler = null;
    }
    if (this.offlineHandler) {
      window.removeEventListener('offline', this.offlineHandler);
      this.offlineHandler = null;
    }
  }

  /**
   * Register background sync with service worker
   */
  private async registerBackgroundSync() {
    // Only register background sync in browser environment
    if (!isBrowser) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration.sync) {
        await registration.sync.register('background-sync');
        console.log('✅ Background sync registered');
      } else {
        console.warn('⚠️ Background sync not supported');
      }
    } catch (error) {
      console.warn('⚠️ Background sync registration failed:', error);
    }
  }

  /**
   * Add data to sync queue
   */
  addToSyncQueue(type: SyncData['type'], action: SyncData['action'], data: any) {
    // Only add to sync queue in browser environment
    if (!isBrowser) return;

    const syncItem: SyncData = {
      type,
      action,
      data,
      timestamp: Date.now(),
      id: generateRandomId(),
    };

    this.syncQueue.push(syncItem);
    this.saveSyncQueue();

    console.log(`📝 Added to sync queue: ${type} ${action}`, syncItem);

    // Try to sync immediately if online
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  /**
   * Process the sync queue
   */
  private async processSyncQueue() {
    // Only process sync queue in browser environment
    if (!isBrowser) return;

    if (this.syncInProgress || this.syncQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;
    console.log(`🔄 Processing sync queue (${this.syncQueue.length} items)`);

    const failedItems: SyncData[] = [];

    for (const item of this.syncQueue) {
      try {
        await this.syncItem(item);
        console.log(`✅ Synced: ${item.type} ${item.action}`);
      } catch (error) {
        console.error(`❌ Failed to sync: ${item.type} ${item.action}`, error);
        failedItems.push(item);
      }
    }

    // Keep failed items for retry
    this.syncQueue = failedItems;
    this.saveSyncQueue();
    this.syncInProgress = false;

    // Notify UI about sync completion
    this.notifyUI('syncComplete', { 
      processed: this.syncQueue.length + failedItems.length,
      failed: failedItems.length 
    });
  }

  /**
   * Sync a single item
   */
  private async syncItem(item: SyncData): Promise<void> {
    // Only sync items in browser environment
    if (!isBrowser) return;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Here you would make actual API calls to your backend
    // For now, we'll just simulate success
    switch (item.type) {
      case 'habit':
        await this.syncHabit(item);
        break;
      case 'completion':
        await this.syncCompletion(item);
        break;
      case 'settings':
        await this.syncSettings(item);
        break;
    }
  }

  /**
   * Sync habit data
   */
  private async syncHabit(item: SyncData): Promise<void> {
    // Only sync habits in browser environment
    if (!isBrowser) return;

    // Simulate habit sync
    console.log(`🎯 Syncing habit: ${item.action}`, item.data);
    // In a real app, you'd make API calls here
  }

  /**
   * Sync completion data
   */
  private async syncCompletion(item: SyncData): Promise<void> {
    // Only sync completions in browser environment
    if (!isBrowser) return;

    // Simulate completion sync
    console.log(`✅ Syncing completion: ${item.action}`, item.data);
    // In a real app, you'd make API calls here
  }

  /**
   * Sync settings data
   */
  private async syncSettings(item: SyncData): Promise<void> {
    // Only sync settings in browser environment
    if (!isBrowser) return;

    // Simulate settings sync
    console.log(`⚙️ Syncing settings: ${item.action}`, item.data);
    // In a real app, you'd make API calls here
  }

  /**
   * Load sync queue from localStorage
   */
  private loadSyncQueue() {
    // Only load sync queue in browser environment
    if (!isBrowser) return;

    try {
      const stored = localStorage.getItem('syncQueue');
      if (stored) {
        this.syncQueue = JSON.parse(stored);
        console.log(`📂 Loaded ${this.syncQueue.length} items from sync queue`);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  /**
   * Save sync queue to localStorage
   */
  private saveSyncQueue() {
    // Only save sync queue in browser environment
    if (!isBrowser) return;

    try {
      localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  /**
   * Notify UI about sync events
   */
  private notifyUI(event: string, data: any) {
    // Only notify UI in browser environment
    if (!isBrowser) return;

    window.dispatchEvent(new CustomEvent('syncEvent', {
      detail: { event, data }
    }));
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      queueLength: this.syncQueue.length,
      syncInProgress: this.syncInProgress,
    };
  }

  /**
   * Force sync (manual trigger)
   */
  async forceSync() {
    // Only force sync in browser environment
    if (!isBrowser) return;

    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    await this.processSyncQueue();
  }

  /**
   * Clear sync queue (for testing)
   */
  clearSyncQueue() {
    // Only clear sync queue in browser environment
    if (!isBrowser) return;

    this.syncQueue = [];
    this.saveSyncQueue();
    console.log('🗑️ Sync queue cleared');
  }

  /**
   * Cleanup resources (for proper shutdown)
   */
  cleanup() {
    // Only cleanup in browser environment
    if (!isBrowser) return;

    this.removeEventListeners();
    console.log('🧹 Sync service cleaned up');
  }
}

// Export singleton instance
export const syncService = new SyncService();

// Export types
export type { SyncData };