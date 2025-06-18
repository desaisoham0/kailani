import { db, storage } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export interface FoodItem {
  id?: string;
  name: string;
  description: string;
  category: string;
  favorite: boolean;
  imageUrl: string;
  createdAt?: any;
  updatedAt?: any;
}

// Collection reference
const foodItemsCollection = collection(db, 'food-items');

// Add a new food item
export const addFoodItem = async (foodItem: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File | null) => {
  try {
    let imageUrl = '';
    
    // If there's an image file, upload it to Firebase Storage first
    if (imageFile) {
      const storageRef = ref(storage, `food-items/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      
      // Wait for the upload to complete
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          () => {},
          (error) => reject(error),
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });
    }
    
    // Add document to Firestore
    const docRef = await addDoc(foodItemsCollection, {
      ...foodItem,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { id: docRef.id, ...foodItem, imageUrl };
  } catch (error) {
    console.error("Error adding food item: ", error);
    throw error;
  }
};

// Update a food item
export const updateFoodItem = async (
  id: string, 
  foodItemData: Partial<FoodItem>, 
  imageFile: File | null
) => {
  try {
    const foodItemRef = doc(db, 'food-items', id);
    const foodItemDoc = await getDoc(foodItemRef);
    
    if (!foodItemDoc.exists()) {
      throw new Error('Food item not found');
    }
    
    let updatedData = { ...foodItemData, updatedAt: serverTimestamp() };
    
    // If there's a new image file, upload it and update the URL
    if (imageFile) {
      // Delete old image if it exists
      const currentData = foodItemDoc.data();
      if (currentData.imageUrl) {
        try {
          const oldImageRef = ref(storage, currentData.imageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn("Old image might not exist:", error);
        }
      }
      
      // Upload new image
      const storageRef = ref(storage, `food-items/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      
      // Wait for the upload to complete
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          () => {},
          (error) => reject(error),
          async () => {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            updatedData.imageUrl = imageUrl;
            resolve();
          }
        );
      });
    }
    
    // Update document in Firestore
    await updateDoc(foodItemRef, updatedData);
    
    return { id, ...foodItemData, ...(imageFile ? { imageUrl: updatedData.imageUrl } : {}) };
  } catch (error) {
    console.error("Error updating food item: ", error);
    throw error;
  }
};

// Delete a food item
export const deleteFoodItem = async (id: string) => {
  try {
    const foodItemRef = doc(db, 'food-items', id);
    const foodItemDoc = await getDoc(foodItemRef);
    
    if (!foodItemDoc.exists()) {
      throw new Error('Food item not found');
    }
    
    // Delete image from Storage if it exists
    const foodItemData = foodItemDoc.data();
    if (foodItemData.imageUrl) {
      try {
        const imageRef = ref(storage, foodItemData.imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn("Error deleting image:", error);
      }
    }
    
    // Delete document from Firestore
    await deleteDoc(foodItemRef);
    
    return id;
  } catch (error) {
    console.error("Error deleting food item: ", error);
    throw error;
  }
};

// Get all food items
export const getAllFoodItems = async () => {
  try {
    const q = query(foodItemsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as FoodItem;
    });
  } catch (error) {
    console.error("Error getting food items: ", error);
    throw error;
  }
};

// Get favorite food items
export const getFavoriteFoodItems = async () => {
  try {
    const q = query(
      foodItemsCollection, 
      where('favorite', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as FoodItem;
    });
  } catch (error) {
    console.error("Error getting favorite food items: ", error);
    throw error;
  }
};

// Get food items by category
export const getFoodItemsByCategory = async (category: string) => {
  try {
    const q = query(
      foodItemsCollection, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as FoodItem;
    });
  } catch (error) {
    console.error(`Error getting food items for category ${category}: `, error);
    throw error;
  }
};
