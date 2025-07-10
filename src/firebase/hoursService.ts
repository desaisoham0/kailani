import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface DayHours {
  day: string;
  hours: string;
  isOpen: boolean;
}

export interface HoursOfOperation {
  days: DayHours[];
  lastUpdated: Timestamp;
}

// Document reference
const hoursDocRef = doc(db, 'businessInfo', 'hours');

// Get hours of operation
export const getHoursOfOperation = async (): Promise<HoursOfOperation> => {
  try {
    const hoursDoc = await getDoc(hoursDocRef);

    if (hoursDoc.exists()) {
      return hoursDoc.data() as HoursOfOperation;
    } else {
      // Default hours if not found
      const defaultHours: HoursOfOperation = {
        days: [
          { day: 'Monday', hours: 'Closed', isOpen: false },
          { day: 'Tuesday', hours: '11:30 AM - 8:00 PM', isOpen: true },
          { day: 'Wednesday', hours: '11:30 AM - 8:00 PM', isOpen: true },
          { day: 'Thursday', hours: '11:30 AM - 8:00 PM', isOpen: true },
          { day: 'Friday', hours: '11:30 AM - 9:00 PM', isOpen: true },
          { day: 'Saturday', hours: '11:30 AM - 9:00 PM', isOpen: true },
          { day: 'Sunday', hours: '11:30 AM - 9:00 PM', isOpen: true },
        ],
        lastUpdated: Timestamp.now(),
      };

      // Create the hours document
      await setDoc(hoursDocRef, defaultHours);
      return defaultHours;
    }
  } catch (error) {
    console.error('Error getting hours of operation: ', error);
    throw error;
  }
};

// Update hours of operation
export const updateHoursOfOperation = async (
  hours: DayHours[]
): Promise<HoursOfOperation> => {
  try {
    const updatedHours: HoursOfOperation = {
      days: hours,
      lastUpdated: Timestamp.now(),
    };

    await setDoc(hoursDocRef, updatedHours);
    return updatedHours;
  } catch (error) {
    console.error('Error updating hours of operation: ', error);
    throw error;
  }
};
