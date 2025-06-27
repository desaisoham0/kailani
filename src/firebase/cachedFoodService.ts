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
import { devLog } from '../utils/environment';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: string;
  favorite: boolean;
  imageUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CacheStats {
  totalItems: number;
  lastUpdated: Date;
  isOnline: boolean;
  hasInitialData: boolean;
}

// Event types for cache updates
export type CacheEventType = 'added' | 'modified' | 'removed' | 'initial_load' | 'error';

export interface CacheEvent {
  type: CacheEventType;
  items?: FoodItem[];
  item?: FoodItem;
  error?: Error;
  stats: CacheStats;
}

export type CacheEventCallback = (event: CacheEvent) => void;

/**
 * Efficient cached food service using Firestore real-time listeners
 * Implements cost-effective caching with offline persistence
 */
class CachedFoodService {
  private foodItems: Map<string, FoodItem> = new Map();
  private listeners: Set<CacheEventCallback> = new Set();
  private unsubscribeFn: Unsubscribe | null = null;
  private lastUpdated = new Date();
  private hasInitialData = false;

  constructor() {
    this.initializeListener();
  }

  /**
   * Initialize the real-time listener for food items
   * This listener will stay active for the entire app lifecycle
   */
  private initializeListener(): void {
    if (this.unsubscribeFn) {
      console.warn('Listener already initialized');
      return;
    }

    try {
      const foodItemsCollection = collection(db, 'food-items');
      const q = query(foodItemsCollection, orderBy('createdAt', 'desc'));

      devLog.log('🔄 Initializing real-time food items listener...');

      this.unsubscribeFn = onSnapshot(
        q,
        {
          includeMetadataChanges: true
        },
        (snapshot: QuerySnapshot) => {
          this.handleSnapshotUpdate(snapshot);
        },
        (error) => {
          console.error('❌ Firestore listener error:', error);
          this.notifyListeners({
            type: 'error',
            error,
            stats: this.getStats()
          });
        }
      );

      devLog.log('✅ Real-time listener initialized');
    } catch (error) {
      console.error('❌ Failed to initialize listener:', error);
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
    
    console.log(`📡 Received ${snapshot.docChanges().length} changes from ${source}`);

    // Handle initial load
    if (!this.hasInitialData && !snapshot.empty) {
      const items: FoodItem[] = [];
      snapshot.docs.forEach(doc => {
        const item = { id: doc.id, ...doc.data() } as FoodItem;
        this.foodItems.set(doc.id, item);
        items.push(item);
      });

      this.hasInitialData = true;
      this.lastUpdated = new Date();

      console.log(`✅ Initial data loaded: ${items.length} items from ${source}`);
      
      this.notifyListeners({
        type: 'initial_load',
        items,
        stats: this.getStats()
      });

      return;
    }

    // Handle incremental updates
    snapshot.docChanges().forEach((change: DocumentChange) => {
      const item = { id: change.doc.id, ...change.doc.data() } as FoodItem;

      switch (change.type) {
        case 'added':
          if (!this.foodItems.has(change.doc.id)) {
            this.foodItems.set(change.doc.id, item);
            console.log(`➕ Added item: ${item.name} from ${source}`);
            this.notifyListeners({
              type: 'added',
              item,
              stats: this.getStats()
            });
          }
          break;

        case 'modified':
          this.foodItems.set(change.doc.id, item);
          console.log(`✏️ Modified item: ${item.name} from ${source}`);
          this.notifyListeners({
            type: 'modified',
            item,
            stats: this.getStats()
          });
          break;

        case 'removed':
          this.foodItems.delete(change.doc.id);
          console.log(`🗑️ Removed item: ${item.name} from ${source}`);
          this.notifyListeners({
            type: 'removed',
            item,
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
  subscribe(callback: CacheEventCallback): () => void {
    this.listeners.add(callback);

    // If we already have initial data, notify immediately
    if (this.hasInitialData) {
      callback({
        type: 'initial_load',
        items: this.getAllItems(),
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
  private notifyListeners(event: CacheEvent): void {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in cache event callback:', error);
      }
    });
  }

  /**
   * Get all food items from cache
   */
  getAllItems(): FoodItem[] {
    return Array.from(this.foodItems.values())
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
  }

  /**
   * Get favorite food items from cache
   */
  getFavoriteItems(): FoodItem[] {
    return this.getAllItems().filter(item => item.favorite);
  }

  /**
   * Get food items by category from cache
   */
  getItemsByCategory(category: string): FoodItem[] {
    return this.getAllItems().filter(item => item.category === category);
  }

  /**
   * Get a specific food item by ID from cache
   */
  getItemById(id: string): FoodItem | undefined {
    return this.foodItems.get(id);
  }

  /**
   * Get available categories from cached items
   */
  getAvailableCategories(): string[] {
    const categories = new Set<string>();
    this.foodItems.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories).sort();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return {
      totalItems: this.foodItems.size,
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
   * This will not trigger additional reads if using from cache
   */
  refresh(): void {
    console.log('🔄 Cache refresh requested (real-time listener handles updates automatically)');
  }

  /**
   * Cleanup method - call when component unmounts or app closes
   * Note: In most cases, you want to keep the listener alive for the entire app lifecycle
   */
  destroy(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
      this.unsubscribeFn = null;
      console.log('🔌 Real-time listener disconnected');
    }
    
    this.listeners.clear();
    this.foodItems.clear();
    this.hasInitialData = false;
  }
}

// Export singleton instance
export const cachedFoodService = new CachedFoodService();
