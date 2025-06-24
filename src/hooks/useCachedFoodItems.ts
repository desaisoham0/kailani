import { useState, useEffect, useCallback, useMemo } from 'react';
import { cachedFoodService, type FoodItem, type CacheEvent, type CacheStats } from '../firebase/cachedFoodService';

export interface UseCachedFoodItemsResult {
  foodItems: FoodItem[];
  favoriteItems: FoodItem[];
  isLoading: boolean;
  error: Error | null;
  stats: CacheStats;
  getItemsByCategory: (category: string) => FoodItem[];
  getItemById: (id: string) => FoodItem | undefined;
  getAvailableCategories: () => string[];
  refresh: () => void;
}

/**
 * React hook for accessing cached food items with real-time updates
 * Uses efficient Firestore listeners with offline persistence
 */
export default function useCachedFoodItems(): UseCachedFoodItemsResult {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<CacheStats>({
    totalItems: 0,
    lastUpdated: new Date(),
    isOnline: navigator.onLine,
    hasInitialData: false
  });

  // Handle cache events with stable stats to prevent unnecessary re-renders

  useEffect(() => {
    console.log('🪝 useCachedFoodItems: Setting up cache subscription');
    
    // Define the handler inside useEffect to avoid dependency issues
    const handleCacheEvent = (event: CacheEvent) => {
      // Only update stats if they've actually changed significantly
      setStats(prevStats => {
        const newStats = event.stats;
        if (
          prevStats.totalItems !== newStats.totalItems ||
          prevStats.hasInitialData !== newStats.hasInitialData ||
          Math.abs(prevStats.lastUpdated.getTime() - newStats.lastUpdated.getTime()) > 1000 // Only update if more than 1 second difference
        ) {
          return newStats;
        }
        return prevStats;
      });

      switch (event.type) {
        case 'initial_load':
          if (event.items) {
            setFoodItems(event.items);
            setIsLoading(false);
            setError(null);
            console.log(`🎯 Hook: Initial load complete with ${event.items.length} items`);
          }
          break;

        case 'added':
        case 'modified':
        case 'removed':
          // Refresh data from cache after any change
          setFoodItems(cachedFoodService.getAllItems());
          setError(null);
          console.log(`🔄 Hook: Updated after ${event.type} event`);
          break;

        case 'error':
          if (event.error) {
            setError(event.error);
            console.error('🚨 Hook: Cache error:', event.error);
          }
          // Don't set loading to false on error if we don't have initial data yet
          if (event.stats.hasInitialData) {
            setIsLoading(false);
          }
          break;
      }
    };
    
    // Subscribe to cache events
    const unsubscribe = cachedFoodService.subscribe(handleCacheEvent);

    // If cache already has data, use it immediately
    if (cachedFoodService.isReady()) {
      const items = cachedFoodService.getAllItems();
      setFoodItems(items);
      setIsLoading(false);
      setStats(cachedFoodService.getStats());
      console.log(`⚡ Hook: Using existing cache data (${items.length} items)`);
    }

    // Cleanup subscription on unmount
    return () => {
      console.log('🪝 useCachedFoodItems: Cleaning up cache subscription');
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

  // Memoized derived data to prevent unnecessary re-renders
  const favoriteItems = useMemo(() => {
    return foodItems.filter(item => item.favorite);
  }, [foodItems]);

  // Utility functions that work with cached data
  const getItemsByCategory = useCallback((category: string) => {
    return cachedFoodService.getItemsByCategory(category);
  }, []);

  const getItemById = useCallback((id: string) => {
    return cachedFoodService.getItemById(id);
  }, []);

  const getAvailableCategories = useCallback(() => {
    return cachedFoodService.getAvailableCategories();
  }, []);

  const refresh = useCallback(() => {
    cachedFoodService.refresh();
  }, []);

  return {
    foodItems,
    favoriteItems,
    isLoading,
    error,
    stats,
    getItemsByCategory,
    getItemById,
    getAvailableCategories,
    refresh
  };
}
