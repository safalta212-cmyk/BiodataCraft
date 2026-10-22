/**
 * Google AdSense Advertising Architecture Configuration (Phase 14)
 * 
 * Strict Google AdSense Policy Compliance:
 * 1. Monetization levels: STANDARD, TEMPLATE, ADVANCED.
 * 2. Actual ad delivery remains strictly controlled by Google AdSense servers.
 * 3. Never manipulate ad code or inject intrusive scripts.
 * 4. Never simulate clicks or fake impressions.
 * 5. Never label advertisements as "Download", "Play", or "Proceed" buttons.
 * 6. Never place ads where they can be accidentally clicked.
 * 7. Never block access to generated content if ads fail to deliver.
 * 8. Keep ad implementation strictly isolated from PDF generation.
 */

import { adSettingsService } from '../services/adSettingsService';

export type MonetizationLevel = 'STANDARD' | 'TEMPLATE' | 'ADVANCED';

export interface LevelConfig {
  level: MonetizationLevel;
  opportunityLevel: 1 | 2 | 3;
  label: string;
  description: string;
  showInterstitialArea: boolean;
  maxInlineUnits: number;
}

export interface AdSenseSlots {
  header: string;
  footer: string;
  inContent: string;
  downloadModal: string;
  sidebar: string;
  blogTop?: string;
  blogMiddle?: string;
  blogBottom?: string;
}

export interface AdConfigModel {
  /**
   * AdSense Publisher ID (e.g. "ca-pub-XXXXXXXXXXXXXXXX")
   */
  publisherId: string;
  /**
   * Whether ads are globally enabled
   */
  enabled: boolean;
  /**
   * True in development or when testing without real publisher credentials
   */
  isDevMode: boolean;
  /**
   * Slot IDs for specific placements
   */
  slots: AdSenseSlots;
  /**
   * Monetization levels definition
   */
  levels: Record<MonetizationLevel, LevelConfig>;
}

export const MONETIZATION_LEVELS: Record<MonetizationLevel, LevelConfig> = {
  STANDARD: {
    level: 'STANDARD',
    opportunityLevel: 1,
    label: 'Standard Creation Mode',
    description: 'Basic biodata generation using standard layout with minimal ad footprint.',
    showInterstitialArea: true,
    maxInlineUnits: 1
  },
  TEMPLATE: {
    level: 'TEMPLATE',
    opportunityLevel: 2,
    label: 'Template Creation Mode',
    description: 'Curated design template selection with standard wedding service placements.',
    showInterstitialArea: true,
    maxInlineUnits: 2
  },
  ADVANCED: {
    level: 'ADVANCED',
    opportunityLevel: 3,
    label: 'Advanced Creation Mode',
    description: 'Full custom fields, multi-page data, and personalized themes.',
    showInterstitialArea: true,
    maxInlineUnits: 3
  }
};

/**
 * AdConfig singleton providing unified access to advertising settings
 * Driven entirely by Admin-Controlled Firestore/Local Settings (Phase 14 & Blog Monetization)
 */
export const AdConfig = {
  levels: MONETIZATION_LEVELS,

  /**
   * Resolves the Google AdSense Publisher ID from admin-controlled configuration
   */
  getPublisherId(): string {
    const settings = adSettingsService.getSettings();
    return settings.adsenseClientId || '';
  },

  /**
   * Checks whether advertising is globally enabled
   */
  isEnabled(): boolean {
    const settings = adSettingsService.getSettings();
    return Boolean(settings.adsEnabled);
  },

  /**
   * Checks whether blog advertising is specifically enabled
   */
  isBlogAdsEnabled(): boolean {
    const settings = adSettingsService.getSettings();
    return Boolean(settings.adsEnabled && settings.blogAdsEnabled);
  },

  /**
   * Returns true if running in local development mode without a valid publisher ID
   */
  isDevelopmentPlaceholder(): boolean {
    const pubId = this.getPublisherId();
    const isValidPubId = pubId.startsWith('ca-pub-') && pubId.length >= 15;
    return !isValidPubId;
  },

  /**
   * Gets specific slot ID by placement key
   */
  getSlotId(placement: keyof AdSenseSlots | string, fallback = ''): string {
    const settings = adSettingsService.getSettings();

    switch (placement) {
      case 'header':
        return settings.adsenseSlotHeader || fallback;
      case 'footer':
        return settings.adsenseSlotFooter || fallback;
      case 'downloadModal':
      case 'download':
        return settings.adsenseSlotDownload || fallback;
      case 'blogTop':
        return settings.adsenseSlotBlogTop || fallback;
      case 'blogMiddle':
        return settings.adsenseSlotBlogMiddle || fallback;
      case 'blogBottom':
        return settings.adsenseSlotBlogBottom || fallback;
      default:
        return fallback;
    }
  },

  /**
   * Helper to retrieve level configuration
   */
  getLevelConfig(level: MonetizationLevel | string): LevelConfig {
    const key = (level || 'STANDARD').toUpperCase() as MonetizationLevel;
    return MONETIZATION_LEVELS[key] || MONETIZATION_LEVELS.STANDARD;
  }
};

