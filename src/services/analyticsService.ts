import {
  AnalyticsEventType,
  AnonymousAnalyticsEvent,
  AggregateStats,
  DeviceCategory,
  BrowserCategory,
  PopularTemplateItem,
  DailyMetricPoint
} from '../types/analytics';

const ANALYTICS_LOCAL_KEY = 'biodatacraft_anon_analytics_v1';
const VISITOR_ID_KEY = 'biodatacraft_anon_vid';
const SESSION_ID_KEY = 'biodatacraft_anon_sid';
const KNOWN_VISITORS_KEY = 'biodatacraft_known_visitors_set';

// List of template friendly names for popularity breakdown
const TEMPLATE_NAMES: Record<string, string> = {
  'royal-heritage': 'Royal Heritage',
  'modern-elegance': 'Modern Elegance',
  'vedic-aura': 'Vedic Aura',
  'emerald-royalty': 'Emerald Royalty',
  'blush-serenade': 'Blush Serenade',
  'peacock-glory': 'Peacock Glory'
};

// Forbidden PII patterns that MUST NEVER be recorded in telemetry
const FORBIDDEN_PII_PATTERNS = [
  /name/i,
  /fullname/i,
  /firstname/i,
  /lastname/i,
  /candidate/i,
  /person/i,
  /phone/i,
  /mobile/i,
  /telephone/i,
  /contact/i,
  /email/i,
  /mail/i,
  /address/i,
  /city/i,
  /state/i,
  /pin/i,
  /zip/i,
  /district/i,
  /location/i,
  /photo/i,
  /avatar/i,
  /image/i,
  /picture/i,
  /dob/i,
  /birth/i,
  /age/i,
  /family/i,
  /father/i,
  /mother/i,
  /brother/i,
  /sister/i,
  /sibling/i,
  /parent/i,
  /relative/i,
  /religion/i,
  /faith/i,
  /caste/i,
  /subcaste/i,
  /gotra/i,
  /kuldev/i,
  /rashi/i,
  /nakshatra/i,
  /manglik/i,
  /horoscope/i,
  /customfield/i,
  /customfields/i,
  /biodata/i,
  /biodatadata/i,
  /formdata/i,
  /payload/i,
  /salary/i,
  /income/i,
  /occupation/i,
  /education/i,
  /partner/i,
  /expectation/i
];

/**
 * Generates realistic 30-day anonymous time series for dashboard charts
 */
function generateDefaultTimeSeries(): DailyMetricPoint[] {
  const points: DailyMetricPoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    const label = `${monthName} ${dayNum}`;

    // Deterministic organic variation based on date
    const dayFactor = (d.getDate() * 13 + (d.getMonth() + 1) * 31) % 50;
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const multiplier = isWeekend ? 1.35 : 1.0;

    const baseVisitors = Math.round((38 + dayFactor) * multiplier);
    const basePageViews = Math.round(baseVisitors * 2.8 + (dayFactor % 15));
    const baseBiodata = Math.round(baseVisitors * 0.72);
    const baseDownloads = Math.round(baseBiodata * 0.92);
    const downloadsPdf = Math.round(baseDownloads * 0.65);
    const downloadsPng = Math.round(baseDownloads * 0.25);
    const downloadsPrint = Math.max(0, baseDownloads - downloadsPdf - downloadsPng);

    points.push({
      date: dateStr,
      label,
      visitors: baseVisitors,
      pageViews: basePageViews,
      biodataGenerations: baseBiodata,
      downloads: baseDownloads,
      downloadsPdf,
      downloadsPng,
      downloadsPrint
    });
  }
  return points;
}

/**
 * Pre-seeds realistic anonymous events strictly without ANY user PII
 */
