import React, { useState, useEffect, useMemo } from 'react';
import { BlogPost, BLOG_POSTS } from '../../../data/blogData';
import { blogService } from '../../../services/blogService';
import { INITIAL_TEMPLATES } from '../../../data/templateData';
import {
  Search,
  Link as LinkIcon,
  X,
  FileText,
  Layout,
  BookOpen,
  Sparkles,
  ExternalLink,
  Check,
  Tag
} from 'lucide-react';

export interface InternalLinkItem {
  id: string;
  title: string;
  url: string;
  category: 'article' | 'template' | 'format' | 'tool';
  description: string;
  badge: string;
}

interface InternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertLink: (anchorText: string, url: string) => void;
  existingPosts?: BlogPost[];
  initialSearchQuery?: string;
  initialAnchorText?: string;
}

export const InternalLinkModal: React.FC<InternalLinkModalProps> = ({
  isOpen,
  onClose,
  onInsertLink,
  existingPosts = [],
  initialSearchQuery = '',
  initialAnchorText = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'article' | 'template' | 'format' | 'tool'>('all');
  const [customAnchorText, setCustomAnchorText] = useState(initialAnchorText);
  const [selectedItem, setSelectedItem] = useState<InternalLinkItem | null>(null);
  const [livePosts, setLivePosts] = useState<BlogPost[]>(existingPosts);

  // Synchronize when modal opens or initial search query / anchor text changes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialSearchQuery || '');
      setCustomAnchorText(initialAnchorText || '');
      setSelectedItem(null);
    }
  }, [isOpen, initialSearchQuery, initialAnchorText]);

  // Synchronize when existingPosts changes from parent
  useEffect(() => {
    if (existingPosts && existingPosts.length > 0) {
      setLivePosts(existingPosts);
    }
  }, [existingPosts]);

  // Fetch latest real articles directly from database when modal opens
  useEffect(() => {
    if (isOpen) {
      blogService
        .getPosts({ includeUnpublished: true, forceRefresh: true })
        .then((fetched) => {
          if (fetched && fetched.length > 0) {
            setLivePosts(fetched);
          }
        })
        .catch(() => {
          // Graceful fallback to existingPosts
        });
    }
  }, [isOpen]);

  // Build the comprehensive directory of actual existing website routes
  const linkDirectory = useMemo<InternalLinkItem[]>(() => {
    const list: InternalLinkItem[] = [];

    // 1. Core Tools & Public Creation Pages
    list.push(
      {
        id: 'tool-maker',
        title: 'Create Marriage Biodata Online',
        url: '/create',
        category: 'tool',
        description: 'Interactive maker to generate professional PDF biodata with authentic borders.',
        badge: 'Core Tool'
      },
      {
        id: 'tool-templates-catalog',
        title: 'Marriage Biodata Templates Catalog',
        url: '/templates',
        category: 'tool',
        description: 'Browse all traditional, modern, minimal, and royal biodata templates.',
        badge: 'Catalog'
      },
      {
        id: 'tool-samples',
        title: 'Biodata Samples & Example Profiles',
        url: '/samples',
        category: 'tool',
        description: 'Curated Indian matrimonial sample profiles for brides and grooms.',
        badge: 'Samples'
      },
      {
        id: 'tool-blog-home',
        title: 'BiodataCraft Matrimonial Blog & Guides',
        url: '/blog',
        category: 'tool',
        description: 'Editorial directory of wedding, biodata, Gotra, and Kundali guides.',
        badge: 'Editorial'
      }
    );

    // 2. High-Value Cultural Format Pages (Real App.tsx routes)
    list.push(
      {
        id: 'format-general',
        title: 'Complete Marriage Biodata Guide',
        url: '/marriage-biodata',
        category: 'format',
        description: 'Comprehensive guide covering essential matrimonial biodata sections and advice.',
        badge: 'Guide'
      },
      {
        id: 'format-download',
        title: 'Marriage Biodata Format for Download',
        url: '/marriage-biodata-format',
        category: 'format',
        description: 'Free printable and PDF format layouts for Indian matrimonial proposals.',
        badge: 'Format'
      },
      {
        id: 'format-hindu',
        title: 'Hindu Marriage Biodata Format (Gotra & Kundali)',
        url: '/hindu-marriage-biodata',
        category: 'format',
        description: 'Specialized layout featuring Ganesh shloka, Gotra, Rashi, and horoscope match.',
        badge: 'Hindu'
      },
      {
        id: 'format-muslim',
        title: 'Muslim Marriage Biodata Format (Nikah Biodata)',
        url: '/muslim-marriage-biodata',
        category: 'format',
        description: 'Islamic biodata layout with Bismillah header, Maslak, and Deen details.',
        badge: 'Muslim'
      },
      {
        id: 'format-marathi',
        title: 'Marathi Lagna Biodata Format (लग्न बायोडाटा)',
        url: '/marathi-biodata',
        category: 'format',
        description: 'Authentic Maharashtrian format with Kuldaivat, Devak, and Mosal sections.',
        badge: 'Marathi'
      },
      {
        id: 'format-bengali',
        title: 'Bengali Matrimonial Biodata Format (বিবাহের বায়োডাটা)',
        url: '/bengali-marriage-biodata',
        category: 'format',
        description: 'Traditional Bengali layout with Bor-Kone patrika and family heritage.',
        badge: 'Bengali'
      },
      {
        id: 'format-yadav',
        title: 'Yadav Samaj Marriage Biodata Format',
        url: '/yadav-marriage-biodata',
        category: 'format',
        description: 'Community-specific matrimonial format with clan and maternal details.',
        badge: 'Community'
      },
      {
        id: 'format-directory',
        title: 'Matrimonial Topic & Keyword Directory',
        url: '/biodata',
        category: 'format',
        description: 'Comprehensive directory of regional communities and astrological keywords.',
        badge: 'Directory'
      }
    );

    // 3. Real Templates from INITIAL_TEMPLATES
    INITIAL_TEMPLATES.forEach((tmpl) => {
      list.push({
        id: `template-${tmpl.slug}`,
        title: `${tmpl.name} Template`,
        url: `/templates/${tmpl.slug}`,
        category: 'template',
        description: tmpl.description || `${tmpl.style} style template.`,
        badge: tmpl.categoryName || 'Biodata Template'
      });
    });

    // 4. Real Blog Articles (Merged from livePosts and default BLOG_POSTS)
    const postMap = new Map<string, BlogPost>();
    BLOG_POSTS.forEach((p) => postMap.set(p.slug, p));
    livePosts.forEach((p) => postMap.set(p.slug, p));

    Array.from(postMap.values()).forEach((p) => {
      list.push({
        id: `article-${p.slug}`,
        title: p.title,
        url: `/blog/${p.slug}`,
        category: 'article',
        description: p.excerpt || 'Published matrimonial advice guide.',
        badge: p.category || 'Guide'
      });
    });

    return list;
  }, [livePosts]);

  // Filter based on search query and category
  const filteredLinks = useMemo(() => {
    let result = linkDirectory;

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.url.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
      );
    }

    return result;
  }, [linkDirectory, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSelectLink = (item: InternalLinkItem) => {
    setSelectedItem(item);
    if (!customAnchorText.trim()) {
      setCustomAnchorText(item.title);
    }
  };

  const handleApplyInsert = () => {
    if (!selectedItem) return;
    const finalAnchor = customAnchorText.trim() || selectedItem.title;
    onInsertLink(finalAnchor, selectedItem.url);
    onClose();
  };

  const handleQuickInsert = (item: InternalLinkItem) => {
    const finalAnchor = customAnchorText.trim() || item.title;
    onInsertLink(finalAnchor, item.url);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="internal-link-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200/80 flex items-center justify-center text-amber-900 shadow-2xs">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="internal-link-modal-title" className="text-base font-bold text-stone-900 font-cinzel">
                Internal Link Suggestions
              </h2>
              <p className="text-xs text-stone-500">
                Link to verified BiodataCraft articles, templates, formats, and tools.
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

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, template name, religion, or URL (e.g. Kundali, Royal, /create)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10 font-sans"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(
              [
                { id: 'all', label: `All Routes (${linkDirectory.length})` },
                { id: 'article', label: 'Articles' },
                { id: 'template', label: 'Templates' },
                { id: 'format', label: 'Cultural Formats' },
                { id: 'tool', label: 'Tools & Maker' }
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                  selectedCategory === cat.id
                    ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 divide-y divide-stone-100 max-h-[380px]">
          {filteredLinks.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-30 text-stone-400" />
              <p className="text-xs font-medium text-stone-600">No matching website pages found.</p>
              <p className="text-[11px] text-stone-400">
                Try searching for keywords like "marriage", "kundali", "templates", or "gotra".
              </p>
            </div>
          ) : (
            filteredLinks.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectLink(item)}
                  className={`pt-2.5 first:pt-0 p-3 rounded-2xl transition-all cursor-pointer group flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-50/70 border border-amber-300 ring-2 ring-amber-700/10'
                      : 'hover:bg-stone-50 border border-transparent hover:border-stone-200'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-stone-900 group-hover:text-amber-900 transition-colors">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200/60 shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{item.description}</p>
                    <code className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50 inline-block">
                      {item.url}
                    </code>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickInsert(item);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-amber-800 hover:text-white hover:border-amber-800 text-[11px] font-medium transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      title="Insert with page title as anchor text"
                    >
                      <PlusIcon className="w-3 h-3" />
                      <span>Insert</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Link & Custom Anchor Text Form */}
        {selectedItem && (
          <div className="p-4 sm:p-5 bg-amber-50/50 border-t border-amber-200/70 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
              <span className="flex items-center gap-1.5 text-amber-900">
                <Check className="w-4 h-4 text-emerald-600" />
                Selected: <strong className="font-mono text-[11px]">{selectedItem.url}</strong>
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Custom Anchor Text</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={customAnchorText}
                  onChange={(e) => setCustomAnchorText(e.target.value)}
                  placeholder="Anchor text to display in article (e.g. explore marriage biodata templates)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-amber-700 font-sans"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyInsert}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0 min-h-[36px]"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Insert Link</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 bg-stone-50">
          <span>{filteredLinks.length} internal routes indexed</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}
