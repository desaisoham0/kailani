import { useState, useEffect, useMemo, useCallback } from 'react';
import { cachedOffersService } from '../firebase/cachedOffersService';
import type { Offer } from '../firebase/offerService';

/**
 * Hook to use cached offers with real-time updates
 */
export const useCachedOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = cachedOffersService.subscribe(newOffers => {
      setOffers(newOffers);
      setIsLoading(false);
      setError(null);
    });

    // Check initial loading state
    const loadingState = cachedOffersService.getLoadingState();
    if (loadingState.hasError) {
      setError(loadingState.error || 'Unknown error');
      setIsLoading(false);
    }

    return unsubscribe;
  }, []);

  const activeOffers = useMemo(
    () => offers.filter(offer => offer.isActive === true),
    [offers]
  );

  const upcomingOffers = useMemo(
    () =>
      offers
        .filter(offer => offer.isActive === true && offer.isUpcoming === true)
        .sort((a, b) => {
          if (!a.availabilityDate) return 1;
          if (!b.availabilityDate) return -1;
          return a.availabilityDate.seconds - b.availabilityDate.seconds;
        }),
    [offers]
  );

  const currentOffers = useMemo(
    () =>
      offers
        .filter(offer => offer.isActive === true && offer.isUpcoming === false)
        .sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt.seconds - a.createdAt.seconds;
        }),
    [offers]
  );

  const getOfferById = useCallback(
    (id: string) => offers.find(offer => offer.id === id),
    [offers]
  );

  const searchOffers = useCallback(
    (searchTerm: string) => {
      const term = searchTerm.toLowerCase();
      return offers.filter(
        offer =>
          offer.title.toLowerCase().includes(term) ||
          offer.description.toLowerCase().includes(term)
      );
    },
    [offers]
  );

  const getOffersByStatus = useCallback(
    (isActive: boolean, isUpcoming?: boolean) =>
      offers.filter(offer => {
        if (offer.isActive !== isActive) return false;
        if (isUpcoming !== undefined && offer.isUpcoming !== isUpcoming)
          return false;
        return true;
      }),
    [offers]
  );

  const refresh = useCallback(() => cachedOffersService.refresh(), []);

  const stats = useMemo(() => cachedOffersService.getCacheStats(), []);

  return {
    offers,
    activeOffers,
    upcomingOffers,
    currentOffers,
    isLoading,
    error,
    getOfferById,
    searchOffers,
    getOffersByStatus,
    refresh,
    stats,
  };
};