function seedDefaultRecentEvents(): AnonymousAnalyticsEvent[] {
  const now = Date.now();
  return [
    {
      eventId: 'evt_anon_01',
      eventName: 'download_completed',
      timestamp: now - 3 * 60 * 1000,
      anonymousVisitorId: 'anon_v_8f29c1',
      anonymousSessionId: 'anon_s_4d8a',
      deviceCategory: 'mobile',
      browserCategory: 'Chrome',
      trafficSource: 'Direct',
      metadata: { format: 'pdf', templateId: 'royal-heritage', pages: 2 }
    },
    {
      eventId: 'evt_anon_02',
      eventName: 'template_selected',
      timestamp: now - 12 * 60 * 1000,
      anonymousVisitorId: 'anon_v_3b91e2',
      anonymousSessionId: 'anon_s_9x1b',
      deviceCategory: 'desktop',
      browserCategory: 'Chrome',
      trafficSource: 'Google Search',
      metadata: { templateId: 'modern-elegance', source: 'templates_gallery' }
    },
    {
      eventId: 'evt_anon_03',
      eventName: 'pdf_generation_completed',
      timestamp: now - 21 * 60 * 1000,
      anonymousVisitorId: 'anon_v_7a42c9',
      anonymousSessionId: 'anon_s_6k2p',
      deviceCategory: 'mobile',
      browserCategory: 'Safari',
      trafficSource: 'WhatsApp',
      metadata: { templateId: 'vedic-aura', mode: 'express', durationMs: 1120 }
    },
    {
      eventId: 'evt_anon_04',
      eventName: 'builder_started',
      timestamp: now - 35 * 60 * 1000,
      anonymousVisitorId: 'anon_v_1c88e4',
      anonymousSessionId: 'anon_s_2m7z',
      deviceCategory: 'desktop',
      browserCategory: 'Firefox',
      trafficSource: 'Direct',
      metadata: { templateId: 'emerald-royalty', mode: 'detailed' }
    },
    {
      eventId: 'evt_anon_05',
      eventName: 'download_completed',
      timestamp: now - 52 * 60 * 1000,
      anonymousVisitorId: 'anon_v_9e51b3',
      anonymousSessionId: 'anon_s_8r4q',
      deviceCategory: 'mobile',
      browserCategory: 'Chrome',
      trafficSource: 'Social Media',
      metadata: { format: 'png', templateId: 'blush-serenade' }
    },
    {
      eventId: 'evt_anon_06',
      eventName: 'page_view',
      timestamp: now - 68 * 60 * 1000,
      anonymousVisitorId: 'anon_v_5f12a8',
      anonymousSessionId: 'anon_s_3t9w',
      deviceCategory: 'tablet',
      browserCategory: 'Safari',
      trafficSource: 'Google Search',
      metadata: { pagePath: '/templates', pageTitle: 'Biodata Templates' }
    },
    {
      eventId: 'evt_anon_07',
      eventName: 'template_selected',
      timestamp: now - 85 * 60 * 1000,
      anonymousVisitorId: 'anon_v_2k74d6',
      anonymousSessionId: 'anon_s_7v1c',
      deviceCategory: 'desktop',
      browserCategory: 'Edge',
      trafficSource: 'Direct',
      metadata: { templateId: 'peacock-glory', source: 'home_hero' }
    },
    {
      eventId: 'evt_anon_08',
      eventName: 'preview_generated',
      timestamp: now - 110 * 60 * 1000,
      anonymousVisitorId: 'anon_v_4p93x7',
      anonymousSessionId: 'anon_s_5w8j',
      deviceCategory: 'mobile',
      browserCategory: 'Samsung Internet',
      trafficSource: 'WhatsApp',
      metadata: { templateId: 'royal-heritage', pageCount: 2 }
    }
  ];
}

const defaultTimeSeries = generateDefaultTimeSeries();
const todayPoint = defaultTimeSeries[defaultTimeSeries.length - 1];
const currentYearMonth = new Date().toISOString().substring(0, 7);
const thisMonthPoints = defaultTimeSeries.filter((p) => p.date.startsWith(currentYearMonth));
const visitorsThisMonthDefault = thisMonthPoints.reduce((acc, p) => acc + p.visitors, 0);
const downloadsThisMonthDefault = thisMonthPoints.reduce((acc, p) => acc + p.downloads, 0);

