import { useState, useEffect, useMemo, useCallback } from 'react';
import { cachedFoodService } from '../firebase/cachedFoodService';
import type { FoodItem } from '../firebase/foodService';

/**
 * Hook to use cached food items with real-time updates
 * Replaces multiple Firebase queries with a single cached listener
 */
export const useCachedFoodItems = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to cached food service
    const unsubscribe = cachedFoodService.subscribe(newItems => {
      setItems(newItems);
      setIsLoading(false);
      setError(null);
    });

    // Check initial loading state
    const loadingState = cachedFoodService.getLoadingState();
    if (loadingState.hasError) {
      setError(loadingState.error || 'Unknown error');
      setIsLoading(false);
    }

    return unsubscribe;
  }, []);

  // Memoized computed values
  const favoriteItems = useMemo(
    () => items.filter(item => item.favorite === true),
    [items]
  );

  const getItemsByCategory = useCallback(
    (category: string) =>
      items.filter(
        item => item.category.toLowerCase() === category.toLowerCase()
      ),
    [items]
  );

  const searchItems = useCallback(
    (searchTerm: string) => {
      const term = searchTerm.toLowerCase();
      return items.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    },
    [items]
  );

  const getItemById = useCallback(
    (id: string) => items.find(item => item.id === id),
    [items]
  );

  const refresh = useCallback(() => cachedFoodService.refresh(), []);

  const stats = useMemo(() => cachedFoodService.getCacheStats(), []);

  return {
    items,
    favoriteItems,
    isLoading,
    error,
    getItemsByCategory,
    searchItems,
    getItemById,
    refresh,
    stats,
  };
};
