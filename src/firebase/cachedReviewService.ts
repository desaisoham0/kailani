import { db } from './config';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp,
  QuerySnapshot,
  type DocumentChange,
  type Unsubscribe
} from 'firebase/firestore';
import { firestoreUsageTracker } from '../utils/firestoreUsageTracker';

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: 'google';
  date?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingsBreakdown: Record<number, number>; // 1-5 stars count
}

export interface ReviewCacheStats {
  totalReviews: number;
  lastUpdated: Date;
  isOnline: boolean;
  hasInitialData: boolean;
}

// Event types for cache updates
export type ReviewCacheEventType = 'added' | 'modified' | 'removed' | 'initial_load' | 'error';

export interface ReviewCacheEvent {
  type: ReviewCacheEventType;
  reviews?: Review[];
  review?: Review;
  error?: Error;
  stats: ReviewCacheStats;
}

export type ReviewCacheEventCallback = (event: ReviewCacheEvent) => void;

/**
 * Efficient cached review service using Firestore real-time listeners
 * Implements cost-effective caching with offline persistence
 */
class CachedReviewService {
  private reviews: Map<string, Review> = new Map();
  private listeners: Set<ReviewCacheEventCallback> = new Set();
  private unsubscribeFn: Unsubscribe | null = null;
  private lastUpdated = new Date();
  private hasInitialData = false;

  constructor() {
    this.initializeListener();
  }

  /**
   * Initialize the real-time listener for reviews
   */
  private initializeListener(): void {
    if (this.unsubscribeFn) {
      console.warn('Review listener already initialized');
      return;
    }

    try {
      const reviewsCollection = collection(db, 'reviews');
      const q = query(reviewsCollection, orderBy('createdAt', 'desc'));

      console.log('🔄 Initializing real-time reviews listener...');

      this.unsubscribeFn = onSnapshot(
        q,
        {
          includeMetadataChanges: true
        },
        (snapshot: QuerySnapshot) => {
          this.handleSnapshotUpdate(snapshot);
        },
        (error) => {
          console.error('❌ Reviews listener error:', error);
          this.notifyListeners({
            type: 'error',
            error,
            stats: this.getStats()
          });
        }
      );

      console.log('✅ Reviews real-time listener initialized');
    } catch (error) {
      console.error('❌ Failed to initialize reviews listener:', error);
      this.notifyListeners({
        type: 'error',
        error: error as Error,
        stats: this.getStats()
      });
    }
  }

  /**
   * Handle snapshot updates from Firestore
   */
  private handleSnapshotUpdate(snapshot: QuerySnapshot): void {
    const source = snapshot.metadata.fromCache ? 'local cache' : 'server';
    
    // Track reads only if from server (not from cache)
    if (!snapshot.metadata.fromCache) {
      firestoreUsageTracker.trackRead(snapshot.docs.length);
    }
    
    console.log(`📡 Received ${snapshot.docChanges().length} review changes from ${source}`);

    // Handle initial load
    if (!this.hasInitialData && !snapshot.empty) {
      const reviews: Review[] = [];
      snapshot.docs.forEach(doc => {
        const review = { id: doc.id, ...doc.data() } as Review;
        this.reviews.set(doc.id, review);
        reviews.push(review);
      });

      this.hasInitialData = true;
      this.lastUpdated = new Date();

      console.log(`✅ Initial reviews data loaded: ${reviews.length} reviews from ${source}`);
      
      this.notifyListeners({
        type: 'initial_load',
        reviews,
        stats: this.getStats()
      });

      return;
    }

    // Handle incremental updates
    snapshot.docChanges().forEach((change: DocumentChange) => {
      const review = { id: change.doc.id, ...change.doc.data() } as Review;

      switch (change.type) {
        case 'added':
          if (!this.reviews.has(change.doc.id)) {
            this.reviews.set(change.doc.id, review);
            console.log(`➕ Added review: ${review.author} from ${source}`);
            this.notifyListeners({
              type: 'added',
              review,
              stats: this.getStats()
            });
          }
          break;

        case 'modified':
          this.reviews.set(change.doc.id, review);
          console.log(`✏️ Modified review: ${review.author} from ${source}`);
          this.notifyListeners({
            type: 'modified',
            review,
            stats: this.getStats()
          });
          break;

        case 'removed':
          this.reviews.delete(change.doc.id);
          console.log(`🗑️ Removed review: ${review.author} from ${source}`);
          this.notifyListeners({
            type: 'removed',
            review,
            stats: this.getStats()
          });
          break;
      }
    });

    this.lastUpdated = new Date();
  }

  /**
   * Subscribe to cache events
   */
  subscribe(callback: ReviewCacheEventCallback): () => void {
    this.listeners.add(callback);

    // If we already have initial data, notify immediately
    if (this.hasInitialData) {
      callback({
        type: 'initial_load',
        reviews: this.getAllReviews(),
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
  private notifyListeners(event: ReviewCacheEvent): void {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in review cache event callback:', error);
      }
    });
  }

  /**
   * Get all reviews from cache
   */
  getAllReviews(): Review[] {
    return Array.from(this.reviews.values())
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
  }

  /**
   * Get review statistics
   */
  getReviewStats(): ReviewStats {
    const reviews = this.getAllReviews();
    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingsBreakdown: {}
      };
    }

    const ratingsBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach(review => {
      totalRating += review.rating;
      ratingsBreakdown[review.rating] = (ratingsBreakdown[review.rating] || 0) + 1;
    });

    return {
      averageRating: totalRating / totalReviews,
      totalReviews,
      ratingsBreakdown
    };
  }

  /**
   * Get cache statistics
   */
  getStats(): ReviewCacheStats {
    return {
      totalReviews: this.reviews.size,
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
    console.log('🔄 Review cache refresh requested (real-time listener handles updates automatically)');
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
      this.unsubscribeFn = null;
      console.log('🔌 Reviews real-time listener disconnected');
    }
    
    this.listeners.clear();
    this.reviews.clear();
    this.hasInitialData = false;
  }
}

// Export singleton instance
export const cachedReviewService = new CachedReviewService();
