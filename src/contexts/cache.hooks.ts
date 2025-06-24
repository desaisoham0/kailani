import { useContext } from 'react';
import { CacheContext, type CacheContextValue } from './cache.types';

/**
 * Hook to access cache context
 */
export const useCache = (): CacheContextValue => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};
