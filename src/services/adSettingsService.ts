import { AdSettings } from '../types/monetization';

const AD_SETTINGS_LOCAL_KEY = 'biodatacraft_ad_settings_v1';
const SETTINGS_COLLECTION = 'settings';
const ADS_DOC_ID = 'ads';

// Lazy loader for Firestore modules ensures initial page load has zero Firebase overhead
async function getFirestoreModules() {
  const [{ db, isConfigured }, { doc, getDoc, setDoc, serverTimestamp }] = await Promise.all([
    import('../config/firebase'),
    import('firebase/firestore')
  ]);
  return { db, isConfigured, doc, getDoc, setDoc, serverTimestamp };
}

export const defaultAdSettings: AdSettings = {
  adsEnabled: false,
  adsenseClientId: '',
  adsenseSlotHeader: '',
  adsenseSlotFooter: '',
  adsenseSlotDownload: '',
  blogAdsEnabled: false,
  adsenseSlotBlogTop: '',
  adsenseSlotBlogMiddle: '',
  adsenseSlotBlogBottom: '',
  monetizationLevel: 'standard'
};

class AdSettingsService {
  private cachedSettings: AdSettings | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache to prevent unnecessary Firestore reads
  private scriptLoaded: boolean = false;
  private loadedClientId: string = '';

  constructor() {
    this.cachedSettings = this.loadFromStorage();
  }

  /**
   * Reads from localStorage cache with migration fallback
   */
  private loadFromStorage(): AdSettings {
    try {
      const stored = localStorage.getItem(AD_SETTINGS_LOCAL_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultAdSettings,
          ...parsed
        };
      }
    } catch {
      // Fallback
    }

    // Controlled migration from existing site settings if present
    try {
      const siteSettingsStr = localStorage.getItem('biodatacraft_site_settings_v1');
      if (siteSettingsStr) {
        const site = JSON.parse(siteSettingsStr);
        if (site?.adConfig) {
          return {
            ...defaultAdSettings,
            adsEnabled: site.adConfig.adsEnabled ?? defaultAdSettings.adsEnabled,
            adsenseClientId: site.adConfig.adClient || defaultAdSettings.adsenseClientId,
            adsenseSlotHeader: site.adConfig.adSlotHeader || defaultAdSettings.adsenseSlotHeader,
            adsenseSlotFooter: site.adConfig.adSlotFooter || defaultAdSettings.adsenseSlotFooter,
            monetizationLevel: site.adConfig.monetizationLevel || defaultAdSettings.monetizationLevel
          };
        }
      }
    } catch {
      // Fallback
    }