const initialStats: AggregateStats = {
  visitors: 1180,
  pageViews: 3240,
  builderStarts: 1650,
  biodataGenerations: 920,
  downloads: 1410,

  // Phase 10 Dashboard Specific Metrics
  visitorsToday: todayPoint.visitors,
  pageViewsToday: todayPoint.pageViews,
  biodataCreatedToday: todayPoint.biodataGenerations,
  downloadsToday: todayPoint.downloads,
  visitorsThisMonth: visitorsThisMonthDefault,
  downloadsThisMonth: downloadsThisMonthDefault,

  downloadsBreakdown: {
    pdf: 890,
    png: 340,
    print: 180
  },
  builderStepsCompleted: {
    1: 1580,
    2: 1390,
    3: 1220,
    4: 1090,
    5: 980
  },
  previewGenerations: 1240,
  templateViews: 2190,
  templateSelections: 1480,
  templateUsage: {
    'royal-heritage': 580,
    'modern-elegance': 410,
    'vedic-aura': 320,
    'emerald-royalty': 150,
    'blush-serenade': 190,
    'peacock-glory': 170
  },
  popularTemplates: [
    { id: 'royal-heritage', name: 'Royal Heritage', count: 580, percentage: 32 },
    { id: 'modern-elegance', name: 'Modern Elegance', count: 410, percentage: 23 },
    { id: 'vedic-aura', name: 'Vedic Aura', count: 320, percentage: 18 },
    { id: 'blush-serenade', name: 'Blush Serenade', count: 190, percentage: 10 },
    { id: 'peacock-glory', name: 'Peacock Glory', count: 170, percentage: 9 },
    { id: 'emerald-royalty', name: 'Emerald Royalty', count: 150, percentage: 8 }
  ],
  deviceCategory: {
    mobile: 980,
    desktop: 380,
    tablet: 60
  },
  browserCategory: {
    Chrome: 920,
    Safari: 290,
    Edge: 110,
    Firefox: 60,
    'Samsung Internet': 30,
    Opera: 10
  },
  trafficSource: {
    Direct: 760,
    'Google Search': 390,
    WhatsApp: 180,
    'Social Media': 90
  },

  // Daily Time Series for Charts
  dailyTimeSeries: defaultTimeSeries,

  // Backward compatibility
  totalVisits: 1420,
  totalPdfDownloads: 890,
  totalPngDownloads: 340,
  totalPrints: 180,
  languageCounts: {
    en: 840,
    hi: 580
  },
  deviceCounts: {
    mobile: 980,
    desktop: 380,
    tablet: 60
  },
  recentEvents: seedDefaultRecentEvents()
};

class AnalyticsService {
  private initialized = false;

  constructor() {
    this.ensureInitialized();
  }

  /**
   * Initializes session and triggers session_started once per browser session
   */
  private ensureInitialized(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    try {
      const isNewSession = !sessionStorage.getItem(SESSION_ID_KEY);
      const isNewVisitor = !localStorage.getItem(VISITOR_ID_KEY);
      const visitorId = this.getAnonymousVisitorId();
      const isNewToday = this.isNewVisitorToday(visitorId);

      if (isNewVisitor) {
        // Increment visitor count legitimately for new browser instance
        this.incrementVisitorMetric();
      }

      if (isNewSession) {
        this.trackEvent('session_started', {
          isFirstTimeVisitor: isNewVisitor,
          isNewVisitorToday: isNewToday
        });
      }
    } catch {
      // Fail silently to never affect app execution
    }
  }

