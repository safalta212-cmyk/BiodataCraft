/**
 * Comprehensive SEO and Social Sharing Metadata Utility for BiodataCraft
 * Adheres strictly to Schema.org standards, Google Rich Snippet guidelines,
 * OpenGraph, Twitter Cards, and canonical URL specifications.
 */

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleMetadata {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

export interface HowToMetadata {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration e.g. "PT5M"
  steps: HowToStep[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalPath?: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  article?: ArticleMetadata;
  howTo?: HowToMetadata;
  lang?: string;
  customSchema?: Record<string, unknown> | Array<Record<string, unknown>>;
  includeWebSiteSchema?: boolean;
  includeOrganizationSchema?: boolean;
  includeWebApplicationSchema?: boolean;
}

import { ALL_500_SEO_KEYWORDS, ALL_500_SEO_KEYWORDS_STRING } from '../data/seoKeywords';

export const SITE_DOMAIN = 'https://biodata-craft.vercel.app';
export const SITE_NAME = 'BiodataCraft';

export const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200';

export const DEFAULT_SEO: SEOMetadata = {
  title: 'Free Indian Marriage Biodata Maker Online | BiodataCraft',
  description:
    'Create distinguished Indian matrimonial biodatas in English & Hindi. 100% Free with zero registration. Kundali, Gotra, and elegant templates with instant high-res PDF download.',
  canonicalPath: '/',
  keywords: ALL_500_SEO_KEYWORDS,
  ogType: 'website',
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: 'BiodataCraft - Auspicious Indian Matrimonial Biodata Creator Showcase',
  twitterCard: 'summary_large_image',
  includeWebSiteSchema: true,
  includeOrganizationSchema: true
};

/**
 * Builds Schema.org WebSite JSON-LD
 */
export function buildWebSiteSchema(siteUrl = SITE_DOMAIN) {
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_NAME,
    description: DEFAULT_SEO.description,
    keywords: ALL_500_SEO_KEYWORDS_STRING,
    inLanguage: ['en-IN', 'hi-IN'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/templates?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Builds Schema.org Organization JSON-LD
 */
export function buildOrganizationSchema(siteUrl = SITE_DOMAIN) {
  return {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/favicon.svg`,
      width: '512',
      height: '512'
    },
    sameAs: [
      'https://facebook.com/biodatacraft',
      'https://instagram.com/biodatacraft',
      'https://x.com/biodatacraft',
      'https://youtube.com/@biodatacraft'
    ],
    founder: {
      '@type': 'Person',
      name: 'Anwar Ansari'
    },
    foundingDate: '2024',
    knowsAbout: [
      'Indian Marriage Biodata Formats',
      'Matrimonial Profiles',
      'Kundali & Horoscope Matching',
      'Gotra Verification Systems',
      'Vedic Wedding Culture',
      'Bilingual Hindi & English Biodata PDF'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@biodatacraft.in',
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi']
    }
  };
}

/**
 * Builds Schema.org WebApplication JSON-LD
 */
export function buildWebApplicationSchema(siteUrl = SITE_DOMAIN) {
  return {
    '@type': 'WebApplication',
    '@id': `${siteUrl}/#webapp`,
    name: `${SITE_NAME} - Indian Marriage Biodata Maker`,
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: 'DesignApplication',
    softwareVersion: '2.4.0',
    operatingSystem: 'All modern web browsers (Android, iOS, Windows, macOS, Linux)',
    url: `${siteUrl}/create`,
    description:
      'Client-side privacy-first web application for designing and downloading auspicious Indian matrimonial biodatas in publication-grade vector A4 PDF format.',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      description: '100% Free Forever with zero subscription or watermark'
    },
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl
    },
    screenshot: DEFAULT_OG_IMAGE,
    keywords: ALL_500_SEO_KEYWORDS_STRING,
    featureList: [
      'Zero Customer Login or Registration Required',
      '100% Client-Side Privacy (Zero Data Stored on Cloud Servers)',
      'Bilingual English & Hindi Typography with Devanagari Unicode',
      'Auspicious Vedic, Royal Mandap, Sikh & Muslim Motifs',
      'High-Resolution Vector A4 PDF & WhatsApp Image Export'
    ]
  };
}

/**
 * Builds Schema.org WebPage JSON-LD
 */
export function buildWebPageSchema(
  meta: SEOMetadata,
  canonicalHref: string,
  siteUrl = SITE_DOMAIN,
  hasBreadcrumbs = false
) {
  const schema: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${canonicalHref}#webpage`,
    url: canonicalHref,
    name: meta.title,
    description: meta.description,
    isPartOf: {
      '@id': `${siteUrl}/#website`
    },
    inLanguage: ['en-IN', 'hi-IN']
  };

  // Google Search Console strictly requires breadcrumb reference ONLY when
  // a corresponding BreadcrumbList schema with itemListElement is provided in @graph.
  if (hasBreadcrumbs) {
    schema.breadcrumb = {
      '@id': `${canonicalHref}#breadcrumb`
    };
  }

  return schema;
}

/**
 * Builds Schema.org Service JSON-LD
 */
export function buildServiceSchema(siteUrl = SITE_DOMAIN) {
  return {
    '@type': 'Service',
    '@id': `${siteUrl}/#service`,
    name: 'Indian Marriage Biodata Creation Service',
    serviceType: 'Matrimonial Document Creation',
    provider: {
      '@id': `${siteUrl}/#organization`
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    },
    description:
      'Free client-side privacy-first web application for designing and downloading auspicious Indian matrimonial biodatas in publication-grade vector A4 PDF format.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      description: '100% Free Forever'
    }
  };
}

