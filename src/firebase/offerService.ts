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
  where,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './config';

export interface Offer {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  isUpcoming: boolean;
  availabilityDate?: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Collection reference
const offersCollection = collection(db, 'offers');

// Add a new offer
export const addOffer = async (
  offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>,
  imageFile: File | null
) => {
  try {
    let imageUrl = '';

    // If there's an image file, upload it to Firebase Storage first
    if (imageFile) {
      const storageRef = ref(storage, `offers/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      // Wait for the upload to complete
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          () => {},
          error => reject(error),
          async () => {
            try {
              imageUrl = await getDownloadURL(storageRef);
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    }

    // Add document to Firestore
    const docRef = await addDoc(offersCollection, {
      ...offer,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, ...offer, imageUrl };
  } catch (error) {
    console.error('Error adding offer: ', error);
    throw error;
  }
};

// Update an offer
export const updateOffer = async (
  id: string,
  offerData: Partial<Offer>,
  imageFile: File | null
) => {
  try {
    const offerRef = doc(db, 'offers', id);
    const offerDoc = await getDoc(offerRef);

    if (!offerDoc.exists()) {
      throw new Error('Offer not found');
    }

    const updatedData = { ...offerData, updatedAt: serverTimestamp() };

    // If there's a new image file, upload it and update the URL
    if (imageFile) {
      // Delete old image if it exists
      const currentData = offerDoc.data();
      if (currentData.imageUrl) {
        try {
          const oldImageRef = ref(storage, currentData.imageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn('Error deleting old image: ', error);
        }
      }

      // Upload new image
      const storageRef = ref(storage, `offers/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      // Wait for the upload to complete
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          () => {},
          error => reject(error),
          async () => {
            try {
              updatedData.imageUrl = await getDownloadURL(storageRef);
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    }

    // Update document in Firestore
    await updateDoc(offerRef, updatedData);

    return {
      id,
      ...offerData,
      ...(imageFile ? { imageUrl: updatedData.imageUrl } : {}),
    };
  } catch (error) {
    console.error('Error updating offer: ', error);
    throw error;
  }
};

// Delete an offer
export const deleteOffer = async (id: string) => {
  try {
    const offerRef = doc(db, 'offers', id);
    const offerDoc = await getDoc(offerRef);

    if (!offerDoc.exists()) {
      throw new Error('Offer not found');
    }

    // Delete image from Storage if it exists
    const offerData = offerDoc.data();
    if (offerData.imageUrl) {
      try {
        const imageRef = ref(storage, offerData.imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('Error deleting image: ', error);
      }
    }

    // Delete document from Firestore
    await deleteDoc(offerRef);

    return id;
  } catch (error) {
    console.error('Error deleting offer: ', error);
    throw error;
  }
};

// Get all offers
export const getAllOffers = async () => {
  try {
    const q = query(offersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as Offer;
    });
  } catch (error) {
    console.error('Error getting offers: ', error);
    throw error;
  }
};

// Get active offers
export const getActiveOffers = async () => {
  try {
    const q = query(
      offersCollection,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as Offer;
    });
  } catch (error) {
    console.error('Error getting active offers: ', error);
    throw error;
  }
};

// Get upcoming offers - MODIFIED to work without complex index
export const getUpcomingOffers = async () => {
  try {
    // First get all active offers
    const q = query(offersCollection, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);

    // Then filter in memory for upcoming offers
    const upcomingOffers = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as Offer)
      .filter(offer => offer.isUpcoming === true)
      .sort((a, b) => {
        if (!a.availabilityDate) return 1;
        if (!b.availabilityDate) return -1;
        return a.availabilityDate.seconds - b.availabilityDate.seconds;
      });

    return upcomingOffers;
  } catch (error) {
    console.error('Error getting upcoming offers: ', error);
    throw error;
  }
};

// Get current offers (not upcoming) - MODIFIED to work without complex index
export const getCurrentOffers = async () => {
  try {
    // First get all active offers
    const q = query(offersCollection, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);

    // Then filter in memory for non-upcoming offers
    const currentOffers = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as Offer)
      .filter(offer => offer.isUpcoming === false)
      .sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.seconds - a.createdAt.seconds;
      });

    return currentOffers;
  } catch (error) {
    console.error('Error getting current offers: ', error);
    throw error;
  }
};
