/**
 * Centralized SEO Route & Keyword Mapping Architecture
 * Establishes clean lowercase hyphenated URL mappings, primary & secondary keyword assignments,
 * canonical parent references, and search intent classification to prevent keyword cannibalization.
 */

export type SearchIntent = 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';

export interface SeoPillarRoute {
  path: string;
  name: string;
  h1: string;
  title: string;
  metaDescription: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  intent: SearchIntent;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

export interface SecondaryKeywordMapping {
  secondaryKeyword: string;
  targetPagePath: string;
  targetPageName: string;
  cannibalizationReason: string;
}

/**
 * 1. Cornerstone Pillar Routes (Primary High-Volume Hubs)
 */
export const CORE_SEO_PILLAR_ROUTES: SeoPillarRoute[] = [
  {
    path: '/',
    name: 'Home - Free Biodata Maker',
    h1: 'Free Indian Marriage Biodata Maker Online',
    title: 'Free Indian Marriage Biodata Maker Online | BiodataCraft',
    metaDescription:
      'Create elegant Hindu, Jain, Muslim & Indian matrimonial biodata PDFs in 5 minutes with Vedic mantras, kundali details, and auspicious templates. 100% free with zero customer data storage.',
    primaryKeywords: [
      'marriage biodata',
      'marriage biodata maker',
      'online biodata creator',
      'free marriage bio data maker online'
    ],
    secondaryKeywords: [
      'biodata maker app',
      'biodata maker online free',
      'create biodata for marriage',
      'shadi biodata',
      'vivah biodata',
      'biodata maker without login',
      'biodata maker without watermark',
      'marriage biodata maker without login free',
      'no otp marriage biodata maker',
      'zero data storage biodata creator'
    ],
    intent: 'Transactional',
    priority: 1.0,
    changefreq: 'daily'
  },
  {
    path: '/create',
    name: 'Biodata Builder Application',
    h1: 'Design Your Matrimonial Biodata in 5 Steps',
    title: 'Create Marriage Biodata Online - Free PDF Generator | BiodataCraft',
    metaDescription:
      'Professional Indian Marriage Biodata Maker. Create elegant Hindu, Jain, Sikh & Muslim biodatas in 5 easy steps without signup. 100% private client-side PDF download.',
    primaryKeywords: [
      'matrimonial profile builder',
      'online marriage biodata builder'
    ],
    secondaryKeywords: [
      'matrimonial bio data generator',
      'instant biodata maker',
      'biodata creator free',
      'browser print clean pdf',
      'vector print biodata'
    ],
    intent: 'Transactional',
    priority: 0.95,
    changefreq: 'weekly'
  },
  {
    path: '/templates',
    name: 'Design & Template Gallery',
    h1: 'Marriage Biodata Templates: Vedic, Royal & Modern Designs',
    title: 'Marriage Biodata Templates - Vedic, Royal & Modern Designs | BiodataCraft',
    metaDescription:
      'Browse professional Indian marriage biodata designs: Traditional, Modern, Royal Mandap, Vedic, Muslim Nikah, and Regional templates. 100% Free, no login required.',
    primaryKeywords: [
      'marriage profile template',
      'marriage biodata template free'
    ],
    secondaryKeywords: [
      'royal luxury biodata',
      'traditional marriage biodata',
      'modern marriage biodata',
      'simple marriage biodata',
      'elegant marriage biodata',
      'golden border marriage biodata',
      'floral border biodata',
      'temple arch biodata design',
      'peacock feather biodata theme'
    ],
    intent: 'Commercial',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    path: '/samples',
    name: 'Sample Profiles & Previews',
    h1: 'Authentic Marriage Biodata Samples for Groom & Bride',
    title: 'Marriage Biodata Samples & Previews for Groom & Bride | BiodataCraft',
    metaDescription:
      'Browse authentic Indian marriage biodata samples for groom and bride in English and Hindi. Real Kundali, Gotra, and family format examples with instant editing.',
    primaryKeywords: [
      'marriage biodata samples',
      'sample biodata for marriage'
    ],
    secondaryKeywords: [
      'groom biodata format',
      'bride biodata format',
      'matrimony resume format',
      'boy marriage biodata format',
      'girl marriage biodata format',
      'free matrimony biodata download'
    ],
    intent: 'Commercial',
    priority: 0.85,
    changefreq: 'weekly'
  },
  {
    path: '/marriage-biodata-format',
    name: 'Layout & Format Standards Guide',
    h1: 'Standard Marriage Biodata Format: 1-Page vs 2-Page Layouts',
    title: 'Marriage Biodata Format: 1-Page vs 2-Page Layouts & Templates | BiodataCraft',
    metaDescription:
      'Discover standard Indian marriage biodata formats, 1-page vs 2-page layouts, field-by-field checklist in English & Hindi, and download printable PDF biodatas.',
    primaryKeywords: [
      'marriage biodata format',
      '1 page biodata format'
    ],
    secondaryKeywords: [
      'single page marriage biodata',
      'two page marriage biodata',
      '2 page biodata format',
      'wedding biodata format in english',
      'biodata format for marriage in english',
      'matrimonial cv',
      'marriage resume'
    ],
    intent: 'Informational',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    path: '/marriage-biodata',
    name: 'Complete Matrimonial Guide',
    h1: 'The Complete Guide to Indian Marriage Biodata',
    title: 'Marriage Biodata: Complete Guide, Structure & Tips for Indian Matrimony | BiodataCraft',
    metaDescription:
      'Comprehensive master guide for writing an auspicious Indian matrimonial biodata: Kundali, Gotra etiquette, family background, photo rules, and PDF download.',
    primaryKeywords: [
      'bio data for marriage',
      'wedding profile maker'
    ],
    secondaryKeywords: [
      'matchmaking biodata',
      'rishta biodata',
      'shaadi profile maker',
      'how to write marriage biodata'
    ],
    intent: 'Informational',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    path: '/hindu-marriage-biodata',
    name: 'Hindu & Vedic Traditions',
    h1: 'Hindu Marriage Biodata: Gotra, Kundali & Sacred Vedic Formats',
    title: 'Hindu Marriage Biodata Format: Gotra, Kundali & Vedic Templates | BiodataCraft',
    metaDescription:
      'Design authentic Hindu marriage biodatas with Shree Ganesh Shlokas, Gotra (Self & Mosal), Kundali horoscope details, and sacred Vedic styling. 100% Free PDF.',
    primaryKeywords: [
      'hindu marriage biodata',
      'vedic marriage biodata'
    ],
    secondaryKeywords: [
      'shubh vivah biodata',
      'gotra in marriage biodata',
      'maternal gotra in biodata',
      'mosal gotra biodata',
      'kundli biodata format online',
      'lord ganesha symbol biodata',
      'shree ganeshay namah'
    ],
    intent: 'Informational',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    path: '/muslim-marriage-biodata',
    name: 'Muslim Nikah Traditions',
    h1: 'Muslim Marriage Biodata: Nikah Format & Islamic Guidelines',
    title: 'Muslim Marriage Biodata: Nikah Biodata Format & Islamic Guidelines | BiodataCraft',
    metaDescription:
      'Create dignified Muslim Nikah biodatas with Bismillah Ar-Rahman Ar-Rahim, Maslak, Deen observance, and Mehram contact details. 100% Free, privacy-first PDF download.',
    primaryKeywords: [
      'muslim nikah biodata'
    ],
    secondaryKeywords: [
      'urdu nikahnama biodata',
      'islamic marriage biodata',
      'nikah biodata format',
      'bismillah biodata format'
    ],
    intent: 'Informational',
    priority: 0.85,
    changefreq: 'weekly'
  },
  {
    path: '/marathi-biodata',
    name: 'Marathi Lagna Traditions',
    h1: 'मराठी लग्न बायोडाटा (Marathi Biodata Format)',
    title: 'Marathi Biodata: लग्न बायोडाटा Format, Devak & Templates | BiodataCraft',
    metaDescription:
      'मराठी लग्न बायोडाटा (Marathi Lagna Biodata) format: Devak, Kuldaivat, Gan, Nadi, Mama details, and Paithani-inspired templates with free PDF maker.',
    primaryKeywords: [
      'marathi biodata',
      'marathi lagna patrika biodata'
    ],
    secondaryKeywords: [
      'marathi lagna patrika format pdf',
      'marathi vivah biodata',
      'devak in marathi biodata',
      'pune marathi biodata'
    ],
    intent: 'Informational',
    priority: 0.85,
    changefreq: 'weekly'
  },
  {
    path: '/yadav-marriage-biodata',
    name: 'Yadav Samaj Traditions',
    h1: 'Yadav Marriage Biodata: Ancestral Gotra & Cultural Format',
    title: 'Yadav Marriage Biodata: Samaj Format, Gotra & Culture | BiodataCraft',
    metaDescription:
      'Complete guide to Yadav marriage biodata format. Learn 4-gotra system, Mosal gotra rules, Lord Krishna blessings, and download free Yadav matrimonial biodata.',
    primaryKeywords: [
      'yadav marriage biodata'
    ],
    secondaryKeywords: [
      'yadav samaj biodata',
      'yadav matrimonial biodata format',
      'ahir samaj biodata'
    ],
    intent: 'Informational',
    priority: 0.85,
    changefreq: 'weekly'
  },
  {
    path: '/bengali-marriage-biodata',
    name: 'Bengali Biye Traditions',
    h1: 'Bengali Marriage Biodata: পাত্র/পাত্রীর বায়োডাटा ও পঞ্জিকা বিবরণ',
    title: 'Bengali Marriage Biodata: পাত্র/পাত্রী বায়োডাটা ও Patrika | BiodataCraft',
    metaDescription:
      'Bengali marriage biodata guide (বাংলা বিয়ের বায়োডাটা). Format details for Gotra, Gona, Rashi, ancestral background, and download free Bengali matrimonial PDF.',
    primaryKeywords: [
      'bengali matrimony biodata'
    ],
    secondaryKeywords: [
      'bengali biye biodata',
      'kolkata biye biodata',
      'west bengal biye biodata'
    ],
    intent: 'Informational',
    priority: 0.85,
    changefreq: 'weekly'
  },
  {
    path: '/biodata',
    name: 'Topics & Cultural Directory',
    h1: 'Indian Marriage Biodata Topics & Regional Formats Directory',
    title: 'Indian Marriage Biodata Topics & Cultural Directory | BiodataCraft',
    metaDescription:
      'Explore 500+ matrimonial biodata formats across Indian communities, Vedic astrology, castes, professions, and regional languages. 100% free with instant PDF download.',
    primaryKeywords: [
      'biodata topics directory',
      'matrimonial biodata directory'
    ],
    secondaryKeywords: [
      '500 biodata formats',
      'indian matrimonial keywords',
      'regional biodata formats index'
    ],
    intent: 'Navigational',
    priority: 0.9,
    changefreq: 'daily'
  }
];

/**
 * 2. Secondary Keywords Consolidated to Prevent Cannibalization
 */
export const SECONDARY_KEYWORD_CONSOLIDATION_MAP: SecondaryKeywordMapping[] = [
  {
    secondaryKeyword: '1 page biodata format',
    targetPagePath: '/marriage-biodata-format',
    targetPageName: 'Marriage Biodata Format',
    cannibalizationReason: 'Identical search intent to single page biodata layout; consolidated to prevent competing ranking signals.'
  },
  {
    secondaryKeyword: 'single page marriage biodata',
    targetPagePath: '/marriage-biodata-format',
    targetPageName: 'Marriage Biodata Format',
    cannibalizationReason: 'Consolidated into format standards hub with dedicated 1-page design guidelines.'
  },
  {
    secondaryKeyword: 'two page marriage biodata',
    targetPagePath: '/marriage-biodata-format',
    targetPageName: 'Marriage Biodata Format',
    cannibalizationReason: 'Contrasting format consolidated into single comparison table.'
  },
  {
    secondaryKeyword: '2 page biodata format',
    targetPagePath: '/marriage-biodata-format',
    targetPageName: 'Marriage Biodata Format',
    cannibalizationReason: 'Abbreviation variant of two-page layout; consolidated.'
  },
  {
    secondaryKeyword: 'yadav samaj biodata',
    targetPagePath: '/yadav-marriage-biodata',
    targetPageName: 'Yadav Marriage Biodata',
    cannibalizationReason: 'Synonymous community intent; prevents splitting domain authority.'
  },
  {
    secondaryKeyword: 'marathi lagna patrika format pdf',
    targetPagePath: '/marathi-biodata',
    targetPageName: 'Marathi Lagna Biodata',
    cannibalizationReason: 'Direct regional translation intent; consolidated into Marathi hub.'
  },
  {
    secondaryKeyword: 'bengali biye biodata',
    targetPagePath: '/bengali-marriage-biodata',
    targetPageName: 'Bengali Marriage Biodata',
    cannibalizationReason: 'Colloquial term for Bengali marriage profile; consolidated.'
  },
  {
    secondaryKeyword: 'biodata maker without login',
    targetPagePath: '/',
    targetPageName: 'Home',
    cannibalizationReason: 'Core value proposition of the homepage; targeted as secondary highlight.'
  },
  {
    secondaryKeyword: 'biodata maker without watermark',
    targetPagePath: '/',
    targetPageName: 'Home',
    cannibalizationReason: 'Secondary feature query targeted via Homepage Trust Badges.'
  },
  {
    secondaryKeyword: 'marriage biodata maker without login free',
    targetPagePath: '/',
    targetPageName: 'Home',
    cannibalizationReason: 'Long-tail exact-match variation of homepage value proposition.'
  },
  {
    secondaryKeyword: 'sample biodata for marriage',
    targetPagePath: '/samples',
    targetPageName: 'Samples Gallery',
    cannibalizationReason: 'Exact synonym of marriage biodata samples; consolidated into samples hub.'
  },
  {
    secondaryKeyword: 'groom biodata format',
    targetPagePath: '/samples',
    targetPageName: 'Samples Gallery',
    cannibalizationReason: 'Served via interactive groom sample toggle on samples page.'
  },
  {
    secondaryKeyword: 'bride biodata format',
    targetPagePath: '/samples',
    targetPageName: 'Samples Gallery',
    cannibalizationReason: 'Served via interactive bride sample toggle on samples page.'
  }
];