/**
 * Automatically infers breadcrumb hierarchy for any route path
 */
export function generateDynamicBreadcrumbs(path: string, pageTitle?: string): BreadcrumbItem[] {
  const clean = path.split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '');
  if (!clean) return [];

  const segments = clean.split('/');
  const crumbs: BreadcrumbItem[] = [];

  const formatSlug = (slug: string) => {
    return slug
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  };

  const cleanTitle = (raw?: string) => {
    if (!raw) return undefined;
    return raw.split('|')[0].split(' - ')[0].trim();
  };

  const currentTitle = cleanTitle(pageTitle);

  if (segments[0] === 'biodata') {
    crumbs.push({ name: 'Biodata', path: '/biodata' });
    if (segments.length > 1) {
      crumbs.push({
        name: currentTitle || formatSlug(segments[1]),
        path: `/biodata/${segments[1]}`
      });
    }
  } else if (segments[0] === 'templates') {
    crumbs.push({ name: 'Templates', path: '/templates' });
    if (segments.length > 1) {
      crumbs.push({
        name: currentTitle || formatSlug(segments[1]),
        path: `/templates/${segments[1]}`
      });
    }
  } else if (segments[0] === 'blog') {
    crumbs.push({ name: 'Blog', path: '/blog' });
    if (segments.length > 1) {
      crumbs.push({
        name: currentTitle || formatSlug(segments[1]),
        path: `/blog/${segments[1]}`
      });
    }
  } else if (
    [
      'hindu-marriage-biodata',
      'muslim-marriage-biodata',
      'marathi-biodata',
      'bengali-marriage-biodata',
      'yadav-marriage-biodata',
      'marriage-biodata',
      'marriage-biodata-format'
    ].includes(segments[0])
  ) {
    crumbs.push({ name: 'Biodata', path: '/biodata' });
    crumbs.push({
      name: currentTitle || formatSlug(segments[0]),
      path: `/${segments[0]}`
    });
  } else {
    let accumulatedPath = '';
    segments.forEach((seg, idx) => {
      accumulatedPath += `/${seg}`;
      const isLast = idx === segments.length - 1;
      crumbs.push({
        name: isLast && currentTitle ? currentTitle : formatSlug(seg),
        path: accumulatedPath
      });
    });
  }

  return crumbs;
}

/**
 * Builds Schema.org BreadcrumbList JSON-LD strictly compliant with Google Rich Results guidelines.
 * Guarantees a fully-populated itemListElement array containing:
 * - @type: "ListItem"
 * - position: 1-indexed sequential integer starting at 1
 * - name: string label
 * - item: fully qualified absolute canonical URL
 *
 * Links with WebPage schema via @id: `${canonicalHref}#breadcrumb`
 */
export function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
  siteUrl = SITE_DOMAIN,
  canonicalHref?: string
): {
  '@type': 'BreadcrumbList';
  '@id': string;
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
} | null {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');

  if (!items || !Array.isArray(items)) {
    return null;
  }

  // Filter out any nullish or empty names
  const validItems = items.filter(
    (item) => item && typeof item.name === 'string' && item.name.trim().length > 0
  );

  // If first item explicitly passed is Home or points to root /, remove to prevent duplication
  let filteredItems = [...validItems];
  if (
    filteredItems.length > 0 &&
    (filteredItems[0].name.trim().toLowerCase() === 'home' ||
      filteredItems[0].path === '/' ||
      filteredItems[0].path === cleanSiteUrl ||
      filteredItems[0].path === `${cleanSiteUrl}/`)
  ) {
    filteredItems.shift();
  }

  // Google requires at least 2 items in a BreadcrumbList (Home + at least 1 destination)
  if (filteredItems.length === 0) {
    return null;
  }

  const cleanCanonical = canonicalHref
    ? canonicalHref.split('?')[0].split('#')[0]
    : undefined;

  const elements: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${cleanSiteUrl}/`
    }
  ];

  filteredItems.forEach((item, idx) => {
    const isTerminal = idx === filteredItems.length - 1;
    const rawPath = item.path ? item.path.trim() : '';
    let fullUrl: string;

    if (isTerminal && cleanCanonical) {
      fullUrl = cleanCanonical;
    } else if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      fullUrl = rawPath.split('?')[0].split('#')[0];
    } else if (rawPath.length > 0) {
      const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
      fullUrl = `${cleanSiteUrl}${cleanPath.split('?')[0].split('#')[0]}`;
    } else if (cleanCanonical) {
      fullUrl = cleanCanonical;
    } else {
      fullUrl = `${cleanSiteUrl}/`;
    }

    elements.push({
      '@type': 'ListItem',
      position: idx + 2,
      name: item.name.trim(),
      item: fullUrl
    });
  });

  const breadcrumbId = cleanCanonical
    ? `${cleanCanonical}#breadcrumb`
    : `${elements[elements.length - 1].item}#breadcrumb`;

  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: elements
  };
}

