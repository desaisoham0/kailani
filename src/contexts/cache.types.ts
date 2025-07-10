import { createContext } from 'react';
import type { CacheStats } from '../firebase/cachedFoodService';

export interface CacheContextValue {
  isReady: boolean;
  stats: CacheStats;
  error: Error | null;
}

export const CacheContext = createContext<CacheContextValue | undefined>(
  undefined
);
