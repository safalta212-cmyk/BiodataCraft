import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

/**
 * Firebase Client Configuration
 * Strictly follows Core Principles:
 * - Admin Authentication only
 * - Anonymous operational telemetry only
 * - NEVER stores customer biodatas or photos
 * - Seamlessly integrates with AI Studio provisioned configuration
 */
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : ({} as any);

const firebaseConfig = {
  apiKey: appletConfig.apiKey || env.VITE_FIREBASE_API_KEY || '',
  authDomain: appletConfig.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: appletConfig.projectId || env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: appletConfig.storageBucket || env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: appletConfig.messagingSenderId || env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: appletConfig.appId || env.VITE_FIREBASE_APP_ID || '',
  firestoreDatabaseId: appletConfig.firestoreDatabaseId || env.VITE_FIREBASE_DATABASE_ID || ''
};

const isPlaceholder = (val: string) =>
  !val ||
  val.trim() === '' ||
  val.includes('your-') ||
  val.includes('your_') ||
  val.startsWith('TODO');

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  !isPlaceholder(firebaseConfig.apiKey) &&
  firebaseConfig.projectId &&
  !isPlaceholder(firebaseConfig.projectId)
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    // Connect to named Firestore database when provided in configuration
    db = firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
  }
}

// Backward-compatible lazy getter for storage (only loaded if admin explicitly uploads asset)
const getStorageInstance = async () => {
  if (!isConfigured || !app) return null;
  const { getStorage } = await import('firebase/storage');
  return getStorage(app);
};

export { app, auth, db, getStorageInstance, isConfigured, firebaseConfig };
