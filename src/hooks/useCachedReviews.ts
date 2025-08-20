import { useState, useEffect, useCallback, useMemo } from 'react';
import { cachedReviewsService } from '../firebase/cachedReviewsService';
import type { Review, ReviewStats } from '../firebase/reviewService';

/**
 * Hook to use cached reviews with real-time updates
 */
export const useCachedReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = cachedReviewsService.subscribeToReviews(newReviews => {
      setReviews(newReviews);
      setIsLoading(false);
      setError(null);
    });

    // Check initial loading state
    const loadingState = cachedReviewsService.getLoadingState();
    if (loadingState.reviews.hasError) {
      setError(loadingState.reviews.error || 'Unknown error');
      setIsLoading(false);
    }

    return unsubscribe;
  }, []);

  const getReviewsByRating = useCallback(
    (minRating: number, maxRating = 5) =>
      reviews.filter(
        review => review.rating >= minRating && review.rating <= maxRating
      ),
    [reviews]
  );

  const getRecentReviews = useCallback(
    (count = 5) => reviews.slice(0, count),
    [reviews]
  );

  const searchReviews = useCallback(
    (searchTerm: string) => {
      const term = searchTerm.toLowerCase();
      return reviews.filter(
        review =>
          review.text.toLowerCase().includes(term) ||
          review.author.toLowerCase().includes(term)
      );
    },
    [reviews]
  );

  const refresh = useCallback(() => cachedReviewsService.refresh(), []);

  const stats = useMemo(() => cachedReviewsService.getCacheStats(), []);

  return {
    reviews,
    isLoading,
    error,
    getReviewsByRating,
    getRecentReviews,
    searchReviews,
    refresh,
    stats,
  };
};

/**
 * Hook to use cached review statistics with real-time updates
 */
export const useCachedReviewStats = () => {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = cachedReviewsService.subscribeToStats(newStats => {
      setStats(newStats);
      setIsLoading(false);
      setError(null);
    });

    // Check initial loading state
    const loadingState = cachedReviewsService.getLoadingState();
    if (loadingState.stats.hasError) {
      setError(loadingState.stats.error || 'Unknown error');
      setIsLoading(false);
    }

    return unsubscribe;
  }, []);

  const refresh = useCallback(() => cachedReviewsService.refresh(), []);

  return {
    stats,
    isLoading,
    error,
    refresh,
  };
};
