import { CreationMode, MONETIZATION_CONFIG, MonetizationConfig } from '../types/monetization';
import { BiodataData } from '../types/biodata';
import { analyticsService } from './analyticsService';
import { adminService } from './adminService';

export interface DownloadFlowSession {
  sessionId: string;
  mode: CreationMode;
  adLevel: number;
  startedAt: number;
  completedAt?: number;
  adOpportunityRendered: boolean;
}

/**
 * AdFlowService
 * Phase 7: Monetization Level System & Ad Opportunity Flow
 * 
 * Strict Compliance Rules:
 * 1. These values represent the application's monetization-flow level only.
 * 2. Never guarantee that Google AdSense will serve exactly 1, 2 or 3 advertisements.
 * 3. Never manipulate Google ad code.
 * 4. Never simulate clicks.
 * 5. Never hide the actual download button behind advertisements.
 * 6. Never force users to click an advertisement.
 * 7. Never create fake ad impressions.
 * 8. Do not block the PDF generation itself based on ad delivery.
 * 9. The user must always have a legitimate path to their generated document.
 */
export class AdFlowService {
  private static activeSession: DownloadFlowSession | null = null;
  public static readonly config: MonetizationConfig = MONETIZATION_CONFIG;

  /**
   * Retrieves the configured monetization-flow opportunity level (1, 2, or 3) for a given mode.
   * STANDARD -> 1
   * TEMPLATE -> 2
   * ADVANCED -> 3
   */
  public static getAdLevel(mode: CreationMode | string): number {
    const normalized = (mode || 'STANDARD').toUpperCase();
    switch (normalized) {
      case 'ADVANCED':
        return MONETIZATION_CONFIG.advanced.adOpportunityLevel;
      case 'TEMPLATE':
        return MONETIZATION_CONFIG.template.adOpportunityLevel;
      case 'STANDARD':
      default:
        return MONETIZATION_CONFIG.standard.adOpportunityLevel;
    }
  }

  /**
   * Automatically determines the application-level creation mode based on user's current BiodataData:
   * - ADVANCED: Custom fields present, photo config adjusted (zoom/rotation/non-default frame), or extensive multi-page data.
   * - TEMPLATE: Template selected other than basic default.
   * - STANDARD: Standard basic biodata layout.
   */
  public static detectCreationMode(data?: BiodataData): CreationMode {
    if (!data) return 'STANDARD';

    const hasCustomFields = Boolean(data.customFields && data.customFields.length > 0);
    const hasPhotoModifications = Boolean(
      data.photoConfig &&
      (data.photoConfig.zoom !== 1 ||
       data.photoConfig.rotate !== 0 ||
       data.photoConfig.frameStyle !== 'arch')
    );
    const hasExtendedSiblings = Boolean(
      (data.brothersList && data.brothersList.length >= 2) ||
      (data.sistersList && data.sistersList.length >= 2)
    );
    const hasCustomHeader = Boolean(
      data.customHeaderTitle &&
      data.customHeaderTitle !== '॥ श्री गणेशाय नमः ॥' &&
      data.customHeaderTitle !== 'MARRIAGE BIODATA'
    );

    if (hasCustomFields || hasPhotoModifications || hasExtendedSiblings || hasCustomHeader) {
      return 'ADVANCED';
    }

    if (data.templateId && data.templateId !== 'royal-heritage') {
      return 'TEMPLATE';
    }

    return 'STANDARD';
  }

  /**
   * Initiates a legitimate, policy-compliant download flow opportunity session.
   * Does NOT block or delay the user's PDF generation.
   */
  public static startDownloadFlow(mode: CreationMode | string = 'STANDARD'): DownloadFlowSession {
    const normalizedMode = (
      mode === 'ADVANCED' || mode === 'TEMPLATE' ? mode : 'STANDARD'
    ) as CreationMode;

    const adLevel = this.getAdLevel(normalizedMode);
    const sessionId = `adflow_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    this.activeSession = {
      sessionId,
      mode: normalizedMode,
      adLevel,
      startedAt: Date.now(),
      adOpportunityRendered: false
    };

    // Track legitimate analytics event
    analyticsService.trackEvent('download_flow_started', {
      mode: normalizedMode,
      adLevel,
      sessionId
    });

    return this.activeSession;
  }

  /**
   * Completes the download flow session once the document is generated/downloaded.
   */
  public static completeDownloadFlow(): void {
    if (this.activeSession) {
      this.activeSession.completedAt = Date.now();
      const durationMs = this.activeSession.completedAt - this.activeSession.startedAt;

      analyticsService.trackEvent('download_flow_completed', {
        mode: this.activeSession.mode,
        adLevel: this.activeSession.adLevel,
        sessionId: this.activeSession.sessionId,
        durationMs
      });

      this.activeSession = null;
    }
  }

  /**
   * Retrieves the current active flow session if one is in progress
   */
  public static getActiveSession(): DownloadFlowSession | null {
    return this.activeSession;
  }

  /**
   * Marks that an ad opportunity container was cleanly mounted in compliance with policies
   */
  public static markAdOpportunityRendered(): void {
    if (this.activeSession) {
      this.activeSession.adOpportunityRendered = true;
    }
  }

  /**
   * Checks if ads are enabled platform-wide via admin configuration
   */
  public static isAdvertisingEnabled(): boolean {
    const config = adminService.getConfig();
    return config.adsEnabled !== false;
  }
}

// Standalone function exports matching requirement specification
export const getAdLevel = (mode: CreationMode | string) => AdFlowService.getAdLevel(mode);
export const startDownloadFlow = (mode: CreationMode | string) => AdFlowService.startDownloadFlow(mode);
export const completeDownloadFlow = () => AdFlowService.completeDownloadFlow();
