import fs from 'fs';
import path from 'path';
import { ALL_500_SEO_KEYWORDS, SEO_KEYWORD_CATEGORIES } from '../src/data/seoKeywords';
import { ALL_KEYWORD_SLUGS, getKeywordPageBySlug } from '../src/data/keywordCatalog';
import {
  buildWebSiteSchema,
  buildOrganizationSchema,
  buildWebApplicationSchema,
  buildWebPageSchema,
  buildServiceSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildHowToSchema
} from '../src/utils/seo';

console.log('====================================================');
console.log('       BIODATACRAFT PHASE 10: FULL SEO AUDIT        ');
console.log('====================================================');

// 1. KEYWORD & CLUSTERING AUDIT
console.log('\n[1] KEYWORD & CLUSTERING AUDIT:');
console.log('Total Master Keywords:', ALL_500_SEO_KEYWORDS.length);
console.log('Total Keyword Categories:', SEO_KEYWORD_CATEGORIES.length);
SEO_KEYWORD_CATEGORIES.forEach((c) => {
  console.log(`  - ${c.name} (${c.hindiName}): ${c.keywords.length} keywords`);
});

// Check duplicate keywords
const kwMap = new Map<string, number>();
const dupeKeywords: string[] = [];
ALL_500_SEO_KEYWORDS.forEach((kw) => {
  const norm = kw.toLowerCase().trim();
  if (kwMap.has(norm)) {
    dupeKeywords.push(kw);
  }
  kwMap.set(norm, (kwMap.get(norm) || 0) + 1);
});
console.log('Duplicate Keywords Found:', dupeKeywords.length);

// 2. SLUG & URL MAPPING AUDIT
console.log('\n[2] SLUG & URL MAPPING AUDIT:');
console.log('Total Unique Slugs Generated:', ALL_KEYWORD_SLUGS.length);
const slugMap = new Map<string, boolean>();
const dupeSlugs: string[] = [];
ALL_KEYWORD_SLUGS.forEach((slug) => {
  if (slugMap.has(slug)) dupeSlugs.push(slug);
  slugMap.set(slug, true);
});
console.log('Duplicate Slugs Found:', dupeSlugs.length);

// Check slug format (only a-z, 0-9, and hyphens)
const invalidSlugs = ALL_KEYWORD_SLUGS.filter((s) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s));
console.log('Invalid Slug Formats (must be clean kebab-case):', invalidSlugs.length);

// 3. ON-PAGE SEO AUDIT (H1, Meta Title, Description, FAQs, Breadcrumbs)
console.log('\n[3] ON-PAGE SEO & CONTENT AUDIT:');
let missingH1 = 0;
let missingTitle = 0;
let missingDesc = 0;
let missingFaqs = 0;
const titleSet = new Set<string>();
const descSet = new Set<string>();
let dupeTitles = 0;
let dupeDescs = 0;
let totalTitleLen = 0;
let totalDescLen = 0;

ALL_KEYWORD_SLUGS.forEach((slug) => {
  const page = getKeywordPageBySlug(slug);
  if (!page) return;
  if (!page.h1) missingH1++;
  if (!page.title) missingTitle++;
  if (!page.metaDescription) missingDesc++;
  if (!page.faqs || page.faqs.length === 0) missingFaqs++;

  totalTitleLen += (page.title || '').length;
  totalDescLen += (page.metaDescription || '').length;

  if (titleSet.has(page.title)) dupeTitles++;
  titleSet.add(page.title);

  if (descSet.has(page.metaDescription)) dupeDescs++;
  descSet.add(page.metaDescription);
});

const avgTitleLen = Math.round(totalTitleLen / ALL_KEYWORD_SLUGS.length);
const avgDescLen = Math.round(totalDescLen / ALL_KEYWORD_SLUGS.length);

console.log('Missing H1s:', missingH1);
console.log('Missing Titles:', missingTitle);
console.log('Missing Descriptions:', missingDesc);
console.log('Missing FAQs:', missingFaqs);
console.log('Duplicate Titles:', dupeTitles);
console.log('Duplicate Descriptions:', dupeDescs);
console.log('Average Title Length:', avgTitleLen, 'chars (optimal 50-60)');
console.log('Average Description Length:', avgDescLen, 'chars (optimal 130-160)');

// 4. SITEMAP.XML AUDIT
console.log('\n[4] SITEMAP.XML AUDIT:');
const sitemapContent = fs.readFileSync(path.resolve('./public/sitemap.xml'), 'utf8');
const locMatches = (sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []).map((x) => x.replace(/<\/?loc>/g, ''));
console.log('Total URLs in sitemap.xml:', locMatches.length);
const uniqueSitemap = new Set(locMatches);
console.log('Unique URLs in sitemap.xml:', uniqueSitemap.size);
console.log('Non-Canonical / Disallowed URLs (admin/404):', locMatches.filter((u) => u.includes('/admin') || u.includes('/404')).length);
console.log('Legacy Redirect URLs in sitemap (/builder, /privacy, /topics):', locMatches.filter((u) => u.endsWith('/builder') || u.endsWith('/privacy') || u.endsWith('/topics')).length);
console.log('Valid XML Structure:', sitemapContent.startsWith('<?xml') && sitemapContent.includes('</urlset>'));

