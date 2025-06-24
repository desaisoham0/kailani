import { useState, useEffect } from 'react';
import { cachedHoursService, type HoursData, type HoursDay, type HoursCacheEvent, type HoursCacheStats } from '../firebase/cachedHoursService';
import { devLog } from '../utils/environment';

export interface UseCachedHoursResult {
  hoursData: HoursData | null;
  todaysHours: HoursDay | null;
  isCurrentlyOpen: boolean;
  isLoading: boolean;
  error: Error | null;
  stats: HoursCacheStats;
  refresh: () => void;
}

/**
 * React hook for accessing cached hours with real-time updates
 * Uses efficient Firestore listeners with offline persistence
 */
export default function useCachedHours(): UseCachedHoursResult {
  const [hoursData, setHoursData] = useState<HoursData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<HoursCacheStats>({
    lastUpdated: new Date(),
    isOnline: navigator.onLine,
    hasInitialData: false
  });

  useEffect(() => {
    devLog.log('🪝 useCachedHours: Setting up cache subscription');
    
    // Define the handler inside useEffect to avoid dependency issues
    const handleCacheEvent = (event: HoursCacheEvent) => {
      setStats(event.stats);

      switch (event.type) {
        case 'initial_load':
          if (event.hoursData) {
            setHoursData(event.hoursData);
            setIsLoading(false);
            setError(null);
            console.log('🎯 Hours Hook: Initial load complete');
          }
          break;

        case 'modified':
          // Refresh data from cache after any change
          if (event.hoursData) {
            setHoursData(event.hoursData);
            setError(null);
            console.log('🔄 Hours Hook: Updated after modification');
          }
          break;

        case 'error':
          if (event.error) {
            setError(event.error);
            console.error('🚨 Hours Hook: Cache error:', event.error);
          }
          // Don't set loading to false on error if we don't have initial data yet
          if (event.stats.hasInitialData) {
            setIsLoading(false);
          }
          break;
      }
    };
    
    // Subscribe to cache events
    const unsubscribe = cachedHoursService.subscribe(handleCacheEvent);

    // If cache already has data, use it immediately
    if (cachedHoursService.isReady()) {
      const cachedHours = cachedHoursService.getHoursData();
      setHoursData(cachedHours);
      setIsLoading(false);
      setStats(cachedHoursService.getStats());
      console.log('⚡ Hours Hook: Using existing cache data');
    }

    // Cleanup subscription on unmount
    return () => {
      console.log('🪝 useCachedHours: Cleaning up cache subscription');
      unsubscribe();
    };
  }, []); // Empty dependency array - this effect should only run once

  // Monitor online status
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setStats(prevStats => ({
        ...prevStats,
        isOnline: navigator.onLine
      }));
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Get derived data from cached service
  const todaysHours = cachedHoursService.getTodaysHours();
  const isCurrentlyOpen = cachedHoursService.isCurrentlyOpen();

  const refresh = () => {
    cachedHoursService.refresh();
  };

  return {
    hoursData,
    todaysHours,
    isCurrentlyOpen,
    isLoading,
    error,
    stats,
    refresh
  };
}
