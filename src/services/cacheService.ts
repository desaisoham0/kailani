import { FirebaseError } from 'firebase/app';

interface CacheConfig {
  key: string;
  expiration: number; // in milliseconds
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * A utility service for caching data and handling Firebase interactions
 * with performance optimizations.
 */
export const cacheService = {
  /**
   * Stores data in localStorage with an expiration timestamp
   */
  set<T>(config: CacheConfig, data: T): void {
    try {
      const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(config.key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn(`Failed to cache data for key ${config.key}:`, error);
    }
  },

  /**
   * Retrieves data from localStorage if it exists and hasn't expired
   */
  get<T>(config: CacheConfig): T | null {
    try {
      const cachedString = localStorage.getItem(config.key);
      
      if (!cachedString) {
        return null;
      }

      const cacheEntry = JSON.parse(cachedString) as CacheEntry<T>;
      const now = Date.now();
      
      // Check if cache is expired
      if (now - cacheEntry.timestamp > config.expiration) {
        return null;
      }
      
      return cacheEntry.data;
    } catch (error) {
      console.warn(`Failed to retrieve cached data for key ${config.key}:`, error);
      return null;
    }
  },

  /**
   * Retrieves data from localStorage even if it's expired
   * Used as a fallback when network requests fail
   */
  getStale<T>(config: CacheConfig): T | null {
    try {
      const cachedString = localStorage.getItem(config.key);
      
      if (!cachedString) {
        return null;
      }

      const cacheEntry = JSON.parse(cachedString) as CacheEntry<T>;
      return cacheEntry.data;
    } catch (error) {
      console.warn(`Failed to retrieve stale cached data for key ${config.key}:`, error);
      return null;
    }
  },

  /**
   * Removes cached data for a specific key
   */
  remove(config: CacheConfig): void {
    try {
      localStorage.removeItem(config.key);
    } catch (error) {
      console.warn(`Failed to remove cached data for key ${config.key}:`, error);
    }
  },

  /**
   * Fetches data using the provided fetcher function,
   * with caching and fallback to stale data
   */
  async fetchWithCache<T>(
    config: CacheConfig,
    fetcher: () => Promise<T>
  ): Promise<{ data: T; fromCache: boolean }> {
    // First, try to get data from cache
    const cachedData = this.get<T>(config);
    
    if (cachedData) {
      // Return cached data immediately
      return { data: cachedData, fromCache: true };
    }
    
    try {
      // Fetch fresh data
      const freshData = await fetcher();
      
      // Cache the fresh data
      this.set(config, freshData);
      
      // Return the fresh data
      return { data: freshData, fromCache: false };
    } catch (error) {
      // If the request fails, try to use stale data as fallback
      const staleData = this.getStale<T>(config);
      
      if (staleData) {
        console.warn(`Using stale data for ${config.key} due to fetch error:`, error);
        return { data: staleData, fromCache: true };
      }
      
      // If we don't have stale data either, rethrow the error
      throw error;
    }
  },

  /**
   * Handles Firebase errors with appropriate messaging and logging
   */
  handleFirebaseError(error: unknown): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'permission-denied':
          return 'You don\'t have permission to access this data.';
        case 'resource-exhausted':
          return 'Unable to fetch data due to quota limits. Please try again later.';
        case 'unavailable':
          return 'Service temporarily unavailable. Please try again later.';
        default:
          console.error('Firebase error:', error);
          return `Error: ${error.message}`;
      }
    } else if (error instanceof Error) {
      console.error('Application error:', error);
      return `Error: ${error.message}`;
    } else {
      console.error('Unknown error:', error);
      return 'An unknown error occurred. Please try again later.';
    }
  }
};

// Common cache configurations
export const CACHE_CONFIGS = {
  CURRENT_OFFERS: {
    key: 'kailani_current_offers',
    expiration: 60 * 60 * 1000, // 1 hour
  },
  UPCOMING_OFFERS: {
    key: 'kailani_upcoming_offers',
    expiration: 60 * 60 * 1000, // 1 hour
  },
  FOOD_ITEMS: {
    key: 'kailani_food_items',
    expiration: 60 * 60 * 1000, // 1 hour
  },
  FAVORITE_FOOD_ITEMS: {
    key: 'kailani_favorite_food_items',
    expiration: 60 * 60 * 1000, // 1 hour
  },
  HOURS_OF_OPERATION: {
    key: 'kailani_hours',
    expiration: 24 * 60 * 60 * 1000, // 24 hours
  },
  REVIEWS: {
    key: 'kailani_reviews',
    expiration: 3 * 60 * 60 * 1000, // 3 hours
  },
};

export default cacheService;
