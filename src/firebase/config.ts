// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, type Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { validateEnvironment, devLog, handleAsyncError } from '../utils/environment';

// Validate environment variables
try {
  validateEnvironment();
} catch (error) {
  console.error('❌ Environment validation failed:', error);
  throw error;
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore with modern persistence settings
let db: Firestore;

// Initialize synchronously with fallback
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  devLog.log('✅ Firestore initialized with persistent local cache (multi-tab)');
} catch (error) {
  devLog.warn('⚠️ Failed to initialize with cache, using default Firestore:', error);
  
  // If it's an IndexedDB issue, provide helpful message
  if (error instanceof Error && error.message.includes('indexeddb')) {
    devLog.warn('💡 To resolve cache issues, try clearing browser data (Application > Storage > Clear site data)');
  }
  
  handleAsyncError(error, 'Firestore cache initialization');
  db = getFirestore(app);
}

const storage = getStorage(app);

export { app, auth, db, storage };
