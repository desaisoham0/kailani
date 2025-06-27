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

export interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  isUpcoming: boolean;
  availabilityDate?: Timestamp;
  expiryDate?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface OfferCacheStats {
  totalOffers: number;
  currentOffers: number;
  upcomingOffers: number;
  lastUpdated: Date;
  isOnline: boolean;
  hasInitialData: boolean;
}

// Event types for cache updates
export type OfferCacheEventType = 'added' | 'modified' | 'removed' | 'initial_load' | 'error';

export interface OfferCacheEvent {
  type: OfferCacheEventType;
  offers?: Offer[];
  offer?: Offer;
  error?: Error;
  stats: OfferCacheStats;
}

export type OfferCacheEventCallback = (event: OfferCacheEvent) => void;

/**
 * Efficient cached offer service using Firestore real-time listeners
 * Implements cost-effective caching with offline persistence
 */
class CachedOfferService {
  private offers: Map<string, Offer> = new Map();
  private listeners: Set<OfferCacheEventCallback> = new Set();
  private unsubscribeFn: Unsubscribe | null = null;
  private lastUpdated = new Date();
  private hasInitialData = false;

  constructor() {
    this.initializeListener();
  }

  /**
   * Initialize the real-time listener for offers
   */
  private initializeListener(): void {
    if (this.unsubscribeFn) {
      console.warn('Offer listener already initialized');
      return;
    }

    try {
      const offersCollection = collection(db, 'offers');
      const q = query(offersCollection, orderBy('createdAt', 'desc'));

      console.log('🔄 Initializing real-time offers listener...');

      this.unsubscribeFn = onSnapshot(
        q,
        {
          includeMetadataChanges: true
        },
        (snapshot: QuerySnapshot) => {
          this.handleSnapshotUpdate(snapshot);
        },
        (error) => {
          console.error('❌ Offers listener error:', error);
          this.notifyListeners({
            type: 'error',
            error,
            stats: this.getStats()
          });
        }
      );

      console.log('✅ Offers real-time listener initialized');
    } catch (error) {
      console.error('❌ Failed to initialize offers listener:', error);
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
    
    // Previously tracked reads here
    
    console.log(`📡 Received ${snapshot.docChanges().length} offer changes from ${source}`);

    // Handle initial load
    if (!this.hasInitialData && !snapshot.empty) {
      const offers: Offer[] = [];
      snapshot.docs.forEach(doc => {
        const offer = { id: doc.id, ...doc.data() } as Offer;
        this.offers.set(doc.id, offer);
        offers.push(offer);
      });

      this.hasInitialData = true;
      this.lastUpdated = new Date();

      console.log(`✅ Initial offers data loaded: ${offers.length} offers from ${source}`);
      
      this.notifyListeners({
        type: 'initial_load',
        offers,
        stats: this.getStats()
      });

      return;
    }

    // Handle incremental updates
    snapshot.docChanges().forEach((change: DocumentChange) => {
      const offer = { id: change.doc.id, ...change.doc.data() } as Offer;

      switch (change.type) {
        case 'added':
          if (!this.offers.has(change.doc.id)) {
            this.offers.set(change.doc.id, offer);
            console.log(`➕ Added offer: ${offer.title} from ${source}`);
            this.notifyListeners({
              type: 'added',
              offer,
              stats: this.getStats()
            });
          }
          break;

        case 'modified':
          this.offers.set(change.doc.id, offer);
          console.log(`✏️ Modified offer: ${offer.title} from ${source}`);
          this.notifyListeners({
            type: 'modified',
            offer,
            stats: this.getStats()
          });
          break;

        case 'removed':
          this.offers.delete(change.doc.id);
          console.log(`🗑️ Removed offer: ${offer.title} from ${source}`);
          this.notifyListeners({
            type: 'removed',
            offer,
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
  subscribe(callback: OfferCacheEventCallback): () => void {
    this.listeners.add(callback);

    // If we already have initial data, notify immediately
    if (this.hasInitialData) {
      callback({
        type: 'initial_load',
        offers: this.getAllOffers(),
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
  private notifyListeners(event: OfferCacheEvent): void {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in offer cache event callback:', error);
      }
    });
  }

  /**
   * Get all offers from cache
   */
  getAllOffers(): Offer[] {
    return Array.from(this.offers.values())
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
  }

  /**
   * Get current offers (available now)
   */
  getCurrentOffers(): Offer[] {
    const now = new Date();
    return this.getAllOffers().filter(offer => {
      // Not upcoming and not expired
      if (offer.isUpcoming) return false;
      if (offer.expiryDate && offer.expiryDate.toDate() < now) return false;
      return true;
    });
  }

  /**
   * Get upcoming offers
   */
  getUpcomingOffers(): Offer[] {
    return this.getAllOffers().filter(offer => offer.isUpcoming);
  }

  /**
   * Get cache statistics
   */
  getStats(): OfferCacheStats {
    const currentOffers = this.getCurrentOffers();
    const upcomingOffers = this.getUpcomingOffers();
    
    return {
      totalOffers: this.offers.size,
      currentOffers: currentOffers.length,
      upcomingOffers: upcomingOffers.length,
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
    console.log('🔄 Offer cache refresh requested (real-time listener handles updates automatically)');
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
      this.unsubscribeFn = null;
      console.log('🔌 Offers real-time listener disconnected');
    }
    
    this.listeners.clear();
    this.offers.clear();
    this.hasInitialData = false;
  }
}

// Export singleton instance
export const cachedOfferService = new CachedOfferService();