/**
 * Builds Schema.org FAQPage JSON-LD
 */
export function buildFAQSchema(faqs: FAQItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Builds Schema.org HowTo JSON-LD
 */
export function buildHowToSchema(howTo: HowToMetadata, siteUrl = SITE_DOMAIN) {
  return {
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    totalTime: howTo.totalTime || 'PT5M',
    step: howTo.steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
      url: step.url || `${siteUrl}/create`,
      image: step.image || DEFAULT_OG_IMAGE
    }))
  };
}

/**
 * Builds Schema.org Article / BlogPosting JSON-LD
 */
export function buildArticleSchema(article: ArticleMetadata, siteUrl = SITE_DOMAIN) {
  return {
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image || DEFAULT_OG_IMAGE,
    datePublished: article.datePublished || '2026-10-01T10:00:00Z',
    dateModified: article.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article.authorName || 'Editorial Team, BiodataCraft'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.svg`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
  };
}

/**
 * Updates DOM head tags dynamically for single page applications
 */
export function updateDocumentSEO(meta: Partial<SEOMetadata>) {
  if (typeof document === 'undefined') return;

  const fullMeta: SEOMetadata = {
    ...DEFAULT_SEO,
    ...meta,
    title: meta.title
      ? meta.title.includes(SITE_NAME)
        ? meta.title
        : `${meta.title} | ${SITE_NAME}`
      : DEFAULT_SEO.title
  };

  // 1. Dynamic Page Title
  document.title = fullMeta.title;

  // Sync document language if specified
  if (fullMeta.lang) {
    document.documentElement.lang = fullMeta.lang;
  }

  // Helper function to set or replace meta tags
  const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
    let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attributeName, attributeValue);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // Helper function to set or replace link tags
  const setLinkTag = (rel: string, hreflang: string | null, href: string) => {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    let link = document.querySelector(selector);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) link.setAttribute('hreflang', hreflang);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  };

  // 2. Meta Description
  setMetaTag('name', 'description', fullMeta.description);

  // 3. Keywords
  if (fullMeta.keywords && fullMeta.keywords.length > 0) {
    setMetaTag('name', 'keywords', fullMeta.keywords.join(', '));
  }

  // 4. Search Engine Robots & Crawlers Directives
  const robotsDirective = fullMeta.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  setMetaTag('name', 'robots', robotsDirective);
  setMetaTag('name', 'googlebot', robotsDirective);
  setMetaTag('name', 'bingbot', robotsDirective);

  // 5. Canonical URL & Hreflang Normalization
  const baseDomain = SITE_DOMAIN;

  let cleanPath = fullMeta.canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  // Strip query parameters and hash anchors, enforce lowercase
  cleanPath = cleanPath.split('?')[0].split('#')[0].toLowerCase();
  // Strip trailing slashes unless root
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }
  const canonicalHref = fullMeta.canonicalUrl
    ? fullMeta.canonicalUrl.split('?')[0].split('#')[0]
    : `${baseDomain}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;

  // Canonical and alternate hreflang tags are only set for indexable pages
  if (!fullMeta.noindex) {
    setLinkTag('canonical', null, canonicalHref);
    setLinkTag('alternate', 'en-IN', canonicalHref);
    setLinkTag('alternate', 'hi-IN', `${canonicalHref}${canonicalHref.includes('?') ? '&' : '?'}lang=hi`);
    setLinkTag('alternate', 'x-default', canonicalHref);
  } else {
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }
    const existingEn = document.querySelector('link[rel="alternate"][hreflang="en-IN"]');
    if (existingEn) existingEn.remove();
    const existingHi = document.querySelector('link[rel="alternate"][hreflang="hi-IN"]');
    if (existingHi) existingHi.remove();
    const existingXDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (existingXDefault) existingXDefault.remove();
  }

  // 6. Application & Geo Meta Tags
  setMetaTag('name', 'theme-color', '#78350f');
  setMetaTag('name', 'application-name', SITE_NAME);
  setMetaTag('name', 'apple-mobile-web-app-title', SITE_NAME);
  setMetaTag('name', 'format-detection', 'telephone=no');
  setMetaTag('name', 'geo.region', 'IN');
  setMetaTag('name', 'geo.placename', 'India');

  // 7. Open Graph Tags
  setMetaTag('property', 'og:site_name', SITE_NAME);
  setMetaTag('property', 'og:title', fullMeta.title);
  setMetaTag('property', 'og:description', fullMeta.description);
  setMetaTag('property', 'og:type', fullMeta.ogType || 'website');
  setMetaTag('property', 'og:url', canonicalHref);
  setMetaTag('property', 'og:image', fullMeta.ogImage || DEFAULT_OG_IMAGE);
  setMetaTag('property', 'og:image:secure_url', fullMeta.ogImage || DEFAULT_OG_IMAGE);
  setMetaTag('property', 'og:image:width', '1200');
  setMetaTag('property', 'og:image:height', '630');
  setMetaTag('property', 'og:image:type', 'image/jpeg');
  setMetaTag('property', 'og:image:alt', fullMeta.ogImageAlt || fullMeta.title);
  setMetaTag('property', 'og:locale', 'en_IN');
  setMetaTag('property', 'og:locale:alternate', 'hi_IN');

  // 8. Twitter / X Tags
  setMetaTag('name', 'twitter:card', fullMeta.twitterCard || 'summary_large_image');
  setMetaTag('name', 'twitter:site', '@biodatacraft');
  setMetaTag('name', 'twitter:creator', '@biodatacraft');
  setMetaTag('name', 'twitter:title', fullMeta.title);
  setMetaTag('name', 'twitter:description', fullMeta.description);
  setMetaTag('name', 'twitter:image', fullMeta.ogImage || DEFAULT_OG_IMAGE);
  setMetaTag('name', 'twitter:image:alt', fullMeta.ogImageAlt || fullMeta.title);

  // 9. Structured Data (JSON-LD)
  const graph: Array<Record<string, unknown>> = [];
  const schemaDomain = baseDomain;

  if (fullMeta.includeWebSiteSchema !== false) {
    graph.push(buildWebSiteSchema(schemaDomain));
  }
  if (fullMeta.includeOrganizationSchema !== false) {
    graph.push(buildOrganizationSchema(schemaDomain));
    graph.push(buildServiceSchema(schemaDomain));
  }

  // Breadcrumbs: Google Rich Results prohibits BreadcrumbList on root homepage (/)
  // Only non-home, indexable pages should generate BreadcrumbList schema
  const isHomePage =
    cleanPath === '' ||
    cleanPath === '/' ||
    canonicalHref === `${schemaDomain}/` ||
    canonicalHref === schemaDomain;

  let breadcrumbSchema: ReturnType<typeof buildBreadcrumbSchema> = null;

  if (!isHomePage && !fullMeta.noindex) {
    const rawCrumbs =
      fullMeta.breadcrumbs && fullMeta.breadcrumbs.length > 0
        ? fullMeta.breadcrumbs
        : generateDynamicBreadcrumbs(cleanPath, fullMeta.title);

    breadcrumbSchema = buildBreadcrumbSchema(rawCrumbs, schemaDomain, canonicalHref);
  }

  const hasBreadcrumbs = Boolean(
    breadcrumbSchema &&
      Array.isArray(breadcrumbSchema.itemListElement) &&
      breadcrumbSchema.itemListElement.length >= 2
  );

  graph.push(buildWebPageSchema(fullMeta, canonicalHref, schemaDomain, hasBreadcrumbs));

  if (fullMeta.includeWebApplicationSchema) {
    graph.push(buildWebApplicationSchema(schemaDomain));
  }

  if (hasBreadcrumbs && breadcrumbSchema) {
    graph.push(breadcrumbSchema);
  }
  if (fullMeta.faqs && fullMeta.faqs.length > 0) {
    graph.push(buildFAQSchema(fullMeta.faqs));
  }
  if (fullMeta.howTo) {
    graph.push(buildHowToSchema(fullMeta.howTo, schemaDomain));
  }
  if (fullMeta.article) {
    graph.push(buildArticleSchema(fullMeta.article, schemaDomain));
  }
  if (fullMeta.customSchema) {
    if (Array.isArray(fullMeta.customSchema)) {
      graph.push(...fullMeta.customSchema);
    } else {
      graph.push(fullMeta.customSchema);
    }
  }

  const jsonLdContent = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': graph
    },
    null,
    2
  ).replace(/</g, '\\u003c');

  let scriptTag = document.querySelector('script#biodatacraft-seo-jsonld');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('id', 'biodatacraft-seo-jsonld');
    scriptTag.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = jsonLdContent;
}
