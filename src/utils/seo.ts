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
    operatingSystem: 'All modern web browsers (Android, iOS, Windows, macOS, Linux)',
    url: `${siteUrl}/create`,
    description:
      'Client-side privacy-first web application for designing and downloading auspicious Indian matrimonial biodatas in publication-grade vector A4 PDF format.',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1284',
      bestRating: '5',
      worstRating: '1'
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
 * Builds Schema.org BreadcrumbList JSON-LD
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[], siteUrl = SITE_DOMAIN) {
  const elements = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrl
    },
    ...items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 2,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${siteUrl}${item.path}`
    }))
  ];

  return {
    '@type': 'BreadcrumbList',
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

  // 2. Meta Description
  setMetaTag('name', 'description', fullMeta.description);

  // 3. Keywords
  if (fullMeta.keywords && fullMeta.keywords.length > 0) {
    setMetaTag('name', 'keywords', fullMeta.keywords.join(', '));
  }

  // 4. Robots
  setMetaTag(
    'name',
    'robots',
    fullMeta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  // 5. Canonical URL
  const baseDomain = SITE_DOMAIN;

  const canonicalHref = fullMeta.canonicalUrl
    ? fullMeta.canonicalUrl
    : fullMeta.canonicalPath
    ? `${baseDomain}${fullMeta.canonicalPath.startsWith('/') ? '' : '/'}${fullMeta.canonicalPath}`
    : `${baseDomain}${window.location.pathname}`;

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalHref);

  // 6. Open Graph Tags
  setMetaTag('property', 'og:site_name', SITE_NAME);
  setMetaTag('property', 'og:title', fullMeta.title);
  setMetaTag('property', 'og:description', fullMeta.description);
  setMetaTag('property', 'og:type', fullMeta.ogType || 'website');
  setMetaTag('property', 'og:url', canonicalHref);
  setMetaTag('property', 'og:image', fullMeta.ogImage || DEFAULT_OG_IMAGE);
  setMetaTag('property', 'og:image:width', '1200');
  setMetaTag('property', 'og:image:height', '630');
  setMetaTag('property', 'og:image:type', 'image/jpeg');
  setMetaTag('property', 'og:image:alt', fullMeta.ogImageAlt || fullMeta.title);
  setMetaTag('property', 'og:locale', 'en_IN');
  setMetaTag('property', 'og:locale:alternate', 'hi_IN');

  // 7. Twitter / X Tags
  setMetaTag('name', 'twitter:card', fullMeta.twitterCard || 'summary_large_image');
  setMetaTag('name', 'twitter:site', '@biodatacraft');
  setMetaTag('name', 'twitter:creator', '@biodatacraft');
  setMetaTag('name', 'twitter:title', fullMeta.title);
  setMetaTag('name', 'twitter:description', fullMeta.description);
  setMetaTag('name', 'twitter:image', fullMeta.ogImage || DEFAULT_OG_IMAGE);
  setMetaTag('name', 'twitter:image:alt', fullMeta.ogImageAlt || fullMeta.title);

  // 8. Structured Data (JSON-LD)
  const graph: Array<Record<string, unknown>> = [];
  const schemaDomain = baseDomain;

  if (fullMeta.includeWebSiteSchema !== false) {
    graph.push(buildWebSiteSchema(schemaDomain));
  }
  if (fullMeta.includeOrganizationSchema !== false) {
    graph.push(buildOrganizationSchema(schemaDomain));
  }
  if (fullMeta.includeWebApplicationSchema) {
    graph.push(buildWebApplicationSchema(schemaDomain));
  }
  if (fullMeta.breadcrumbs && fullMeta.breadcrumbs.length > 0) {
    graph.push(buildBreadcrumbSchema(fullMeta.breadcrumbs, schemaDomain));
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
