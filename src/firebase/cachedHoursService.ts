import { db } from './config';
import { 
  doc, 
  onSnapshot, 
  Timestamp,
  type Unsubscribe
} from 'firebase/firestore';

export interface HoursDay {
  day: string;
  isOpen: boolean;
  hours: string;
}

export interface HoursData {
  days: HoursDay[];
  lastUpdated?: Timestamp;
}

export interface HoursCacheStats {
  lastUpdated: Date;
  isOnline: boolean;
  hasInitialData: boolean;
}

// Event types for cache updates
export type HoursCacheEventType = 'modified' | 'initial_load' | 'error';

export interface HoursCacheEvent {
  type: HoursCacheEventType;
  hoursData?: HoursData;
  error?: Error;
  stats: HoursCacheStats;
}

export type HoursCacheEventCallback = (event: HoursCacheEvent) => void;

/**
 * Efficient cached hours service using Firestore real-time listeners
 * Implements cost-effective caching with offline persistence for business hours
 */
class CachedHoursService {
  private hoursData: HoursData | null = null;
  private listeners: Set<HoursCacheEventCallback> = new Set();
  private unsubscribeFn: Unsubscribe | null = null;
  private lastUpdated = new Date();
  private hasInitialData = false;

  constructor() {
    this.initializeListener();
  }

  /**
   * Initialize the real-time listener for hours
   */
  private initializeListener(): void {
    if (this.unsubscribeFn) {
      console.warn('Hours listener already initialized');
      return;
    }

    try {
      const hoursDocRef = doc(db, 'businessInfo', 'hours');

      console.log('🔄 Initializing real-time hours listener...');

      this.unsubscribeFn = onSnapshot(
        hoursDocRef,
        {
          includeMetadataChanges: true
        },
        (docSnapshot) => {
          this.handleDocumentUpdate(docSnapshot);
        },
        (error) => {
          console.error('❌ Hours listener error:', error);
          this.notifyListeners({
            type: 'error',
            error,
            stats: this.getStats()
          });
        }
      );

      console.log('✅ Hours real-time listener initialized');
    } catch (error) {
      console.error('❌ Failed to initialize hours listener:', error);
      this.notifyListeners({
        type: 'error',
        error: error as Error,
        stats: this.getStats()
      });
    }
  }

  /**
   * Handle document updates from Firestore
   */
  private handleDocumentUpdate(docSnapshot: import('firebase/firestore').DocumentSnapshot): void {
    const source = docSnapshot.metadata.fromCache ? 'local cache' : 'server';
    
    // Previously tracked reads here
    
    console.log(`📡 Received hours update from ${source}`);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as HoursData;
      this.hoursData = data;
      this.lastUpdated = new Date();

      if (!this.hasInitialData) {
        this.hasInitialData = true;
        console.log(`✅ Initial hours data loaded from ${source}`);
        
        this.notifyListeners({
          type: 'initial_load',
          hoursData: data,
          stats: this.getStats()
        });
      } else {
        console.log(`✏️ Hours data updated from ${source}`);
        this.notifyListeners({
          type: 'modified',
          hoursData: data,
          stats: this.getStats()
        });
      }
    } else {
      // Document doesn't exist, use default hours
      console.log('⚠️ Hours document not found, using default hours');
      this.setDefaultHours();
    }
  }

  /**
   * Set default hours if no data exists in Firestore
   */
  private setDefaultHours(): void {
    const defaultHours: HoursData = {
      days: [
        { day: 'Monday', isOpen: false, hours: 'Closed' },
        { day: 'Tuesday', isOpen: true, hours: '11:30 AM - 8:00 PM' },
        { day: 'Wednesday', isOpen: true, hours: '11:30 AM - 8:00 PM' },
        { day: 'Thursday', isOpen: true, hours: '11:30 AM - 8:00 PM' },
        { day: 'Friday', isOpen: true, hours: '11:30 AM - 9:00 PM' },
        { day: 'Saturday', isOpen: true, hours: '11:30 AM - 9:00 PM' },
        { day: 'Sunday', isOpen: true, hours: '11:30 AM - 9:00 PM' },
      ]
    };

    this.hoursData = defaultHours;
    this.lastUpdated = new Date();
    this.hasInitialData = true;

    this.notifyListeners({
      type: 'initial_load',
      hoursData: defaultHours,
      stats: this.getStats()
    });
  }

  /**
   * Subscribe to cache events
   */
  subscribe(callback: HoursCacheEventCallback): () => void {
    this.listeners.add(callback);

    // If we already have initial data, notify immediately
    if (this.hasInitialData && this.hoursData) {
      callback({
        type: 'initial_load',
        hoursData: this.hoursData,
        stats: this.getStats()
      });
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of cache events
   */
  private notifyListeners(event: HoursCacheEvent): void {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in hours cache event callback:', error);
      }
    });
  }

  /**
   * Get hours data from cache
   */
  getHoursData(): HoursData | null {
    return this.hoursData;
  }

  /**
   * Get today's hours
   */
  getTodaysHours(): HoursDay | null {
    if (!this.hoursData) return null;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    return this.hoursData.days.find(day => day.day === today) || null;
  }

  /**
   * Check if currently open
   */
  isCurrentlyOpen(): boolean {
    const todaysHours = this.getTodaysHours();
    if (!todaysHours || !todaysHours.isOpen) return false;

    // Simple check - would need more complex logic for actual time checking
    const now = new Date();
    const currentHour = now.getHours();
    
    // Basic assumption: open between 11:30 AM (11.5) and closing time
    // This is a simplified check - real implementation would parse the hours string
    return currentHour >= 11 && currentHour <= 21; // Roughly 11 AM to 9 PM
  }

  /**
   * Get cache statistics
   */
  getStats(): HoursCacheStats {
    return {
      lastUpdated: this.lastUpdated,
      isOnline: navigator.onLine,
      hasInitialData: this.hasInitialData
    };
  }

  /**
   * Check if the cache has been initialized
   */
  isReady(): boolean {
    return this.hasInitialData;
  }

  /**
   * Force refresh data (rarely needed due to real-time updates)
   */
  refresh(): void {
    console.log('🔄 Hours cache refresh requested (real-time listener handles updates automatically)');
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
      this.unsubscribeFn = null;
      console.log('🔌 Hours real-time listener disconnected');
    }
    
    this.listeners.clear();
    this.hoursData = null;
    this.hasInitialData = false;
  }
}

// Export singleton instance
export const cachedHoursService = new CachedHoursService();
