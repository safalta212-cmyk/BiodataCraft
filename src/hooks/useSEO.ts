import { useEffect } from 'react';
import { updateDocumentSEO, SEOMetadata } from '../utils/seo';

/**
 * React hook to synchronize document title, meta description,
 * canonical URL, OpenGraph, Twitter card, and Schema.org JSON-LD structured data.
 */
export function useSEO(metadata: Partial<SEOMetadata>) {
  useEffect(() => {
    updateDocumentSEO(metadata);
  }, [
    metadata.title,
    metadata.description,
    metadata.canonicalPath,
    metadata.canonicalUrl,
    metadata.ogType,
    metadata.ogImage,
    metadata.ogImageAlt,
    metadata.noindex,
    // JSON.stringify for complex structured objects
    JSON.stringify(metadata.breadcrumbs),
    JSON.stringify(metadata.faqs),
    JSON.stringify(metadata.howTo),
    JSON.stringify(metadata.article),
    JSON.stringify(metadata.customSchema)
  ]);
}
