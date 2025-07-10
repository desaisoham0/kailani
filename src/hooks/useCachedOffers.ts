import { useState, useEffect } from 'react';
import {
  cachedOfferService,
  type Offer,
  type OfferCacheEvent,
  type OfferCacheStats,
} from '../firebase/cachedOfferService';

export interface UseCachedOffersResult {
  allOffers: Offer[];
  currentOffers: Offer[];
  upcomingOffers: Offer[];
  isLoading: boolean;
  error: Error | null;
  stats: OfferCacheStats;
  refresh: () => void;
}

/**
 * React hook for accessing cached offers with real-time updates
 * Uses efficient Firestore listeners with offline persistence
 */
export default function useCachedOffers(): UseCachedOffersResult {
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<OfferCacheStats>({
    totalOffers: 0,
    currentOffers: 0,
    upcomingOffers: 0,
    lastUpdated: new Date(),
    isOnline: navigator.onLine,
    hasInitialData: false,
  });

  useEffect(() => {
    console.log('🪝 useCachedOffers: Setting up cache subscription');

    // Define the handler inside useEffect to avoid dependency issues
    const handleCacheEvent = (event: OfferCacheEvent) => {
      setStats(event.stats);

      switch (event.type) {
        case 'initial_load':
          if (event.offers) {
            setAllOffers(event.offers);
            setIsLoading(false);
            setError(null);
            console.log(
              `🎯 Offers Hook: Initial load complete with ${event.offers.length} offers`
            );
          }
          break;

        case 'added':
        case 'modified':
        case 'removed':
          // Refresh data from cache after any change
          setAllOffers(cachedOfferService.getAllOffers());
          setError(null);
          console.log(`🔄 Offers Hook: Updated after ${event.type} event`);
          break;

        case 'error':
          if (event.error) {
            setError(event.error);
            console.error('🚨 Offers Hook: Cache error:', event.error);
          }
          // Don't set loading to false on error if we don't have initial data yet
          if (event.stats.hasInitialData) {
            setIsLoading(false);
          }
          break;
      }
    };

    // Subscribe to cache events
    const unsubscribe = cachedOfferService.subscribe(handleCacheEvent);

    // If cache already has data, use it immediately
    if (cachedOfferService.isReady()) {
      const cachedOffers = cachedOfferService.getAllOffers();
      setAllOffers(cachedOffers);
      setIsLoading(false);
      setStats(cachedOfferService.getStats());
      console.log(
        `⚡ Offers Hook: Using existing cache data (${cachedOffers.length} offers)`
      );
    }

    // Cleanup subscription on unmount
    return () => {
      console.log('🪝 useCachedOffers: Cleaning up cache subscription');
      unsubscribe();
    };
  }, []); // Empty dependency array - this effect should only run once

  // Monitor online status
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setStats(prevStats => ({
        ...prevStats,
        isOnline: navigator.onLine,
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
  const currentOffers = cachedOfferService.getCurrentOffers();
  const upcomingOffers = cachedOfferService.getUpcomingOffers();

  const refresh = () => {
    cachedOfferService.refresh();
  };

  return {
    allOffers,
    currentOffers,
    upcomingOffers,
    isLoading,
    error,
    stats,
    refresh,
  };
}
