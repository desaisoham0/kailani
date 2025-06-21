import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  Timestamp,
} from 'firebase/firestore';
import type { Offer } from '../firebase/offerService';
import { cacheService, CACHE_CONFIGS } from './cacheService';

// Collection reference
const offersCollection = collection(db, 'offers');

// Serializable offer interface for caching
interface SerializableOffer {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  isUpcoming: boolean;
  availabilityDateSeconds?: number;
  availabilityDateNanoseconds?: number;
  createdAtSeconds?: number;
  createdAtNanoseconds?: number;
  updatedAtSeconds?: number;
  updatedAtNanoseconds?: number;
}

/**
 * Converts Firestore Timestamp objects to serializable format
 */
function convertToSerializable(offer: Offer): SerializableOffer {
  const serializable: SerializableOffer = {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    imageUrl: offer.imageUrl,
    isActive: offer.isActive,
    isUpcoming: offer.isUpcoming,
  };

  // Convert Firestore Timestamps to serializable format
  if (offer.availabilityDate) {
    serializable.availabilityDateSeconds = offer.availabilityDate.seconds;
    serializable.availabilityDateNanoseconds = offer.availabilityDate.nanoseconds;
  }

  if (offer.createdAt) {
    serializable.createdAtSeconds = offer.createdAt.seconds;
    serializable.createdAtNanoseconds = offer.createdAt.nanoseconds;
  }

  if (offer.updatedAt) {
    serializable.updatedAtSeconds = offer.updatedAt.seconds;
    serializable.updatedAtNanoseconds = offer.updatedAt.nanoseconds;
  }

  return serializable;
}

/**
 * Converts serializable objects back to Offer with Timestamp objects
 */
function convertFromSerializable(serializable: SerializableOffer): Offer {
  const offer: Offer = {
    id: serializable.id,
    title: serializable.title,
    description: serializable.description,
    imageUrl: serializable.imageUrl,
    isActive: serializable.isActive,
    isUpcoming: serializable.isUpcoming,
  };

  // Reconstruct Firestore Timestamp objects if available
  if (serializable.availabilityDateSeconds !== undefined && serializable.availabilityDateNanoseconds !== undefined) {
    offer.availabilityDate = new Timestamp(
      serializable.availabilityDateSeconds,
      serializable.availabilityDateNanoseconds
    );
  }

  if (serializable.createdAtSeconds !== undefined && serializable.createdAtNanoseconds !== undefined) {
    offer.createdAt = new Timestamp(
      serializable.createdAtSeconds,
      serializable.createdAtNanoseconds
    );
  }

  if (serializable.updatedAtSeconds !== undefined && serializable.updatedAtNanoseconds !== undefined) {
    offer.updatedAt = new Timestamp(
      serializable.updatedAtSeconds,
      serializable.updatedAtNanoseconds
    );
  }

  return offer;
}

/**
 * Get current offers (not upcoming) with caching
 */
export const getCurrentOffersOptimized = async (): Promise<Offer[]> => {
  try {
    const { data } = await cacheService.fetchWithCache<SerializableOffer[]>(
      CACHE_CONFIGS.CURRENT_OFFERS,
      async () => {
        // First get all active offers
        const q = query(
          offersCollection, 
          where('isActive', '==', true)
        );
        const querySnapshot = await getDocs(q);
        
        // Then filter in memory for non-upcoming offers
        const currentOffers = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Offer))
          .filter(offer => offer.isUpcoming === false)
          .sort((a, b) => {
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return b.createdAt.seconds - a.createdAt.seconds;
          });
        
        return currentOffers.map(convertToSerializable);
      }
    );

    // Convert back to Offer objects with proper Timestamp objects
    return data.map(convertFromSerializable);
  } catch (error) {
    console.error("Error in getCurrentOffersOptimized:", error);
    const errorMessage = cacheService.handleFirebaseError(error);
    throw new Error(errorMessage);
  }
};

/**
 * Get upcoming offers with caching
 */
export const getUpcomingOffersOptimized = async (): Promise<Offer[]> => {
  try {
    const { data } = await cacheService.fetchWithCache<SerializableOffer[]>(
      CACHE_CONFIGS.UPCOMING_OFFERS,
      async () => {
        // First get all active offers
        const q = query(
          offersCollection, 
          where('isActive', '==', true)
        );
        const querySnapshot = await getDocs(q);
        
        // Then filter in memory for upcoming offers
        const upcomingOffers = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Offer))
          .filter(offer => offer.isUpcoming === true)
          .sort((a, b) => {
            if (!a.availabilityDate) return 1;
            if (!b.availabilityDate) return -1;
            return a.availabilityDate.seconds - b.availabilityDate.seconds;
          });
        
        return upcomingOffers.map(convertToSerializable);
      }
    );

    // Convert back to Offer objects with proper Timestamp objects
    return data.map(convertFromSerializable);
  } catch (error) {
    console.error("Error in getUpcomingOffersOptimized:", error);
    const errorMessage = cacheService.handleFirebaseError(error);
    throw new Error(errorMessage);
  }
};
