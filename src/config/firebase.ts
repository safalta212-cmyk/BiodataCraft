import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import rawConfig from '../../firebase-applet-config.json';

/**
 * Firebase Client Configuration
 * Strictly follows Core Principles:
 * - Admin Authentication only
 * - Anonymous operational telemetry only
 * - NEVER stores customer biodatas or photos
 * - Configured via firebase-applet-config.json and environment overrides
 */
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : ({} as any);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || rawConfig.apiKey || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId || '',
  appId: env.VITE_FIREBASE_APP_ID || rawConfig.appId || '',
  firestoreDatabaseId: rawConfig.firestoreDatabaseId || undefined,
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
let storage: FirebaseStorage | null = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    // CRITICAL: In AI Studio, named Firestore database must be passed to getFirestore
    db = firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Lazy/direct getter for Firebase Storage
const getStorageInstance = async () => {
  if (!isConfigured || !app) return null;
  if (!storage) {
    storage = getStorage(app);
  }
  return storage;
};

export { app, auth, db, storage, getStorageInstance, isConfigured, firebaseConfig };
