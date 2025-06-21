import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp,
  type DocumentData
} from 'firebase/firestore';
import type { FoodItem } from '../firebase/foodService';
import { cacheService, CACHE_CONFIGS } from './cacheService';

// Type with serializable properties
export interface SerializableFoodItem {
  id?: string;
  name: string;
  description: string;
  category: string;
  favorite: boolean;
  imageUrl: string;
  createdAtSeconds?: number;
  createdAtNanoseconds?: number;
  updatedAtSeconds?: number;
  updatedAtNanoseconds?: number;
}

// Collection reference
const foodItemsCollection = collection(db, 'food-items');

/**
 * Converts Firestore Timestamp objects to serializable format
 */
function convertToSerializable(item: FoodItem): SerializableFoodItem {
  const serializable: SerializableFoodItem = {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    favorite: item.favorite,
    imageUrl: item.imageUrl,
  };

  // Convert Firestore Timestamps to serializable format
  if (item.createdAt) {
    serializable.createdAtSeconds = item.createdAt.seconds;
    serializable.createdAtNanoseconds = item.createdAt.nanoseconds;
  }

  if (item.updatedAt) {
    serializable.updatedAtSeconds = item.updatedAt.seconds;
    serializable.updatedAtNanoseconds = item.updatedAt.nanoseconds;
  }

  return serializable;
}

/**
 * Converts serializable objects back to FoodItem with Timestamp objects
 */
function convertFromSerializable(serializable: SerializableFoodItem): FoodItem {
  const foodItem: FoodItem = {
    id: serializable.id,
    name: serializable.name,
    description: serializable.description,
    category: serializable.category,
    favorite: serializable.favorite,
    imageUrl: serializable.imageUrl,
  };

  // Reconstruct Firestore Timestamp objects if available
  if (serializable.createdAtSeconds !== undefined && serializable.createdAtNanoseconds !== undefined) {
    foodItem.createdAt = new Timestamp(
      serializable.createdAtSeconds,
      serializable.createdAtNanoseconds
    );
  }

  if (serializable.updatedAtSeconds !== undefined && serializable.updatedAtNanoseconds !== undefined) {
    foodItem.updatedAt = new Timestamp(
      serializable.updatedAtSeconds,
      serializable.updatedAtNanoseconds
    );
  }

  return foodItem;
}

/**
 * Maps doc data to FoodItem with typing
 */
function mapDocToFoodItem(doc: DocumentData): FoodItem {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || '',
    description: data.description || '',
    category: data.category || '',
    favorite: !!data.favorite,
    imageUrl: data.imageUrl || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

/**
 * Get all food items with caching
 */
export const getAllFoodItemsOptimized = async (): Promise<FoodItem[]> => {
  try {
    const { data } = await cacheService.fetchWithCache<SerializableFoodItem[]>(
      CACHE_CONFIGS.FOOD_ITEMS,
      async () => {
        const q = query(foodItemsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(mapDocToFoodItem);
        
        // Filter out items without valid images to avoid UI issues
        const validItems = items.filter(item => item.imageUrl && item.imageUrl.trim() !== '');
        
        // Convert to serializable format for caching
        return validItems.map(convertToSerializable);
      }
    );

    // Convert back to FoodItem objects with proper Timestamp objects
    return data.map(convertFromSerializable);
  } catch (error) {
    console.error("Error in getAllFoodItemsOptimized:", error);
    const errorMessage = cacheService.handleFirebaseError(error);
    throw new Error(errorMessage);
  }
};

/**
 * Get favorite food items with caching
 */
export const getFavoriteFoodItemsOptimized = async (): Promise<FoodItem[]> => {
  try {
    const { data } = await cacheService.fetchWithCache<SerializableFoodItem[]>(
      CACHE_CONFIGS.FAVORITE_FOOD_ITEMS,
      async () => {
        const q = query(
          foodItemsCollection, 
          where('favorite', '==', true),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(mapDocToFoodItem);
        
        // Filter out items without valid images to avoid UI issues
        const validItems = items.filter(item => item.imageUrl && item.imageUrl.trim() !== '');
        
        // Convert to serializable format for caching
        return validItems.map(convertToSerializable);
      }
    );

    // Convert back to FoodItem objects with proper Timestamp objects
    return data.map(convertFromSerializable);
  } catch (error) {
    console.error("Error in getFavoriteFoodItemsOptimized:", error);
    const errorMessage = cacheService.handleFirebaseError(error);
    throw new Error(errorMessage);
  }
};

/**
 * Get food items by category with caching
 */
export const getFoodItemsByCategoryOptimized = async (category: string): Promise<FoodItem[]> => {
  // Create a specific cache config for this category
  const categoryCache = {
    key: `kailani_food_category_${category.toLowerCase().replace(/\s+/g, '_')}`,
    expiration: 60 * 60 * 1000, // 1 hour
  };
  
  try {
    const { data } = await cacheService.fetchWithCache<SerializableFoodItem[]>(
      categoryCache,
      async () => {
        const q = query(
          foodItemsCollection, 
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(mapDocToFoodItem);
        
        // Filter out items without valid images to avoid UI issues
        const validItems = items.filter(item => item.imageUrl && item.imageUrl.trim() !== '');
        
        // Convert to serializable format for caching
        return validItems.map(convertToSerializable);
      }
    );

    // Convert back to FoodItem objects with proper Timestamp objects
    return data.map(convertFromSerializable);
  } catch (error) {
    console.error(`Error in getFoodItemsByCategoryOptimized for category ${category}:`, error);
    const errorMessage = cacheService.handleFirebaseError(error);
    throw new Error(errorMessage);
  }
};
