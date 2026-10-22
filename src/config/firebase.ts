import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Firebase Client Configuration
 * Strictly follows Core Principles:
 * - Admin Authentication only
 * - Anonymous operational telemetry only
 * - NEVER stores customer biodatas or photos
 * - Configured purely via environment variables
 */
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : ({} as any);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
  }
} else {
  // Graceful fallback for local development or preview mode without cloud keys
  // Ensures Phase 1 foundation runs smoothly without throwing unhandled exceptions
}

// Backward-compatible lazy getter for storage (only loaded if admin explicitly uploads asset)
const getStorageInstance = async () => {
  if (!isConfigured || !app) return null;
  const { getStorage } = await import('firebase/storage');
  return getStorage(app);
};

export { app, auth, db, getStorageInstance, isConfigured };
