import {
  onSnapshot,
  query,
  orderBy,
  collection,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { usageTracker } from '../utils/localUsageTracker';
import type { Offer } from './offerService';

/**
 * Cached Offers Service - Single real-time listener for all offers
 */
class CachedOffersService {
  private cache: Offer[] = [];
  private listeners: ((offers: Offer[]) => void)[] = [];
  private unsubscribe: Unsubscribe | null = null;
  private initialized = false;
  private isLoading = true;
  private error: Error | null = null;

  /**
   * Initialize real-time listener
   */
  private initialize() {
    if (this.initialized) return;

    try {
      const offersCollection = collection(db, 'offers');
      const q = query(offersCollection, orderBy('createdAt', 'desc'));

      this.unsubscribe = onSnapshot(
        q,
        snapshot => {
          usageTracker.trackRead(1, 'cached-offers-listener');

          this.cache = snapshot.docs.map(
            doc =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as Offer
          );

          this.isLoading = false;
          this.error = null;

          // Notify all subscribers
          this.listeners.forEach(listener => {
            try {
              listener(this.cache);
            } catch (error) {
              console.error('Error in offers cache subscriber:', error);
            }
          });

          console.log(`🎯 Offers cache updated: ${this.cache.length} offers`);
        },
        error => {
          console.error('Offers cache listener error:', error);
          this.error = error;
          this.isLoading = false;

          this.listeners.forEach(listener => {
            try {
              listener([]);
            } catch (listenerError) {
              console.error(
                'Error in offers cache error subscriber:',
                listenerError
              );
            }
          });
        }
      );

      this.initialized = true;
      console.log('✅ Offers cache listener initialized');
    } catch (error) {
      console.error('Failed to initialize offers cache:', error);
      this.error = error instanceof Error ? error : new Error('Unknown error');
      this.isLoading = false;
    }
  }

  /**
   * Subscribe to cache updates
   */
  subscribe(callback: (offers: Offer[]) => void): () => void {
    this.listeners.push(callback);

    if (!this.initialized && !this.error) {
      this.initialize();
    }

    if (!this.isLoading && this.cache.length >= 0) {
      setTimeout(() => callback(this.cache), 0);
    }

    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
      if (this.listeners.length === 0) {
        this.cleanup();
      }
    };
  }

  /**
   * Get all cached offers (synchronous)
   */
  getAllOffers(): Offer[] {
    return [...this.cache];
  }

  /**
   * Get active offers from cache (synchronous)
   */
  getActiveOffers(): Offer[] {
    return this.cache.filter(offer => offer.isActive === true);
  }

  /**
   * Get upcoming offers from cache (synchronous)
   */
  getUpcomingOffers(): Offer[] {
    return this.cache
      .filter(offer => offer.isActive === true && offer.isUpcoming === true)
      .sort((a, b) => {
        if (!a.availabilityDate) return 1;
        if (!b.availabilityDate) return -1;
        return a.availabilityDate.seconds - b.availabilityDate.seconds;
      });
  }

  /**
   * Get current offers (active but not upcoming) from cache (synchronous)
   */
  getCurrentOffers(): Offer[] {
    return this.cache
      .filter(offer => offer.isActive === true && offer.isUpcoming === false)
      .sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.seconds - a.createdAt.seconds;
      });
  }

  /**
   * Get specific offer by ID from cache (synchronous)
   */
  getOfferById(id: string): Offer | undefined {
    return this.cache.find(offer => offer.id === id);
  }

  /**
   * Search offers by title or description (synchronous)
   */
  searchOffers(searchTerm: string): Offer[] {
    const term = searchTerm.toLowerCase();
    return this.cache.filter(
      offer =>
        offer.title.toLowerCase().includes(term) ||
        offer.description.toLowerCase().includes(term)
    );
  }

  /**
   * Get offers by status combination (synchronous)
   */
  getOffersByStatus(isActive: boolean, isUpcoming?: boolean): Offer[] {
    return this.cache.filter(offer => {
      if (offer.isActive !== isActive) return false;
      if (isUpcoming !== undefined && offer.isUpcoming !== isUpcoming)
        return false;
      return true;
    });
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const activeOffers = this.getActiveOffers();
    const upcomingOffers = this.getUpcomingOffers();
    const currentOffers = this.getCurrentOffers();

    return {
      totalOffers: this.cache.length,
      activeOffers: activeOffers.length,
      upcomingOffers: upcomingOffers.length,
      currentOffers: currentOffers.length,
      inactiveOffers: this.cache.length - activeOffers.length,
      isLoading: this.isLoading,
      hasError: !!this.error,
      error: this.error?.message,
      initialized: this.initialized,
      subscriberCount: this.listeners.length,
    };
  }

  /**
   * Force refresh the cache
   */
  refresh() {
    this.cleanup();
    this.initialize();
  }

  /**
   * Get current loading state
   */
  getLoadingState() {
    return {
      isLoading: this.isLoading,
      hasError: !!this.error,
      error: this.error?.message,
    };
  }

  /**
   * Cleanup resources
   */
  private cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      console.log('🧹 Offers cache listener cleaned up');
    }

    this.initialized = false;
    this.isLoading = true;
    this.error = null;
    this.cache = [];
  }

  /**
   * Complete cleanup (for app shutdown)
   */
  destroy() {
    this.cleanup();
    this.listeners = [];
  }
}

// Export singleton instance
export const cachedOffersService = new CachedOffersService();

// Development helper
if (import.meta.env.DEV) {
  setInterval(
    () => {
      const stats = cachedOffersService.getCacheStats();
      if (stats.totalOffers > 0 || stats.subscriberCount > 0) {
        console.log('🎯 Offers Cache Stats:', stats);
      }
    },
    2 * 60 * 1000
  );
}
