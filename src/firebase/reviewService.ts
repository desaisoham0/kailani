import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './config';

export interface Review {
  id?: string;
  author: string;
  rating: number; // 1-5
  text: string;
  date: Timestamp;
  source: 'google'; // Only using Google reviews
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  lastUpdated: Timestamp;
}

// Collection reference
const reviewsCollection = collection(db, 'reviews');

// Stats document reference
const reviewStatsRef = doc(db, 'reviewStats', 'main');

// Get review stats
export const getReviewStats = async (): Promise<ReviewStats> => {
  try {
    const statsDoc = await getDoc(reviewStatsRef);

    if (statsDoc.exists()) {
      return statsDoc.data() as ReviewStats;
    } else {
      // Default stats if not found
      const defaultStats: ReviewStats = {
        totalReviews: 0,
        averageRating: 0,
        lastUpdated: Timestamp.now(),
      };

      // Create the stats document
      await setDoc(reviewStatsRef, defaultStats);
      return defaultStats;
    }
  } catch (error) {
    console.error('Error getting review stats: ', error);
    throw error;
  }
};

// Update review stats
export const updateReviewStats = async (stats: Partial<ReviewStats>) => {
  try {
    const statsDoc = await getDoc(reviewStatsRef);

    if (statsDoc.exists()) {
      await updateDoc(reviewStatsRef, {
        ...stats,
        lastUpdated: Timestamp.now(),
      });
    } else {
      // Create the stats document if it doesn't exist
      await setDoc(reviewStatsRef, {
        totalReviews: stats.totalReviews || 0,
        averageRating: stats.averageRating || 0,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error updating review stats: ', error);
    throw error;
  }
};

// Add a new review
export const addReview = async (
  review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>
) => {
  try {
    const docRef = await addDoc(reviewsCollection, {
      ...review,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, ...review };
  } catch (error) {
    console.error('Error adding review: ', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (id: string, reviewData: Partial<Review>) => {
  try {
    const reviewRef = doc(db, 'reviews', id);
    const reviewDoc = await getDoc(reviewRef);

    if (!reviewDoc.exists()) {
      throw new Error('Review not found');
    }

    const updatedData = { ...reviewData, updatedAt: serverTimestamp() };

    // Update document in Firestore
    await updateDoc(reviewRef, updatedData);

    return { id, ...reviewData };
  } catch (error) {
    console.error('Error updating review: ', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (id: string) => {
  try {
    const reviewRef = doc(db, 'reviews', id);
    const reviewDoc = await getDoc(reviewRef);

    if (!reviewDoc.exists()) {
      throw new Error('Review not found');
    }

    // Delete document from Firestore
    await deleteDoc(reviewRef);

    return id;
  } catch (error) {
    console.error('Error deleting review: ', error);
    throw error;
  }
};

// Get all reviews
export const getAllReviews = async () => {
  try {
    const q = query(reviewsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Review
    );
  } catch (error) {
    console.error('Error getting reviews: ', error);
    throw error;
  }
};

// Get Google reviews only
export const getGoogleReviews = async () => {
  try {
    const q = query(reviewsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Review
    );
  } catch (error) {
    console.error('Error getting Google reviews: ', error);
    throw error;
  }
};
