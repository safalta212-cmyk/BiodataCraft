import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

interface PrePublishReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  isPublishing: boolean;
  title: string;
  slug: string;
  category: string;
  author: string;
  readTime: string;
  excerpt: string;
  contentBody: string;
  featuredImage: string;
  featuredImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  enableTableOfContents: boolean;
}

export const PrePublishReviewModal: React.FC<PrePublishReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  isPublishing,
  title,
  slug,
  category,
  author,
  readTime,
  excerpt,
  contentBody,
  featuredImage,
  featuredImageAlt,
  seoTitle,
  seoDescription,
  enableTableOfContents
}) => {
  if (!isOpen) return null;

  const publicUrl = `https://biodata-craft.vercel.app/blog/${slug}`;

  // Evaluate required blocking items vs advisory warning items
  const titleValid = Boolean(title.trim());
  const slugValid = Boolean(slug.trim() && /^[a-z0-9-]+$/.test(slug.trim()));
  const categoryValid = Boolean(category.trim());
  const contentValid = Boolean(contentBody.trim() && contentBody.trim().length >= 100);

  const canPublish = titleValid && slugValid && categoryValid && contentValid;

  // Advisory quality checks
  const hasFeaturedImage = Boolean(featuredImage.trim());
  const hasFeaturedAlt = hasFeaturedImage ? Boolean(featuredImageAlt.trim()) : true;
  const hasExcerpt = excerpt.trim().length >= 80;
  const hasHeadings = /^##\s+.+$/m.test(contentBody);
  const hasSeoTitle = Boolean(seoTitle.trim() && seoTitle.trim().length >= 40);
  const hasSeoDesc = Boolean(seoDescription.trim() && seoDescription.trim().length >= 100);
  const hasInternalLinks = /\[([^\]]+)\]\((\/[^\s)]+|https?:\/\/[^\s)]*(biodatacraft|vercel)[^\s)]*)\)/i.test(contentBody);

  const reviewItems = [
    {
      label: 'Article Title',
      value: title || 'Missing Title',
      status: titleValid ? 'pass' : 'error',
      required: true,
      hint: titleValid ? 'Complete' : 'Required to publish'
    },
    {
      label: 'URL Slug Identifier',
      value: `/blog/${slug}`,
      status: slugValid ? 'pass' : 'error',
      required: true,
      hint: slugValid ? 'Valid kebab-case' : 'Required lowercase alphanumeric'
    },
    {
      label: 'Category Taxonomy',
      value: category,
      status: categoryValid ? 'pass' : 'error',
      required: true,
      hint: categoryValid ? 'Assigned' : 'Required'
    },
    {
      label: 'Article Body Content',
      value: `${contentBody.trim().split(/\s+/).length} words`,
      status: contentValid ? 'pass' : 'error',
      required: true,
      hint: contentValid ? 'Ready for publication' : 'Required (minimum 100 characters)'
    },
    {
      label: 'Featured Hero Image',
      value: hasFeaturedImage ? 'Attached' : 'None',
      status: hasFeaturedImage ? 'pass' : 'warning',
      required: false,
      hint: hasFeaturedImage ? (hasFeaturedAlt ? 'With ALT text' : 'Missing ALT text') : 'Recommended for social cards'
    },
    {
      label: 'Catalog Excerpt',
      value: excerpt ? `${excerpt.length} characters` : 'Empty',
      status: hasExcerpt ? 'pass' : 'warning',
      required: false,
      hint: hasExcerpt ? 'Appropriate length' : 'Recommended 100–180 chars'
    },
    {
      label: 'Heading Structure (H2/H3)',
      value: hasHeadings ? 'Present' : 'No H2 tags',
      status: hasHeadings ? 'pass' : 'warning',
      required: false,
      hint: hasHeadings ? 'Proper hierarchy' : 'Recommended for scannability'
    },
    {
      label: 'SEO Meta Tags',
      value: hasSeoTitle && hasSeoDesc ? 'Optimized' : 'Incomplete',
      status: hasSeoTitle && hasSeoDesc ? 'pass' : 'warning',
      required: false,
      hint: hasSeoTitle && hasSeoDesc ? 'Title & description set' : 'Defaults to title & excerpt'
    },
    {
      label: 'Internal Links',
      value: hasInternalLinks ? 'Linked to website' : 'No internal links',
      status: hasInternalLinks ? 'pass' : 'warning',
      required: false,
      hint: hasInternalLinks ? 'Good site navigation' : 'Recommended: link to templates/maker'
    }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pre-publish-review-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200/80 flex items-center justify-center text-amber-900 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="pre-publish-review-title" className="text-base font-bold text-stone-900 font-cinzel">
                Pre-Publish Review Checklist
              </h2>
              <p className="text-xs text-stone-500">
                Review article readiness before deploying to the public website.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Target URL Card */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 font-mono tracking-wider">
              Public Live Destination URL
            </span>
            <div className="text-xs font-mono text-amber-900 font-semibold truncate">
              {publicUrl}
            </div>
          </div>

          {/* Checklist table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-800 font-cinzel block">
              Readiness Status
            </span>
            <div className="space-y-1.5 divide-y divide-stone-100">
              {reviewItems.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.status === 'pass' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : item.status === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="font-semibold text-stone-900">{item.label}</span>
                      <span className="text-[11px] text-stone-400 block truncate">{item.value}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'pass'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'error'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.hint}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Non-blocking Warning Policy Notice */}
          <div className="p-3 bg-stone-50/80 rounded-xl border border-stone-200/80 text-[11px] text-stone-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>
              <strong>Editorial Policy:</strong> Only Title, Slug, Category, and Content are hard requirements. Quality warnings provide guidance and do not block immediate publication.
            </span>
          </div>

          {!canPublish && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Please resolve all required fields highlighted above before publishing.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-100 flex items-center justify-between gap-3 bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer"
          >
            Back to Editor
          </button>
          <button
            type="button"
            disabled={!canPublish || isPublishing}
            onClick={onConfirmPublish}
            className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-2 min-h-[38px]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing Live...' : 'Confirm & Publish Live'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
