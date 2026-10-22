import { adSettingsService } from './adSettingsService';

export interface SocialLinks {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  trackingMode: 'anonymous'; // Enforce anonymous telemetry, no customer PII
  customMeasurementId?: string; // Public G-XXXXXXXXXX tag only
}

export interface AdConfig {
  adsEnabled: boolean;
  adClient: string; // ca-pub-XXXXXXXXXXXXXXXX (public client ID)
  adSlotHeader?: string;
  adSlotFooter?: string;
  adSlotDownload?: string;
  blogAdsEnabled?: boolean;
  adSlotBlogTop?: string;
  adSlotBlogMiddle?: string;
  adSlotBlogBottom?: string;
  monetizationLevel: 'standard' | 'template' | 'advanced';
}

export interface SiteSettings {
  siteName: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: SocialLinks;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  googleVerification: string;
  analyticsConfig: AnalyticsConfig;
  adConfig: AdConfig;
  footerText: string;
  announcementText: string;
  announcementActive: boolean;
  maintenanceMode: boolean;
}

// Backward-compatible AdminConfig
export interface AdminConfig {
  adsEnabled: boolean;
  monetizationLevel: 'standard' | 'template' | 'advanced';
  announcementText: string;
  announcementActive: boolean;
  maintenanceMode: boolean;
}

const ADMIN_TOKEN_KEY = 'biodatacraft_admin_session_token';
const ADMIN_CONFIG_KEY = 'biodatacraft_admin_config_v1';
const SITE_SETTINGS_KEY = 'biodatacraft_site_settings_v1';

const defaultSiteSettings: SiteSettings = {
  siteName: 'BiodataCraft',
  logo: '/favicon.svg',
  favicon: '/favicon.svg',
  contactEmail: 'contact@biodatacraft.in',
  contactPhone: '+91 98765 43210',
  socialLinks: {
    whatsapp: 'https://wa.me/919876543210',
    facebook: 'https://facebook.com/biodatacraft',
    instagram: 'https://instagram.com/biodatacraft',
    twitter: 'https://x.com/biodatacraft',
    youtube: 'https://youtube.com/@biodatacraft'
  },
  defaultSeoTitle: 'Free Indian Marriage Biodata Maker Online | BiodataCraft',
  defaultSeoDescription:
    'Create elegant Hindu, Jain, and Indian matrimonial biodata PDFs in 5 minutes with Vedic mantras, kundali details, and auspicious templates. 100% free with zero customer data storage.',
  googleVerification: 'google-site-verification-bdc-matrimonial-2026',
  analyticsConfig: {
    enabled: true,
    trackingMode: 'anonymous',
    customMeasurementId: 'G-BDCRAFT2026'
  },
  adConfig: {
    adsEnabled: false,
    adClient: '',
    adSlotHeader: '',
    adSlotFooter: '',
    adSlotDownload: '',
    blogAdsEnabled: false,
    adSlotBlogTop: '',
    adSlotBlogMiddle: '',
    adSlotBlogBottom: '',
    monetizationLevel: 'standard'
  },
  footerText:
    '© 2026 BiodataCraft. Auspicious Matrimonial Biodata Creator. All Rights Reserved. Design by Anwar Ansari.',
  announcementText: '✨ New Festival Special Templates Added! 100% Free Forever with Zero Registration.',
  announcementActive: true,
  maintenanceMode: false
};

// Patterns that indicate private or secret credentials
const FORBIDDEN_SECRET_KEY_PATTERNS = [
  /-----BEGIN\s+.*PRIVATE\s+KEY-----/i,
  /"private_key"\s*:\s*"/i,
  /"type"\s*:\s*"service_account"/i,
  /sk_live_[0-9a-zA-Z]{20,}/i,
  /AIzaSy[0-9a-zA-Z_-]{30,}/i, // Firebase web API key shouldn't be overridden with raw secrets in public settings
  /secret/i,
  /client_secret/i,
  /bearer\s+[a-zA-Z0-9_\-\.]{20,}/i
];