// 5. ROBOTS.TXT AUDIT
console.log('\n[5] ROBOTS.TXT AUDIT:');
const robotsContent = fs.readFileSync(path.resolve('./public/robots.txt'), 'utf8');
console.log('Contains User-agent: *:', robotsContent.includes('User-agent: *'));
console.log('Contains User-agent: Googlebot:', robotsContent.includes('User-agent: Googlebot'));
console.log('Disallows /admin and /admin/:', robotsContent.includes('Disallow: /admin'));
console.log('Disallows /404:', robotsContent.includes('Disallow: /404'));
console.log('Declares Host:', robotsContent.includes('Host: https://biodata-craft.vercel.app'));
console.log('Declares Sitemap:', robotsContent.includes('Sitemap: https://biodata-craft.vercel.app/sitemap.xml'));

// 6. JSON-LD SCHEMA AUDIT
console.log('\n[6] JSON-LD SCHEMA AUDIT:');
let schemaSuccess = true;
let breadcrumbAuditSuccess = true;
try {
  const ws = buildWebSiteSchema();
  const org = buildOrganizationSchema();
  const webApp = buildWebApplicationSchema();
  const srv = buildServiceSchema();
  const bc = buildBreadcrumbSchema([
    { name: 'Biodata', path: '/biodata' },
    { name: 'Hindu Marriage Biodata Format', path: '/biodata/hindu-marriage-biodata-format' }
  ]);
  const faq = buildFAQSchema([{ question: 'Is it free?', answer: 'Yes, 100% free.' }]);
  const page = buildWebPageSchema({ title: 'Test', description: 'Test desc' }, 'https://biodata-craft.vercel.app/test');

  const allSchemas = [ws, org, webApp, srv, bc, faq, page];
  allSchemas.forEach((s) => {
    JSON.stringify(s);
    if (!s['@type']) schemaSuccess = false;
  });

  // Verify BreadcrumbList schema specifics
  if (bc['@type'] !== 'BreadcrumbList') breadcrumbAuditSuccess = false;
  if (!Array.isArray(bc.itemListElement) || bc.itemListElement.length !== 3) breadcrumbAuditSuccess = false;
  bc.itemListElement.forEach((el, index) => {
    if (el['@type'] !== 'ListItem') breadcrumbAuditSuccess = false;
    if (el.position !== index + 1) breadcrumbAuditSuccess = false;
    if (!el.name || typeof el.name !== 'string') breadcrumbAuditSuccess = false;
    if (!el.item || !el.item.startsWith('https://biodata-craft.vercel.app')) breadcrumbAuditSuccess = false;
  });

  console.log('WebSite, Organization, WebApp, Service, FAQ, and WebPage schemas valid:', schemaSuccess);
  console.log('BreadcrumbList itemListElement, sequential positions & absolute URLs valid:', breadcrumbAuditSuccess);
  console.log('Sample BreadcrumbList Schema:', JSON.stringify(bc, null, 2));
} catch (e) {
  console.error('Schema validation failed:', e);
}

// 7. INTERNAL LINK INTEGRITY AUDIT
console.log('\n[7] INTERNAL LINK AUDIT:');
const brokenLinks: Array<{ file: string; link: string }> = [];
const publicRoutes = new Set([
  '/',
  '/create',
  '/templates',
  '/templates/royal-heritage',
  '/templates/vedic-aura',
  '/templates/modern-elegance',
  '/samples',
  '/about',
  '/contact',
  '/blog',
  '/faq',
  '/privacy-policy',
  '/terms',
  '/terms-of-service',
  '/refund-policy',
  '/marriage-biodata',
  '/marriage-biodata-format',
  '/hindu-marriage-biodata',
  '/muslim-marriage-biodata',
  '/yadav-marriage-biodata',
  '/marathi-biodata',
  '/bengali-marriage-biodata',
  '/marriage-biodata-format-in-marathi',
  '/marriage-biodata-format-in-hindi',
  '/marriage-biodata-format-in-gujarati',
  '/marriage-biodata-format-in-english',
  '/marriage-biodata-word-format',
  '/biodata',
  ...ALL_KEYWORD_SLUGS.map((s) => '/biodata/' + s),
  // Backward compatibility redirects
  '/builder',
  '/privacy',
  '/topics',
  // Admin routes
  '/admin',
  '/admin/login',
  '/admin/templates',
  '/admin/categories',
  '/admin/analytics',
  '/admin/blog',
  '/admin/settings',
  '/admin/ads',
  '/admin/messages',
  '/admin/settings/ads',
  '/admin/settings/monetization',
  '/admin/contact'
]);

function scanDirForLinks(dir: string) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== 'dist') scanDirForLinks(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const code = fs.readFileSync(full, 'utf8');
      const linkMatches = code.matchAll(/(?:to|href)=["'](\/[a-zA-Z0-9_\-\/]*)["']/g);
      for (const m of linkMatches) {
        const link = m[1];
        if (link.startsWith('/#') || link === '/' || link === '') continue;
        if (link.startsWith('/api') || link.startsWith('/favicon') || link.startsWith('/manifest')) continue;
        const normalized = link.replace(/\/$/, '');
        if (!publicRoutes.has(normalized) && !link.includes(':slug')) {
          brokenLinks.push({ file: f, link: normalized });
        }
      }
    }
  }
}
scanDirForLinks('./src');
console.log('Total Broken Internal Links Detected:', brokenLinks.length);
if (brokenLinks.length > 0) {
  console.log('Broken Links:', brokenLinks);
}