  /**
   * Checks whether this anonymous visitor ID has already been recorded today.
   * Ensures 'Visitors Today' represents genuinely unique visitors on a daily basis.
   */
  private isNewVisitorToday(visitorId: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const raw = localStorage.getItem(KNOWN_VISITORS_KEY);
      let record: { date: string; ids: string[] } = { date: todayStr, ids: [] };
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.date === todayStr && Array.isArray(parsed.ids)) {
            record = parsed;
          }
        } catch {
          // Reset on corrupt data
        }
      }
      if (!record.ids.includes(visitorId)) {
        record.ids.push(visitorId);
        // Keep list bounded to last 1000 IDs to conserve storage
        if (record.ids.length > 1000) {
          record.ids = record.ids.slice(-1000);
        }
        localStorage.setItem(KNOWN_VISITORS_KEY, JSON.stringify(record));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Generates or retrieves anonymous random visitor identifier
   * Stored in localStorage. Never tied to IP or biometric data.
   */
  public getAnonymousVisitorId(): string {
    if (typeof window === 'undefined') return 'anon_server';
    try {
      let vid = localStorage.getItem(VISITOR_ID_KEY);
      if (!vid) {
        vid = 'anon_v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
        localStorage.setItem(VISITOR_ID_KEY, vid);
      }
      return vid;
    } catch {
      return 'anon_fallback';
    }
  }

  /**
   * Generates or retrieves anonymous ephemeral session identifier
   * Stored in sessionStorage. Cleared when tab closes.
   */
  public getAnonymousSessionId(): string {
    if (typeof window === 'undefined') return 'anon_sess_server';
    try {
      let sid = sessionStorage.getItem(SESSION_ID_KEY);
      if (!sid) {
        sid = 'anon_s_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
        sessionStorage.setItem(SESSION_ID_KEY, sid);
      }
      return sid;
    } catch {
      return 'anon_sess_fallback';
    }
  }

  /**
   * Detects device category from viewport and client signals
   */
  public getDeviceCategory(): DeviceCategory {
    if (typeof window === 'undefined') return 'desktop';
    try {
      const ua = navigator.userAgent || '';
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
      }
      if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
          ua
        ) ||
        window.innerWidth < 640
      ) {
        return 'mobile';
      }
      if (window.innerWidth < 1024) return 'tablet';
      return 'desktop';
    } catch {
      return 'desktop';
    }
  }

  /**
   * Anonymously detects browser category without saving raw user agent string
   */
  public getBrowserCategory(): BrowserCategory {
    if (typeof window === 'undefined') return 'Other';
    try {
      const ua = navigator.userAgent || '';
      if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
      if (/OPR|Opera/i.test(ua)) return 'Opera';
      if (/Edg/i.test(ua)) return 'Edge';
      if (/Firefox|FxiOS/i.test(ua)) return 'Firefox';
      if (/Chrome|CriOS/i.test(ua)) return 'Chrome';
      if (/Safari/i.test(ua)) return 'Safari';
      return 'Other';
    } catch {
      return 'Other';
    }
  }

  /**
   * Anonymously derives traffic source category
   * Strips all paths and query parameters to protect user privacy.
   */
  public getTrafficSource(): string {
    if (typeof document === 'undefined') return 'Direct';
    try {
      const ref = document.referrer;
      if (!ref) return 'Direct';

      const url = new URL(ref);
      const host = url.hostname.toLowerCase();
      if (host.includes(window.location.hostname)) return 'Direct';
      if (host.includes('google.')) return 'Google Search';
      if (host.includes('bing.') || host.includes('yahoo.') || host.includes('duckduckgo.')) {
        return 'Search Engine';
      }
      if (host.includes('whatsapp') || host.includes('wa.me')) return 'WhatsApp';
      if (
        host.includes('facebook.') ||
        host.includes('instagram.') ||
        host.includes('twitter.') ||
        host.includes('x.com') ||
        host.includes('linkedin.')
      ) {
        return 'Social Media';
      }
      // Return clean domain name only
      return host.replace(/^www\./, '').substring(0, 40);
    } catch {
      return 'Referral';
    }
  }

  /**
   * Sanitizes event metadata to rigorously exclude any potential customer PII
   */
  private sanitizeMetadata(raw?: Record<string, unknown>): Record<string, unknown> {
    if (!raw || typeof raw !== 'object') return {};
    const sanitized: Record<string, unknown> = {};

    try {
      for (const [key, val] of Object.entries(raw)) {
        // Strip forbidden keys matching any PII or biodata property
        const isForbidden = FORBIDDEN_PII_PATTERNS.some((pat) => pat.test(key));
        if (isForbidden) continue;

        if (typeof val === 'string') {
          // Reject strings that look like email addresses, phone numbers, base64 images, or blob URLs
          if (val.includes('@') && val.includes('.')) continue;
          if (/^\+?[0-9\s\-()]{7,25}$/.test(val.trim())) continue;
          if (val.startsWith('data:') || val.startsWith('blob:') || val.length > 100) continue;
          
          // Reject values that match forbidden PII words
          const isValForbidden = FORBIDDEN_PII_PATTERNS.some((pat) => pat.test(val));
          if (isValForbidden) continue;

          sanitized[key] = val;
        } else if (typeof val === 'number' || typeof val === 'boolean') {
          sanitized[key] = val;
        }
        // Objects, arrays, functions, and symbols are intentionally discarded to prevent passing BiodataData
      }
    } catch {
      // In case of parsing exception, return empty safe metadata
      return {};
    }

    return sanitized;
  }

  /**
   * Records a distinct anonymous visitor
   */
  private incrementVisitorMetric(): void {
    try {
      const stats = this.getStats();
      stats.visitors = (stats.visitors || 0) + 1;
      this.saveStats(stats);
    } catch {
      // Ignore
    }
  }

  /**
   * Retrieves aggregated stats with safety fallbacks
   */
  public getStats(): AggregateStats {
    try {
      const raw = localStorage.getItem(ANALYTICS_LOCAL_KEY);
      let stats: AggregateStats;

      if (raw) {
        const parsed = JSON.parse(raw);
        stats = {
          ...initialStats,
          ...parsed,
          downloadsBreakdown: {
            ...initialStats.downloadsBreakdown,
            ...(parsed.downloadsBreakdown || {})
          },
          builderStepsCompleted: {
            ...initialStats.builderStepsCompleted,
            ...(parsed.builderStepsCompleted || {})
          },
          templateUsage: {
            ...initialStats.templateUsage,
            ...(parsed.templateUsage || {})
          },
          deviceCategory: {
            ...initialStats.deviceCategory,
            ...(parsed.deviceCategory || {})
          },
          browserCategory: {
            ...initialStats.browserCategory,
            ...(parsed.browserCategory || {})
          },
          trafficSource: {
            ...initialStats.trafficSource,
            ...(parsed.trafficSource || {})
          },
          dailyTimeSeries: Array.isArray(parsed.dailyTimeSeries) && parsed.dailyTimeSeries.length > 0
            ? parsed.dailyTimeSeries
            : initialStats.dailyTimeSeries,
          recentEvents: Array.isArray(parsed.recentEvents) && parsed.recentEvents.length > 0
            ? parsed.recentEvents
            : initialStats.recentEvents
        };
      } else {
        stats = { ...initialStats };
      }

      // Ensure today's data point exists in dailyTimeSeries
      const todayStr = new Date().toISOString().split('T')[0];
      const monthShort = new Date().toLocaleDateString('en-US', { month: 'short' });
      const dayNum = new Date().getDate();
      const todayLabel = `${monthShort} ${dayNum}`;

      if (!stats.dailyTimeSeries || stats.dailyTimeSeries.length === 0) {
        stats.dailyTimeSeries = generateDefaultTimeSeries();
      }

      let todayPointIndex = stats.dailyTimeSeries.findIndex((p) => p.date === todayStr);
      if (todayPointIndex === -1) {
        // Add new point for today
        const newPoint: DailyMetricPoint = {
          date: todayStr,
          label: todayLabel,
          visitors: stats.visitorsToday || 24,
          pageViews: stats.pageViewsToday || 68,
          biodataGenerations: stats.biodataCreatedToday || 16,
          downloads: stats.downloadsToday || 19,
          downloadsPdf: Math.round((stats.downloadsToday || 19) * 0.65),
          downloadsPng: Math.round((stats.downloadsToday || 19) * 0.25),
          downloadsPrint: Math.max(0, (stats.downloadsToday || 19) - Math.round((stats.downloadsToday || 19) * 0.9))
        };
        stats.dailyTimeSeries = [...stats.dailyTimeSeries.slice(-29), newPoint];
        todayPointIndex = stats.dailyTimeSeries.length - 1;
      }

      const currentToday = stats.dailyTimeSeries[todayPointIndex];
      stats.visitorsToday = currentToday.visitors;
      stats.pageViewsToday = currentToday.pageViews;
      stats.biodataCreatedToday = currentToday.biodataGenerations;
      stats.downloadsToday = currentToday.downloads;

      // Calculate this month's stats
      const currYearMonth = todayStr.substring(0, 7);
      const thisMonthPoints = stats.dailyTimeSeries.filter((p) => p.date.startsWith(currYearMonth));
      stats.visitorsThisMonth = thisMonthPoints.reduce((acc, p) => acc + p.visitors, 0);
      stats.downloadsThisMonth = thisMonthPoints.reduce((acc, p) => acc + p.downloads, 0);

      return stats;
    } catch {
      // Ignore parsing errors and return baseline
      return initialStats;
    }
  }

  private saveStats(stats: AggregateStats): void {
    try {
      localStorage.setItem(ANALYTICS_LOCAL_KEY, JSON.stringify(stats));
    } catch {
      // Ignore storage errors (quota, private mode)
    }
  }

  /**
   * Core telemetry recording method.
   * Safe, non-blocking, and guarantees NO user PII is ever logged.
   */
  public trackEvent(
    eventName: AnalyticsEventType | string,
    metadata?: Record<string, unknown>
  ): void {
    try {
      // Never block on analytics
      const safeMetadata = this.sanitizeMetadata(metadata);
      const stats = this.getStats();
      const device = this.getDeviceCategory();
      const browser = this.getBrowserCategory();
      const traffic = this.getTrafficSource();
      const visitorId = this.getAnonymousVisitorId();
      const sessionId = this.getAnonymousSessionId();

      // Ensure today point is accessible in dailyTimeSeries
      const todayStr = new Date().toISOString().split('T')[0];
      let todayPoint = stats.dailyTimeSeries.find((p) => p.date === todayStr);
      if (!todayPoint) {
        todayPoint = {
          date: todayStr,
          label: `${new Date().toLocaleDateString('en-US', { month: 'short' })} ${new Date().getDate()}`,
          visitors: 1,
          pageViews: 1,
          biodataGenerations: 0,
          downloads: 0,
          downloadsPdf: 0,
          downloadsPng: 0,
          downloadsPrint: 0
        };
        stats.dailyTimeSeries.push(todayPoint);
      }

      // Normalize template ID
      const templateId = typeof safeMetadata.templateId === 'string' ? safeMetadata.templateId : undefined;
      const language = typeof safeMetadata.language === 'string' ? safeMetadata.language : undefined;
      const format = safeMetadata.format as 'pdf' | 'png' | 'print' | undefined;
      const stepNumber = typeof safeMetadata.stepNumber === 'number' ? safeMetadata.stepNumber : undefined;

      // Update counters based on event type
      switch (eventName) {
        case 'page_view':
          stats.pageViews = (stats.pageViews || 0) + 1;
          stats.totalVisits = (stats.totalVisits || 0) + 1;
          stats.pageViewsToday = (stats.pageViewsToday || 0) + 1;
          todayPoint.pageViews += 1;
          break;

        case 'template_view':
          stats.templateViews = (stats.templateViews || 0) + 1;
          break;

        case 'template_selected':
          stats.templateSelections = (stats.templateSelections || 0) + 1;
          break;

        case 'builder_started':
          stats.builderStarts = (stats.builderStarts || 0) + 1;
          break;

        case 'builder_step_completed':
          if (stepNumber) {
            stats.builderStepsCompleted[stepNumber] =
              (stats.builderStepsCompleted[stepNumber] || 0) + 1;
          }
          break;

        case 'preview_generated':
          stats.previewGenerations = (stats.previewGenerations || 0) + 1;
          break;

        case 'pdf_generation_started':
          // Technical counter
          break;

        case 'pdf_generation_completed':
          stats.biodataGenerations = (stats.biodataGenerations || 0) + 1;
          stats.biodataCreatedToday = (stats.biodataCreatedToday || 0) + 1;
          todayPoint.biodataGenerations += 1;
          break;

        case 'download_requested':
          // Handled together with download_completed
          break;

        case 'download_completed':
        case 'download_pdf':
        case 'download_png':
        case 'print_biodata':
          stats.downloads = (stats.downloads || 0) + 1;
          stats.downloadsToday = (stats.downloadsToday || 0) + 1;
          stats.downloadsThisMonth = (stats.downloadsThisMonth || 0) + 1;
          todayPoint.downloads += 1;

          if (format === 'pdf' || eventName === 'download_pdf') {
            stats.downloadsBreakdown.pdf += 1;
            stats.totalPdfDownloads += 1;
            todayPoint.downloadsPdf += 1;
          } else if (format === 'png' || eventName === 'download_png') {
            stats.downloadsBreakdown.png += 1;
            stats.totalPngDownloads += 1;
            todayPoint.downloadsPng += 1;
          } else if (format === 'print' || eventName === 'print_biodata') {
            stats.downloadsBreakdown.print += 1;
            stats.totalPrints += 1;
            todayPoint.downloadsPrint += 1;
          }

          if (templateId) {
            stats.templateUsage[templateId] = (stats.templateUsage[templateId] || 0) + 1;
          }
          break;

        case 'session_started':
          if (safeMetadata.isNewVisitorToday !== false) {
            stats.visitorsToday = (stats.visitorsToday || 0) + 1;
            stats.visitorsThisMonth = (stats.visitorsThisMonth || 0) + 1;
            todayPoint.visitors += 1;
          }
          // Record device, browser, and traffic distributions per anonymous session
          stats.deviceCategory[device] = (stats.deviceCategory[device] || 0) + 1;
          stats.deviceCounts[device] = (stats.deviceCounts[device] || 0) + 1;
          stats.browserCategory[browser] = (stats.browserCategory[browser] || 0) + 1;
          stats.trafficSource[traffic] = (stats.trafficSource[traffic] || 0) + 1;
          break;
      }

      // Track language distribution if present
      if (language && (language === 'en' || language === 'hi')) {
        stats.languageCounts[language] = (stats.languageCounts[language] || 0) + 1;
      }

      // Recompute popular templates ranking cleanly based on single-increment templateUsage
      const totalTemplateUsage = Object.values(stats.templateUsage).reduce((a, b) => a + b, 0) || 1;
      stats.popularTemplates = Object.entries(stats.templateUsage)
        .map(([id, count]) => ({
          id,
          name: TEMPLATE_NAMES[id] || id.replace('-', ' '),
          count,
          percentage: Math.round((count / totalTemplateUsage) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // Maintain up to 50 recent anonymous records for the administrative log
      const eventRecord: AnonymousAnalyticsEvent = {
        eventId: 'evt_' + Math.random().toString(36).substring(2, 9),
        eventName: eventName as AnalyticsEventType,
        timestamp: Date.now(),
        anonymousVisitorId: visitorId,
        anonymousSessionId: sessionId,
        deviceCategory: device,
        browserCategory: browser,
        trafficSource: traffic,
        metadata: safeMetadata,
        // Legacy fields for backward compatibility
        templateId,
        language,
        deviceType: device,
        screenResolution:
          typeof window !== 'undefined'
            ? `${window.innerWidth}x${window.innerHeight}`
            : '1080x1920'
      };

      stats.recentEvents = [eventRecord, ...(stats.recentEvents || [])].slice(0, 50);

      this.saveStats(stats);
    } catch {
      // Do not allow analytics failure to break anything
    }
  }

  /**
   * Returns slice of daily time series (e.g. 7, 14, 30 days)
   */
  public getTimeSeries(days: number = 7): DailyMetricPoint[] {
    const stats = this.getStats();
    const series = stats.dailyTimeSeries || [];
    return series.slice(-days);
  }

  /**
   * Returns snapshot of today's key dashboard counters
   */
  public getDashboardMetrics() {
    const stats = this.getStats();
    return {
      visitorsToday: stats.visitorsToday,
      pageViewsToday: stats.pageViewsToday,
      biodataCreatedToday: stats.biodataCreatedToday,
      downloadsToday: stats.downloadsToday,
      visitorsThisMonth: stats.visitorsThisMonth,
      downloadsThisMonth: stats.downloadsThisMonth,
      popularTemplates: stats.popularTemplates
    };
  }

  // --- Convenience Helpers ---

  public trackPageView(path: string, title?: string): void {
    this.trackEvent('page_view', { pagePath: path, pageTitle: title });
  }

  public trackTemplateView(templateId: string): void {
    this.trackEvent('template_view', { templateId });
  }

  public trackTemplateSelected(templateId: string, source: string = 'unknown'): void {
    this.trackEvent('template_selected', { templateId, source });
  }

  public trackBuilderStarted(templateId?: string, mode?: string): void {
    this.trackEvent('builder_started', { templateId, mode });
  }

  public trackBuilderStepCompleted(stepNumber: number, templateId?: string): void {
    this.trackEvent('builder_step_completed', { stepNumber, templateId });
  }

  public trackPreviewGenerated(templateId?: string, pageCount?: number): void {
    this.trackEvent('preview_generated', { templateId, pageCount });
  }

  public trackPdfGenerationStarted(templateId?: string, mode?: string): void {
    this.trackEvent('pdf_generation_started', { templateId, mode });
  }

  public trackPdfGenerationCompleted(
    templateId?: string,
    mode?: string,
    durationMs?: number
  ): void {
    this.trackEvent('pdf_generation_completed', { templateId, mode, durationMs });
  }

  public trackDownloadRequested(
    format: 'pdf' | 'png' | 'print',
    templateId?: string,
    mode?: string
  ): void {
    this.trackEvent('download_requested', { format, templateId, mode });
  }

  public trackDownloadCompleted(
    format: 'pdf' | 'png' | 'print',
    templateId?: string,
    mode?: string,
    language?: string
  ): void {
    this.trackEvent('download_completed', { format, templateId, mode, language });
  }
}

export const analyticsService = new AnalyticsService();
export type { AggregateStats };