export const adminService = {
  isAuthenticated: (): boolean => {
    try {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      return Boolean(token && token.length > 8);
    } catch {
      return false;
    }
  },

  login: async (passcode: string): Promise<boolean> => {
    const validPass = import.meta.env.VITE_ADMIN_PASSCODE;
    if (validPass && passcode.trim() === validPass.trim()) {
      const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(ADMIN_TOKEN_KEY, sessionToken);
      return true;
    }
    return false;
  },

  logout: (): void => {
    try {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // Ignore
    }
  },

  // --- Site Settings Management ---

  getSettings: (): SiteSettings => {
    try {
      const stored = localStorage.getItem(SITE_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultSiteSettings,
          ...parsed,
          socialLinks: {
            ...defaultSiteSettings.socialLinks,
            ...(parsed.socialLinks || {})
          },
          analyticsConfig: {
            ...defaultSiteSettings.analyticsConfig,
            ...(parsed.analyticsConfig || {})
          },
          adConfig: {
            ...defaultSiteSettings.adConfig,
            ...(parsed.adConfig || {})
          }
        };
      }
    } catch {
      // Ignore
    }
    return defaultSiteSettings;
  },

  validateSettings: (settings: SiteSettings): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // 1. Site Name
    if (!settings.siteName || !settings.siteName.trim()) {
      errors.siteName = 'Site name is required.';
    }

    // 2. Contact Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!settings.contactEmail || !emailRegex.test(settings.contactEmail.trim())) {
      errors.contactEmail = 'Please provide a valid contact email address.';
    }

    // 3. Contact Phone
    if (settings.contactPhone && !/^\+?[0-9\s\-()]{7,20}$/.test(settings.contactPhone.trim())) {
      errors.contactPhone = 'Please provide a valid phone number (e.g. +91 98765 43210).';
    }

    // 4. Default SEO Title
    if (!settings.defaultSeoTitle || settings.defaultSeoTitle.trim().length < 10) {
      errors.defaultSeoTitle = 'Default SEO title should be at least 10 characters long.';
    } else if (settings.defaultSeoTitle.length > 70) {
      errors.defaultSeoTitle = 'Recommended SEO title length is under 70 characters for search engines.';
    }

    // 5. Default SEO Description
    if (!settings.defaultSeoDescription || settings.defaultSeoDescription.trim().length < 20) {
      errors.defaultSeoDescription = 'Default SEO description should be at least 20 characters long.';
    }

    // 6. Security Check: Never put secret/private API keys into public settings
    const checkFields = [
      settings.googleVerification,
      settings.analyticsConfig.customMeasurementId || '',
      settings.adConfig.adClient,
      settings.footerText,
      settings.announcementText
    ];

    for (const val of checkFields) {
      for (const pattern of FORBIDDEN_SECRET_KEY_PATTERNS) {
        if (pattern.test(val)) {
          errors.security =
            'CRITICAL SECURITY ALERT: Private or secret keys/tokens detected. Never put secret/private API keys into public site settings!';
          break;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  updateSettings: (newSettings: Partial<SiteSettings>): { success: boolean; errors?: Record<string, string> } => {
    const isAuthed = typeof window !== 'undefined' && Boolean(
      sessionStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem('biodatacraft_admin_token')
    );
    if (!isAuthed) {
      return {
        success: false,
        errors: { auth: 'Unauthorized: Admin authentication is required to update site settings.' }
      };
    }

    const current = adminService.getSettings();
    const merged: SiteSettings = {
      ...current,
      ...newSettings,
      socialLinks: {
        ...current.socialLinks,
        ...(newSettings.socialLinks || {})
      },
      analyticsConfig: {
        ...current.analyticsConfig,
        ...(newSettings.analyticsConfig || {})
      },
      adConfig: {
        ...current.adConfig,
        ...(newSettings.adConfig || {})
      }
    };

    const validation = adminService.validateSettings(merged);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    try {
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(merged));
      // Sync centralized adSettingsService
      adSettingsService.updateSettings({
        adsEnabled: merged.adConfig.adsEnabled,
        adsenseClientId: merged.adConfig.adClient,
        adsenseSlotHeader: merged.adConfig.adSlotHeader || '',
        adsenseSlotFooter: merged.adConfig.adSlotFooter || '',
        adsenseSlotDownload: merged.adConfig.adSlotDownload || '',
        blogAdsEnabled: merged.adConfig.blogAdsEnabled ?? true,
        adsenseSlotBlogTop: merged.adConfig.adSlotBlogTop || '',
        adsenseSlotBlogMiddle: merged.adConfig.adSlotBlogMiddle || '',
        adsenseSlotBlogBottom: merged.adConfig.adSlotBlogBottom || '',
        monetizationLevel: merged.adConfig.monetizationLevel
      });
      // Also sync legacy config
      adminService.updateConfig({
        adsEnabled: merged.adConfig.adsEnabled,
        monetizationLevel: merged.adConfig.monetizationLevel,
        announcementText: merged.announcementText,
        announcementActive: merged.announcementActive,
        maintenanceMode: merged.maintenanceMode
      });
      return { success: true };
    } catch {
      return {
        success: false,
        errors: { general: 'Failed to write settings to local storage.' }
      };
    }
  },

  // --- Backward-Compatible Config Helpers ---

  getConfig: (): AdminConfig => {
    try {
      const stored = localStorage.getItem(ADMIN_CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
    return {
      adsEnabled: defaultSiteSettings.adConfig.adsEnabled,
      monetizationLevel: defaultSiteSettings.adConfig.monetizationLevel,
      announcementText: defaultSiteSettings.announcementText,
      announcementActive: defaultSiteSettings.announcementActive,
      maintenanceMode: defaultSiteSettings.maintenanceMode
    };
  },

  updateConfig: (newConfig: Partial<AdminConfig>): AdminConfig => {
    const current = adminService.getConfig();
    const updated = { ...current, ...newConfig };
    try {
      localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return updated;
  }
};
