import React, { useEffect, useState } from 'react';
import {
  cachedFoodService,
  type CacheStats,
} from '../firebase/cachedFoodService';
import { CacheContext, type CacheContextValue } from './cache.types';
import { useCache } from './cache.hooks';

interface CacheProviderProps {
  children: React.ReactNode;
}

/**
 * Context provider that manages the global food cache state
 * Ensures the cached service is properly initialized and provides status information
 */
export const CacheProvider: React.FC<CacheProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [stats, setStats] = useState<CacheStats>({
    totalItems: 0,
    lastUpdated: new Date(),
    isOnline: navigator.onLine,
    hasInitialData: false,
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('🏗️ CacheProvider: Initializing cache context');

    // Subscribe to cache events to monitor readiness
    const unsubscribe = cachedFoodService.subscribe(event => {
      setStats(event.stats);

      switch (event.type) {
        case 'initial_load':
          setIsReady(true);
          setError(null);
          console.log('✅ CacheProvider: Cache is ready');
          break;
        case 'error':
          if (event.error) {
            setError(event.error);
            console.error('❌ CacheProvider: Cache error:', event.error);
          }
          break;
        default:
          // For other events (added, modified, removed), just update stats
          setError(null);
          break;
      }
    });

    // Check if cache is already ready
    if (cachedFoodService.isReady()) {
      setIsReady(true);
      setStats(cachedFoodService.getStats());
      console.log('⚡ CacheProvider: Cache was already ready');
    }

    return () => {
      console.log('🧹 CacheProvider: Cleaning up cache context');
      unsubscribe();
    };
  }, []);

  const value: CacheContextValue = {
    isReady,
    stats,
    error,
  };

  return (
    <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
  );
};

/**
 * Component to display cache status for debugging
 */
export const CacheStatus: React.FC = () => {
  const { isReady, stats, error } = useCache();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="bg-opacity-80 fixed right-4 bottom-4 z-50 max-w-xs rounded-lg bg-black p-2 font-mono text-xs text-white">
      <div className="mb-1 font-bold">🗂️ Cache Status</div>
      <div>Ready: {isReady ? '✅' : '⏳'}</div>
      <div>Items: {stats.totalItems}</div>
      <div>Online: {stats.isOnline ? '🌐' : '📱'}</div>
      <div>Updated: {stats.lastUpdated.toLocaleTimeString()}</div>
      {error && <div className="mt-1 text-red-300">Error: {error.message}</div>}
    </div>
  );
};
