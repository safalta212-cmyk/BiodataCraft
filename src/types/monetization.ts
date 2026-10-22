export type CreationMode = 'STANDARD' | 'TEMPLATE' | 'ADVANCED';

export interface ModeMonetizationConfig {
  adOpportunityLevel: 1 | 2 | 3 | number;
  label: string;
  description: string;
}

export interface MonetizationConfig {
  standard: ModeMonetizationConfig;
  template: ModeMonetizationConfig;
  advanced: ModeMonetizationConfig;
}

/**
 * Phase 7: Application-level configuration model
 * IMPORTANT:
 * - These values represent the application's monetization-flow level only.
 * - Never guarantee that Google AdSense will serve exactly 1, 2 or 3 advertisements.
 * - Never manipulate Google ad code.
 * - Never simulate clicks.
 * - Never hide the actual download button behind advertisements.
 * - Never force users to click an advertisement.
 * - Never create fake ad impressions.
 */
export const MONETIZATION_CONFIG: MonetizationConfig = {
  standard: {
    adOpportunityLevel: 1,
    label: 'Standard Creation Mode',
    description: 'Basic biodata generation using standard layout with minimal ad opportunity level.'
  },
  template: {
    adOpportunityLevel: 2,
    label: 'Template Creation Mode',
    description: 'User selects a professionally curated design template.'
  },
  advanced: {
    adOpportunityLevel: 3,
    label: 'Advanced Creation Mode',
    description: 'User utilizes advanced custom fields, photo framing, multi-page, or personalized theme settings.'
  }
};

/**
 * Single source of truth for runtime advertising and blog monetization configuration
 */
export interface AdSettings {
  adsEnabled: boolean;
  adsenseClientId: string;

  adsenseSlotHeader: string;
  adsenseSlotFooter: string;
  adsenseSlotDownload: string;

  blogAdsEnabled: boolean;
  adsenseSlotBlogTop: string;
  adsenseSlotBlogMiddle: string;
  adsenseSlotBlogBottom: string;

  monetizationLevel?: 'standard' | 'template' | 'advanced';
  updatedAt?: any;
}

