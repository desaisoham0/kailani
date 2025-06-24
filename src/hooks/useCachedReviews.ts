import { useState, useEffect } from 'react';
import { cachedReviewService, type Review, type ReviewStats, type ReviewCacheEvent, type ReviewCacheStats } from '../firebase/cachedReviewService';

export interface UseCachedReviewsResult {
  reviews: Review[];
  reviewStats: ReviewStats;
  isLoading: boolean;
  error: Error | null;
  stats: ReviewCacheStats;
  refresh: () => void;
}

/**
 * React hook for accessing cached reviews with real-time updates
 * Uses efficient Firestore listeners with offline persistence
 */
export default function useCachedReviews(): UseCachedReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<ReviewCacheStats>({
    totalReviews: 0,
    lastUpdated: new Date(),
    isOnline: navigator.onLine,
    hasInitialData: false
  });

  useEffect(() => {
    console.log('🪝 useCachedReviews: Setting up cache subscription');
    
    // Define the handler inside useEffect to avoid dependency issues
    const handleCacheEvent = (event: ReviewCacheEvent) => {
      setStats(event.stats);

      switch (event.type) {
        case 'initial_load':
          if (event.reviews) {
            setReviews(event.reviews);
            setIsLoading(false);
            setError(null);
            console.log(`🎯 Reviews Hook: Initial load complete with ${event.reviews.length} reviews`);
          }
          break;

        case 'added':
        case 'modified':
        case 'removed':
          // Refresh data from cache after any change
          setReviews(cachedReviewService.getAllReviews());
          setError(null);
          console.log(`🔄 Reviews Hook: Updated after ${event.type} event`);
          break;

        case 'error':
          if (event.error) {
            setError(event.error);
            console.error('🚨 Reviews Hook: Cache error:', event.error);
          }
          // Don't set loading to false on error if we don't have initial data yet
          if (event.stats.hasInitialData) {
            setIsLoading(false);
          }
          break;
      }
    };
    
    // Subscribe to cache events
    const unsubscribe = cachedReviewService.subscribe(handleCacheEvent);

    // If cache already has data, use it immediately
    if (cachedReviewService.isReady()) {
      const cachedReviews = cachedReviewService.getAllReviews();
      setReviews(cachedReviews);
      setIsLoading(false);
      setStats(cachedReviewService.getStats());
      console.log(`⚡ Reviews Hook: Using existing cache data (${cachedReviews.length} reviews)`);
    }

    // Cleanup subscription on unmount
    return () => {
      console.log('🪝 useCachedReviews: Cleaning up cache subscription');
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

  // Get review stats from cached service
  const reviewStats = cachedReviewService.getReviewStats();

  const refresh = () => {
    cachedReviewService.refresh();
  };

  return {
    reviews,
    reviewStats,
    isLoading,
    error,
    stats,
    refresh
  };
}