    return defaultAdSettings;
  }

  /**
   * Synchronously returns cached ad settings (ideal for components and renders)
   */
  public getSettings(): AdSettings {
    if (!this.cachedSettings) {
      this.cachedSettings = this.loadFromStorage();
    }
    return this.cachedSettings;
  }

  /**
   * Asynchronously fetches settings from Firestore (settings/ads doc)
   * Falls back to local cached settings on network or permission issues.
   */
  public async fetchSettings(forceRefresh = false): Promise<AdSettings> {
    const now = Date.now();
    if (!forceRefresh && this.cachedSettings && now - this.lastFetchTime < this.CACHE_TTL_MS) {
      return this.cachedSettings;
    }

    try {
      const { db, isConfigured, doc, getDoc } = await getFirestoreModules();
      if (isConfigured && db) {
        const adsDocRef = doc(db, SETTINGS_COLLECTION, ADS_DOC_ID);
        const docSnap = await getDoc(adsDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const remoteSettings: AdSettings = {
            ...defaultAdSettings,
            adsEnabled: Boolean(data.adsEnabled),
            adsenseClientId: String(data.adsenseClientId || '').trim(),
            adsenseSlotHeader: String(data.adsenseSlotHeader || '').trim(),
            adsenseSlotFooter: String(data.adsenseSlotFooter || '').trim(),
            adsenseSlotDownload: String(data.adsenseSlotDownload || '').trim(),
            blogAdsEnabled: Boolean(data.blogAdsEnabled),
            adsenseSlotBlogTop: String(data.adsenseSlotBlogTop || '').trim(),
            adsenseSlotBlogMiddle: String(data.adsenseSlotBlogMiddle || '').trim(),
            adsenseSlotBlogBottom: String(data.adsenseSlotBlogBottom || '').trim(),
            monetizationLevel: data.monetizationLevel || 'standard',
            updatedAt: data.updatedAt
          };

          this.cachedSettings = remoteSettings;
          this.lastFetchTime = now;
          this.saveToStorage(remoteSettings);
          this.syncAdSenseScript(remoteSettings);
          return remoteSettings;
        }
      }
    } catch (err) {
      console.warn('Could not read remote ad settings from Firestore, using local fallback:', err);
    }

    const local = this.loadFromStorage();
    this.cachedSettings = local;
    this.lastFetchTime = now;
    this.syncAdSenseScript(local);
    return local;
  }

  /**
   * Updates settings in Firestore and local storage.
   * Only authenticated administrators are permitted to call this.
   */
  public async updateSettings(newSettings: Partial<AdSettings>): Promise<{ success: boolean; error?: string }> {
    const isAuthed = typeof window !== 'undefined' && Boolean(
      sessionStorage.getItem('biodatacraft_admin_token') ||
      sessionStorage.getItem('biodatacraft_admin_session_token') ||
      sessionStorage.getItem('biodatacraft_admin_auth_user')
    );
    if (!isAuthed) {
      return {
        success: false,
        error: 'Unauthorized: Administrator clearance required to update advertising configuration.'
      };
    }

    const current = this.getSettings();
    const merged: AdSettings = {
      ...current,
      ...newSettings,
      adsenseClientId: (newSettings.adsenseClientId !== undefined ? newSettings.adsenseClientId : current.adsenseClientId).trim(),
      adsenseSlotHeader: (newSettings.adsenseSlotHeader !== undefined ? newSettings.adsenseSlotHeader : current.adsenseSlotHeader).trim(),
      adsenseSlotFooter: (newSettings.adsenseSlotFooter !== undefined ? newSettings.adsenseSlotFooter : current.adsenseSlotFooter).trim(),
      adsenseSlotDownload: (newSettings.adsenseSlotDownload !== undefined ? newSettings.adsenseSlotDownload : current.adsenseSlotDownload).trim(),
      adsenseSlotBlogTop: (newSettings.adsenseSlotBlogTop !== undefined ? newSettings.adsenseSlotBlogTop : current.adsenseSlotBlogTop).trim(),
      adsenseSlotBlogMiddle: (newSettings.adsenseSlotBlogMiddle !== undefined ? newSettings.adsenseSlotBlogMiddle : current.adsenseSlotBlogMiddle).trim(),
      adsenseSlotBlogBottom: (newSettings.adsenseSlotBlogBottom !== undefined ? newSettings.adsenseSlotBlogBottom : current.adsenseSlotBlogBottom).trim()
    };

    // Client ID format validation if provided
    if (merged.adsenseClientId && !/^ca-pub-\d{10,24}$/i.test(merged.adsenseClientId)) {
      return {
        success: false,
        error: 'Invalid AdSense Client ID format. Expected "ca-pub-XXXXXXXXXXXXXXXX" (e.g., ca-pub-1234567890123456).'
      };
    }

    // Persist to local storage immediately
    this.cachedSettings = merged;
    this.lastFetchTime = Date.now();
    this.saveToStorage(merged);
    this.syncAdSenseScript(merged);

    // Persist to Firestore if configured
    try {
      const { db, isConfigured, doc, setDoc, serverTimestamp } = await getFirestoreModules();
      if (isConfigured && db) {
        const adsDocRef = doc(db, SETTINGS_COLLECTION, ADS_DOC_ID);
        await setDoc(adsDocRef, {
          adsEnabled: merged.adsEnabled,
          adsenseClientId: merged.adsenseClientId,
          adsenseSlotHeader: merged.adsenseSlotHeader,
          adsenseSlotFooter: merged.adsenseSlotFooter,
          adsenseSlotDownload: merged.adsenseSlotDownload,
          blogAdsEnabled: merged.blogAdsEnabled,
          adsenseSlotBlogTop: merged.adsenseSlotBlogTop,
          adsenseSlotBlogMiddle: merged.adsenseSlotBlogMiddle,
          adsenseSlotBlogBottom: merged.adsenseSlotBlogBottom,
          monetizationLevel: merged.monetizationLevel || 'standard',
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (err: any) {
      console.error('Failed to save ad settings to Firestore:', err);
      return {
        success: false,
        error: err?.message || 'Failed to save to Firestore. Verify administrator authorization.'
      };
    }

    return { success: true };
  }

  private saveToStorage(settings: AdSettings): void {
    try {
      localStorage.setItem(AD_SETTINGS_LOCAL_KEY, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }

  /**
   * Controlled single-script injector for Google AdSense
   * Only injects if adsEnabled is true, a valid client ID is present, and script isn't already loaded.
   */
  public syncAdSenseScript(settings: AdSettings = this.getSettings()): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const shouldLoad = settings.adsEnabled && Boolean(settings.adsenseClientId) && settings.adsenseClientId.startsWith('ca-pub-');

    if (!shouldLoad) return;

    if (this.scriptLoaded && this.loadedClientId === settings.adsenseClientId) {
      return;
    }

    const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);
    if (existingScript) {
      this.scriptLoaded = true;
      this.loadedClientId = settings.adsenseClientId;
      return;
    }

    try {
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(settings.adsenseClientId)}`;
      script.onerror = () => {
        console.warn('AdSense script failed to load (adblocker or network error). Non-blocking.');
      };
      document.head.appendChild(script);
      this.scriptLoaded = true;
      this.loadedClientId = settings.adsenseClientId;
    } catch {
      // Non-blocking
    }
  }
}

export const adSettingsService = new AdSettingsService();
