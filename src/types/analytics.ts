/**
 * Privacy-Conscious Analytics Event Schema & Types
 * Strictly anonymous telemetry. Zero customer PII (No names, phones, addresses, photos, or biodata).
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'template_view'
  | 'template_selected'
  | 'builder_started'
  | 'builder_step_completed'
  | 'preview_generated'
  | 'pdf_generation_started'
  | 'pdf_generation_completed'
  | 'download_requested'
  | 'download_completed'
  | 'session_started'
  // Existing legacy events supported for backward compatibility
  | 'download_pdf'
  | 'download_png'
  | 'print_biodata'
  | 'create_page_view'
  | 'start_fresh_click'
  | 'load_sample_home'
  | 'load_sample_builder'
  | 'edit_sample_clicked'
  | 'download_flow_started'
  | 'download_flow_completed';

export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

export type BrowserCategory =
  | 'Chrome'
  | 'Safari'
  | 'Firefox'
  | 'Edge'
  | 'Opera'
  | 'Samsung Internet'
  | 'Other';

export type TrafficSourceCategory =
  | 'Direct'
  | 'Google Search'
  | 'Search Engine'
  | 'WhatsApp'
  | 'Social Media'
  | 'Referral'
  | string;

export interface AnonymousAnalyticsEvent {
  eventId: string;
  eventName: AnalyticsEventType;
  timestamp: number;
  anonymousVisitorId: string;
  anonymousSessionId: string;
  deviceCategory: DeviceCategory;
  browserCategory: BrowserCategory;
  trafficSource: string;
  // Strictly non-PII metadata (e.g. templateId, format, stepNumber, mode, language)
  metadata?: Record<string, unknown>;
  // Legacy fields for backward compatibility
  templateId?: string;
  language?: string;
  page?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  screenResolution?: string;
  mode?: string;
}

export interface PopularTemplateItem {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface DailyMetricPoint {
  date: string; // YYYY-MM-DD
  label: string; // e.g. "Oct 4" or "Sun, Oct 4"
  visitors: number;
  pageViews: number;
  biodataGenerations: number;
  downloads: number;
  downloadsPdf: number;
  downloadsPng: number;
  downloadsPrint: number;
}

export interface AggregateStats {
  // Primary Metrics
  visitors: number; // Unique anonymous visitor browser instances
  pageViews: number; // Total page views
  builderStarts: number; // Count of builder started
  biodataGenerations: number; // Total PDF/high-res creations
  downloads: number; // Total downloads completed

  // Phase 10 Dashboard Specific Metrics
  visitorsToday: number;
  pageViewsToday: number;
  biodataCreatedToday: number;
  downloadsToday: number;
  visitorsThisMonth: number;
  downloadsThisMonth: number;

  // Breakdown metrics
  downloadsBreakdown: {
    pdf: number;
    png: number;
    print: number;
  };
  builderStepsCompleted: Record<number, number>;
  previewGenerations: number;
  templateViews: number;
  templateSelections: number;

  // Distributions
  templateUsage: Record<string, number>;
  popularTemplates: PopularTemplateItem[];
  deviceCategory: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  browserCategory: Record<string, number>;
  trafficSource: Record<string, number>;

  // Daily Time Series for Charts
  dailyTimeSeries: DailyMetricPoint[];

  // Backward-compatible fields
  totalVisits: number;
  totalPdfDownloads: number;
  totalPngDownloads: number;
  totalPrints: number;
  languageCounts: Record<string, number>;
  deviceCounts: Record<string, number>;

  // Privacy-safe recent anonymous event trail (capped to 50 items)
  recentEvents: AnonymousAnalyticsEvent[];
}
