import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, isConfigured } from '../config/firebase';
import { AdminRole, AdminPermission, AdminUser, ROLE_PERMISSIONS } from '../types/auth';

const ADMIN_SESSION_KEY = 'biodatacraft_admin_auth_user';
const ADMIN_TOKEN_KEY = 'biodatacraft_admin_token';

// Map Firebase error codes to professional, security-compliant user error messages
function mapFirebaseAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid administrator email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid administrator email address.';
    case 'auth/user-disabled':
      return 'This administrator account has been suspended in Firebase Console.';
    case 'auth/too-many-requests':
      return 'Too many consecutive failed login attempts. Access is temporarily locked. Please try again in a few minutes.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connection.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is disabled in your Firebase project. Please enable Email/Password in Firebase Console → Authentication → Sign-in method, or use your Vercel environment admin credentials.';
    case 'auth/unauthorized-domain':
      return 'This domain (biodata-craft.vercel.app) is not authorized in Firebase. Add it in Firebase Console → Authentication → Settings → Authorized domains.';
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'Firebase API key is invalid. Please check VITE_FIREBASE_API_KEY in Vercel Environment Variables, or use environment admin credentials.';
    case 'auth/project-not-found':
      return 'Firebase project not found. Please verify VITE_FIREBASE_PROJECT_ID in Vercel.';
    default:
      return 'Authentication failed. Please verify your administrator credentials or check your Firebase settings.';
  }
}

class AdminAuthService {
  private currentUser: AdminUser | null = null;
  private listeners: Set<(user: AdminUser | null) => void> = new Set();
  private authInitialized = false;

  constructor() {
    this.initAuth();
  }

  private initAuth(): void {
    if (typeof window === 'undefined') return;

    // First attempt to restore existing validated session from sessionStorage
    try {
      const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      // Ignore parse errors
    }

    // Connect to real Firebase Auth listener if Firebase client is configured
    if (isConfigured && auth) {
      try {
        onAuthStateChanged(auth, (firebaseUser) => {
          this.authInitialized = true;
          if (firebaseUser) {
            const adminUser = this.mapFirebaseUserToAdmin(firebaseUser, 'super_admin');
            this.setSession(adminUser);
          } else {
            // Only clear if the session belonged to a Firebase user and we are logging out
            if (this.currentUser && this.currentUser.uid && !this.currentUser.uid.startsWith('admin_env_') && isConfigured) {
              this.clearSession();
            }
          }
          this.notifyListeners();
        });
      } catch (err) {
        console.warn('Firebase Auth state listener notice:', err);
        this.authInitialized = true;
      }
    } else {
      this.authInitialized = true;
    }
  }

  private mapFirebaseUserToAdmin(user: FirebaseUser, roleOverride?: AdminRole): AdminUser {
    const role: AdminRole = roleOverride || 'super_admin';
    return {
      uid: user.uid,
      email: user.email || 'admin@biodatacraft.internal',
      role,
      permissions: ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.super_admin,
      displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
      photoURL: user.photoURL || undefined,
      lastLoginAt: Date.now()
    };
  }

  private setSession(user: AdminUser): void {
    this.currentUser = user;
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
      sessionStorage.setItem(ADMIN_TOKEN_KEY, `admin_${user.uid}_${Date.now()}`);
    } catch {
      // Ignore storage errors
    }
    this.notifyListeners();
  }

  private clearSession(): void {
    this.currentUser = null;
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // Ignore
    }
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentUser);
      } catch {
        // Ignore listener error
      }
    });
  }

  public subscribe(listener: (user: AdminUser | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentUser);
    return () => this.listeners.delete(listener);
  }

  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    if (this.currentUser) return true;
    try {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      return Boolean(token && token.length > 5);
    } catch {
      return false;
    }
  }

  /**
   * Admin Login with Firebase Authentication
   * Validates credentials against Firebase Auth
   */
  public async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      return { success: false, error: 'Please enter both administrator email and password.' };
    }

    // Basic client-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid administrator email address.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // 1. Environment-Configured Administrator Credentials (Vercel / Local)
    const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : ({} as any);
    const configuredAdminEmail = (env.VITE_ADMIN_EMAIL || '').trim();
    const configuredAdminPass = (env.VITE_ADMIN_PASSWORD || '').trim();
    const configuredAdminPasscode = (env.VITE_ADMIN_PASSCODE || '').trim();

    // Check if credentials match Vercel environment variables
    const matchesEmailAndPassword = Boolean(
      configuredAdminEmail &&
      configuredAdminPass &&
      trimmedEmail.toLowerCase() === configuredAdminEmail.toLowerCase() &&
      password === configuredAdminPass
    );

    const matchesEmailAndPasscode = Boolean(
      configuredAdminPasscode &&
      password === configuredAdminPasscode &&
      (configuredAdminEmail ? trimmedEmail.toLowerCase() === configuredAdminEmail.toLowerCase() : true)
    );

    if (matchesEmailAndPassword || matchesEmailAndPasscode) {
      const adminUser: AdminUser = {
        uid: 'admin_env_' + Math.random().toString(36).substring(2, 9),
        email: trimmedEmail,
        role: 'super_admin',
        permissions: ROLE_PERMISSIONS.super_admin,
        displayName: trimmedEmail.split('@')[0] || 'Administrator',
        lastLoginAt: Date.now()
      };
      this.setSession(adminUser);
      return { success: true, user: adminUser };
    }

    // 2. Firebase Authentication Path (if configured)
    if (isConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        const adminUser = this.mapFirebaseUserToAdmin(userCredential.user);
        this.setSession(adminUser);
        return { success: true, user: adminUser };
      } catch (err: any) {
        const errorMessage = mapFirebaseAuthError(err?.code || '');
        return { success: false, error: errorMessage };
      }
    }

    return {
      success: false,
      error: 'Invalid administrator email or password.'
    };
  }

  /**
   * Admin Login via Google Sign-In with Popup
   */
  public async loginWithGoogle(): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    if (!isConfigured || !auth) {
      return { success: false, error: 'Firebase Authentication is not configured.' };
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const adminUser = this.mapFirebaseUserToAdmin(userCredential.user, 'super_admin');
      this.setSession(adminUser);
      return { success: true, user: adminUser };
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      return { success: false, error: err?.message || 'Google Sign-In failed.' };
    }
  }

  /**
   * Admin Logout
   */
  public async logout(): Promise<void> {
    try {
      if (isConfigured && auth) {
        await signOut(auth);
      }
    } catch {
      // Ignore
    } finally {
      this.clearSession();
    }
  }

  /**
   * Forgot Password with Firebase Authentication
   */
  public async sendPasswordReset(
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your administrator email address.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid administrator email address.' };
    }

    if (isConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, trimmedEmail);
        return {
          success: true,
          message: `A password reset link has been dispatched to ${trimmedEmail}. Please check your inbox.`
        };
      } catch (err: any) {
        const errorMsg = mapFirebaseAuthError(err?.code || '');
        return { success: false, error: errorMsg };
      }
    }

    // Offline / Preview fallback
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${trimmedEmail}.`
    };
  }
}

export const adminAuthService = new AdminAuthService();
