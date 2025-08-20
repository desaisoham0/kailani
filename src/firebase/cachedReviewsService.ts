import {
  onSnapshot,
  query,
  orderBy,
  collection,
  doc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { usageTracker } from '../utils/localUsageTracker';
import type { Review, ReviewStats } from './reviewService';

/**
 * Cached Reviews Service - Single real-time listener for reviews and stats
 */
class CachedReviewsService {
  private reviewsCache: Review[] = [];
  private statsCache: ReviewStats | null = null;
  private reviewsListeners: ((reviews: Review[]) => void)[] = [];
  private statsListeners: ((stats: ReviewStats) => void)[] = [];
  private reviewsUnsubscribe: Unsubscribe | null = null;
  private statsUnsubscribe: Unsubscribe | null = null;
  private reviewsInitialized = false;
  private statsInitialized = false;
  private isLoadingReviews = true;
  private isLoadingStats = true;
  private reviewsError: Error | null = null;
  private statsError: Error | null = null;

  /**
   * Initialize reviews listener
   */
  private initializeReviews() {
    if (this.reviewsInitialized) return;

    try {
      const reviewsCollection = collection(db, 'reviews');
      const q = query(reviewsCollection, orderBy('date', 'desc'));

      this.reviewsUnsubscribe = onSnapshot(
        q,
        snapshot => {
          usageTracker.trackRead(1, 'cached-reviews-listener');

          this.reviewsCache = snapshot.docs.map(
            doc =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as Review
          );

          this.isLoadingReviews = false;
          this.reviewsError = null;

          // Notify all reviews subscribers
          this.reviewsListeners.forEach(listener => {
            try {
              listener(this.reviewsCache);
            } catch (error) {
              console.error('Error in reviews cache subscriber:', error);
            }
          });

          console.log(
            `⭐ Reviews cache updated: ${this.reviewsCache.length} reviews`
          );
        },
        error => {
          console.error('Reviews cache listener error:', error);
          this.reviewsError = error;
          this.isLoadingReviews = false;

          this.reviewsListeners.forEach(listener => {
            try {
              listener([]);
            } catch (listenerError) {
              console.error(
                'Error in reviews cache error subscriber:',
                listenerError
              );
            }
          });
        }
      );

      this.reviewsInitialized = true;
      console.log('✅ Reviews cache listener initialized');
    } catch (error) {
      console.error('Failed to initialize reviews cache:', error);
      this.reviewsError =
        error instanceof Error ? error : new Error('Unknown error');
      this.isLoadingReviews = false;
    }
  }

  /**
   * Initialize stats listener
   */
  private initializeStats() {
    if (this.statsInitialized) return;

    try {
      const statsRef = doc(db, 'reviewStats', 'main');

      this.statsUnsubscribe = onSnapshot(
        statsRef,
        snapshot => {
          usageTracker.trackRead(1, 'cached-stats-listener');

          if (snapshot.exists()) {
            this.statsCache = snapshot.data() as ReviewStats;
          } else {
            // Default stats if document doesn't exist
            this.statsCache = {
              totalReviews: 0,
              averageRating: 0,
              lastUpdated: {
                seconds: Date.now() / 1000,
                nanoseconds: 0,
              } as unknown as import('firebase/firestore').Timestamp,
            };
          }

          this.isLoadingStats = false;
          this.statsError = null;

          // Notify all stats subscribers
          this.statsListeners.forEach(listener => {
            try {
              listener(this.statsCache!);
            } catch (error) {
              console.error('Error in stats cache subscriber:', error);
            }
          });

          console.log(`📊 Review stats cache updated:`, this.statsCache);
        },
        error => {
          console.error('Review stats cache listener error:', error);
          this.statsError = error;
          this.isLoadingStats = false;

          // Notify subscribers with default stats on error
          const defaultStats: ReviewStats = {
            totalReviews: 0,
            averageRating: 0,
            lastUpdated: {
              seconds: Date.now() / 1000,
              nanoseconds: 0,
            } as unknown as import('firebase/firestore').Timestamp,
          };

          this.statsListeners.forEach(listener => {
            try {
              listener(defaultStats);
            } catch (listenerError) {
              console.error(
                'Error in stats cache error subscriber:',
                listenerError
              );
            }
          });
        }
      );

      this.statsInitialized = true;
      console.log('✅ Review stats cache listener initialized');
    } catch (error) {
      console.error('Failed to initialize review stats cache:', error);
      this.statsError =
        error instanceof Error ? error : new Error('Unknown error');
      this.isLoadingStats = false;
    }
  }

  /**
   * Subscribe to reviews updates
   */
  subscribeToReviews(callback: (reviews: Review[]) => void): () => void {
    this.reviewsListeners.push(callback);

    if (!this.reviewsInitialized && !this.reviewsError) {
      this.initializeReviews();
    }

    if (!this.isLoadingReviews && this.reviewsCache.length >= 0) {
      setTimeout(() => callback(this.reviewsCache), 0);
    }

    return () => {
      this.reviewsListeners = this.reviewsListeners.filter(l => l !== callback);
      if (this.reviewsListeners.length === 0) {
        this.cleanupReviews();
      }
    };
  }

  /**
   * Subscribe to review stats updates
   */
  subscribeToStats(callback: (stats: ReviewStats) => void): () => void {
    this.statsListeners.push(callback);

    if (!this.statsInitialized && !this.statsError) {
      this.initializeStats();
    }

    if (!this.isLoadingStats && this.statsCache) {
      setTimeout(() => callback(this.statsCache!), 0);
    }

    return () => {
      this.statsListeners = this.statsListeners.filter(l => l !== callback);
      if (this.statsListeners.length === 0) {
        this.cleanupStats();
      }
    };
  }

  /**
   * Get all cached reviews (synchronous)
   */
  getAllReviews(): Review[] {
    return [...this.reviewsCache];
  }

  /**
   * Get cached review stats (synchronous)
   */
  getStats(): ReviewStats | null {
    return this.statsCache ? { ...this.statsCache } : null;
  }

  /**
   * Get reviews by rating range (synchronous)
   */
  getReviewsByRating(minRating: number, maxRating: number = 5): Review[] {
    return this.reviewsCache.filter(
      review => review.rating >= minRating && review.rating <= maxRating
    );
  }

  /**
   * Get recent reviews (synchronous)
   */
  getRecentReviews(count: number = 5): Review[] {
    return this.reviewsCache.slice(0, count);
  }

  /**
   * Search reviews by text content (synchronous)
   */
  searchReviews(searchTerm: string): Review[] {
    const term = searchTerm.toLowerCase();
    return this.reviewsCache.filter(
      review =>
        review.text.toLowerCase().includes(term) ||
        review.author.toLowerCase().includes(term)
    );
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      reviewsCount: this.reviewsCache.length,
      hasStats: !!this.statsCache,
      averageRating: this.statsCache?.averageRating || 0,
      isLoadingReviews: this.isLoadingReviews,
      isLoadingStats: this.isLoadingStats,
      hasReviewsError: !!this.reviewsError,
      hasStatsError: !!this.statsError,
      reviewsError: this.reviewsError?.message,
      statsError: this.statsError?.message,
      reviewsInitialized: this.reviewsInitialized,
      statsInitialized: this.statsInitialized,
      reviewsSubscriberCount: this.reviewsListeners.length,
      statsSubscriberCount: this.statsListeners.length,
    };
  }

  /**
   * Force refresh both caches
   */
  refresh() {
    this.cleanupReviews();
    this.cleanupStats();
    this.initializeReviews();
    this.initializeStats();
  }

  /**
   * Get loading states
   */
  getLoadingState() {
    return {
      reviews: {
        isLoading: this.isLoadingReviews,
        hasError: !!this.reviewsError,
        error: this.reviewsError?.message,
      },
      stats: {
        isLoading: this.isLoadingStats,
        hasError: !!this.statsError,
        error: this.statsError?.message,
      },
    };
  }

  /**
   * Cleanup reviews resources
   */
  private cleanupReviews() {
    if (this.reviewsUnsubscribe) {
      this.reviewsUnsubscribe();
      this.reviewsUnsubscribe = null;
      console.log('🧹 Reviews cache listener cleaned up');
    }

    this.reviewsInitialized = false;
    this.isLoadingReviews = true;
    this.reviewsError = null;
    this.reviewsCache = [];
  }

  /**
   * Cleanup stats resources
   */
  private cleanupStats() {
    if (this.statsUnsubscribe) {
      this.statsUnsubscribe();
      this.statsUnsubscribe = null;
      console.log('🧹 Review stats cache listener cleaned up');
    }

    this.statsInitialized = false;
    this.isLoadingStats = true;
    this.statsError = null;
    this.statsCache = null;
  }

  /**
   * Complete cleanup (for app shutdown)
   */
  destroy() {
    this.cleanupReviews();
    this.cleanupStats();
    this.reviewsListeners = [];
    this.statsListeners = [];
  }
}

// Export singleton instance
export const cachedReviewsService = new CachedReviewsService();

// Development helper
if (import.meta.env.DEV) {
  setInterval(
    () => {
      const stats = cachedReviewsService.getCacheStats();
      if (stats.reviewsCount > 0 || stats.reviewsSubscriberCount > 0) {
        console.log('⭐ Reviews Cache Stats:', stats);
      }
    },
    2 * 60 * 1000
  );
}
