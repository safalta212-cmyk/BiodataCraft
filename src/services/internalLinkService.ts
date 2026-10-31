/**
 * Automated Internal Linking Engine for BiodataCraft
 * Dynamically computes semantically relevant internal links, naturalized anchor text,
 * category discovery, and core pillar navigation to distribute PageRank efficiently
 * without triggering Google penalties for excessive exact-match anchors.
 */

import { SEO_KEYWORD_CATEGORIES, ALL_500_SEO_KEYWORDS } from '../data/seoKeywords';
import { getSlugForKeyword, ALL_KEYWORD_SLUGS } from '../data/keywordCatalog';
import { CORE_SEO_PILLAR_ROUTES, SeoPillarRoute } from '../config/seoRoutes';

export interface InternalLinkItem {
  title: string;
  anchorText: string;
  path: string;
  category: string;
  badge?: string;
}

export interface InternalLinkingCluster {
  siblingTopics: InternalLinkItem[];
  complementaryTopics: InternalLinkItem[];
  pillarHubs: InternalLinkItem[];
}

/**
 * Naturalizes anchor text to avoid repetitive exact-match anchors
 */
function naturalizeAnchorText(keyword: string, variantIndex: number): string {
  const isHindi = /[\u0900-\u097F]/.test(keyword);
  if (isHindi) return keyword;

  const titleCased = keyword.replace(/\b\w/g, (l) => l.toUpperCase());

  // Alternate between 4 natural anchor variations
  switch (variantIndex % 4) {
    case 0:
      return titleCased;
    case 1:
      return `${titleCased} Format & Guide`;
    case 2:
      return `Explore ${titleCased}`;
    case 3:
      return `${titleCased} Layout`;
    default:
      return titleCased;
  }
}

/**
 * Computes an automated internal link cluster for any keyword slug
 */
export function getInternalLinksForSlug(currentSlug: string): InternalLinkingCluster {
  // Find matching keyword and category
  let matchedKeyword = '';
  let matchedCategory = SEO_KEYWORD_CATEGORIES[0];

  for (const cat of SEO_KEYWORD_CATEGORIES) {
    for (const kw of cat.keywords) {
      if (getSlugForKeyword(kw) === currentSlug) {
        matchedKeyword = kw;
        matchedCategory = cat;
        break;
      }
    }
    if (matchedKeyword) break;
  }

  // 1. Sibling Topics (Within same category) - 6 items
  const siblingTopics: InternalLinkItem[] = matchedCategory.keywords
    .filter((kw) => getSlugForKeyword(kw) !== currentSlug)
    .slice(0, 6)
    .map((kw, idx) => {
      const slug = getSlugForKeyword(kw);
      return {
        title: kw.replace(/\b\w/g, (l) => l.toUpperCase()),
        anchorText: naturalizeAnchorText(kw, idx),
        path: `/biodata/${slug}`,
        category: matchedCategory.name,
        badge: 'Related'
      };
    });

  // 2. Complementary Topics (Cross-category discovery) - 3 items from neighboring categories
  const otherCats = SEO_KEYWORD_CATEGORIES.filter((c) => c.id !== matchedCategory.id);
  const complementaryTopics: InternalLinkItem[] = [];

  otherCats.slice(0, 3).forEach((cat, idx) => {
    if (cat.keywords.length > 0) {
      const kw = cat.keywords[idx % cat.keywords.length];
      const slug = getSlugForKeyword(kw);
      complementaryTopics.push({
        title: kw.replace(/\b\w/g, (l) => l.toUpperCase()),
        anchorText: naturalizeAnchorText(kw, idx + 2),
        path: `/biodata/${slug}`,
        category: cat.name,
        badge: cat.name
      });
    }
  });

  // 3. Core Pillar Hubs
  const pillarHubs: InternalLinkItem[] = [
    {
      title: 'Marriage Biodata Format',
      anchorText: '1-Page vs 2-Page Format Checklist',
      path: '/marriage-biodata-format',
      category: 'Standards'
    },
    {
      title: 'Auspicious Templates',
      anchorText: 'Browse 10+ Cultural Templates',
      path: '/templates',
      category: 'Designs'
    },
    {
      title: 'Real Biodata Samples',
      anchorText: 'Inspect Groom & Bride Samples',
      path: '/samples',
      category: 'Samples'
    },
    {
      title: 'Topics Directory',
      anchorText: '500+ Matrimonial Topics Index',
      path: '/biodata',
      category: 'Directory'
    }
  ];

  return {
    siblingTopics,
    complementaryTopics,
    pillarHubs
  };
}

/**
 * Validates whether a target internal path is active and reachable
 */
export function isValidInternalRoute(path: string): boolean {
  if (path.startsWith('/biodata/')) {
    const slug = path.replace('/biodata/', '');
    return ALL_KEYWORD_SLUGS.includes(slug);
  }
  return CORE_SEO_PILLAR_ROUTES.some((route) => route.path === path);
}
