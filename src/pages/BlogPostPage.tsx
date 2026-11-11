import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { blogService } from '../services/blogService';
import { BlogPost } from '../data/blogData';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { ResponsiveAd } from '../components/ads/ResponsiveAd';
import { ArrowLeft, Clock, User, Calendar, Share2, Sparkles, BookOpen, ListTree } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const slugifyHeadingText = (text: string): string => {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip markdown links
    .replace(/[*_~`]/g, '')                   // strip markdown formatting
    .replace(/<[^>]+>/g, '')                  // strip inline HTML
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
};

interface TocHeadingItem {
  id: string;
  text: string;
  level: 2 | 3;
  children?: TocHeadingItem[];
}

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const isAdmin = typeof window !== 'undefined' && Boolean(sessionStorage.getItem('biodatacraft_admin_token'));
  const [post, setPost] = useState<BlogPost | null>(() => slug ? blogService.getPostBySlugSync(slug, isAdmin) : null);
  const [loading, setLoading] = useState<boolean>(!post);
  const [otherPosts, setOtherPosts] = useState<BlogPost[]>(() =>
    blogService.getPostsSync().filter((p) => (slug ? p.slug !== slug : true))
  );
  const toast = useToast();

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      blogService.getPostBySlug(slug, isAdmin).then((fetched) => {
        if (isMounted) {
          setPost(fetched);
          setLoading(false);
        }
      }).catch(() => {
        if (isMounted) setLoading(false);
      });

      blogService.getPosts().then((all) => {
        if (isMounted) {
          setOtherPosts(all.filter((p) => p.slug !== slug));
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [slug, isAdmin]);

  useSEO({
    title: post ? `${post.seoTitle || post.title} | BiodataCraft` : 'Article Not Found | BiodataCraft',
    description: post ? (post.seoDescription || post.excerpt) : 'The requested matrimonial article could not be found.',
    canonicalPath: post ? `/blog/${post.slug}` : '/blog',
    noindex: !post,
    ogType: 'article',
    ogImage: post?.featuredImage,
    breadcrumbs: post
      ? [
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` }
        ]
      : undefined,
    article: post
      ? {
          title: post.title,
          description: post.excerpt,
          url: `https://biodata-craft.vercel.app/blog/${post.slug}`,

          image: post.featuredImage,
          datePublished: post.createdAt,
          dateModified: post.updatedAt,
          authorName: post.author
        }
      : undefined
  });

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  // Split post content into clean, distinct paragraph blocks
  const contentBlocks = useMemo(() => {
    if (!post || !post.content) return [];
    const rawList = Array.isArray(post.content) ? post.content : [String(post.content || '')];
    const flattened: string[] = [];
    for (const item of rawList) {
      if (typeof item === 'string') {
        const parts = item.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
        if (parts.length > 0) {
          flattened.push(...parts);
        }
      }
    }
    return flattened;
  }, [post]);

  // Extract headings for Table of Contents
  const { tocItems, flatHeadings } = useMemo(() => {
    if (!contentBlocks || contentBlocks.length === 0) {
      return { tocItems: [], flatHeadings: [] };
    }

    const flat: Array<{ id: string; text: string; level: 2 | 3 }> = [];
    const idCountMap = new Map<string, number>();

    contentBlocks.forEach((block) => {
      const trimmed = block.trim();
      const isH2 = trimmed.startsWith('## ') && !trimmed.startsWith('### ');
      const isH3 = trimmed.startsWith('### ');

      if (isH2 || isH3) {
        const rawText = isH2 ? trimmed.slice(3) : trimmed.slice(4);
        const cleanText = rawText.replace(/[*_~`]/g, '').trim();
        const baseSlug = slugifyHeadingText(cleanText);
        const seenCount = idCountMap.get(baseSlug) || 0;
        idCountMap.set(baseSlug, seenCount + 1);
        const uniqueId = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount}`;

        flat.push({
          id: uniqueId,
          text: cleanText,
          level: isH2 ? 2 : 3
        });
      }
    });

    const rootItems: TocHeadingItem[] = [];
    let currentH2: TocHeadingItem | null = null;

    flat.forEach((h) => {
      if (h.level === 2) {
        currentH2 = { ...h, children: [] };
        rootItems.push(currentH2);
      } else if (h.level === 3) {
        if (currentH2) {
          currentH2.children = currentH2.children || [];
          currentH2.children.push({ ...h });
        } else {
          rootItems.push({ ...h });
        }
      }
    });

    return { tocItems: rootItems, flatHeadings: flat };
  }, [contentBlocks]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  // Scroll to hash target on initial load if present
  useEffect(() => {
    if (!loading && post && typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [loading, post]);

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">

      {!post ? (
        <div className="py-16 px-4">
          <ErrorState
            title="Article Not Found"
            message={`The requested article "${slug || ''}" could not be found or has not been published.`}
            showHomeButton
          />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Navigation Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Breadcrumbs
              items={[
                { name: 'Blog', path: '/blog' },
                { name: post.title }
              ]}
            />
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </Link>
          </div>

          {/* Article Header Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
              <span className="font-bold text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full">
                {post.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{post.publishedDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{post.readTime}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-cinzel leading-tight">
              {post.title}
            </h1>

            <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                  ✍️
                </div>
                <span className="font-semibold text-stone-700">{post.author}</span>
              </div>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors"
                title="Copy share link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs bg-stone-100">
              <img
                src={post.featuredImage}
                alt={`${post.title} - BiodataCraft Matrimonial Guide`}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Introduction */}
          {post.excerpt && (
            <div className="bg-amber-50/60 border-l-4 border-amber-800 rounded-2xl p-5 sm:p-6 shadow-2xs border border-amber-200/70">
              <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Blog Top Ad (rendered naturally below article introduction) */}
          <ResponsiveAd variant="blog-top" label="Advertisement" />

          {/* Article Body Content */}
          <Card>
            <CardContent className="p-6 sm:p-10 space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
              {/* Optional Table of Contents */}
              {post.enableTableOfContents && tocItems.length >= 2 && (
                <nav aria-label="Table of Contents" className="mb-8 p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-2xs font-sans not-prose">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-200/60">
                    <div className="flex items-center gap-2 text-amber-950 font-bold text-sm sm:text-base font-cinzel">
                      <ListTree className="w-4 h-4 text-amber-800" />
                      <span>Table of Contents</span>
                    </div>
                    <span className="text-[11px] font-medium text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                      {flatHeadings.length} Sections
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {tocItems.map((h2Item) => (
                      <li key={h2Item.id} className="space-y-1.5">
                        <a
                          href={`#${h2Item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(h2Item.id);
                          }}
                          className="text-stone-800 font-semibold hover:text-amber-900 transition-colors flex items-center gap-2 group cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-800 group-hover:scale-125 transition-transform shrink-0" />
                          <span className="hover:underline">{h2Item.text}</span>
                        </a>
                        {h2Item.children && h2Item.children.length > 0 && (
                          <ul className="pl-5 space-y-1 border-l border-amber-200/70 ml-1.5 mt-1">
                            {h2Item.children.map((h3Item) => (
                              <li key={h3Item.id}>
                                <a
                                  href={`#${h3Item.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(h3Item.id);
                                  }}
                                  className="text-stone-600 hover:text-amber-950 transition-colors flex items-center gap-1.5 py-0.5 text-xs group cursor-pointer"
                                >
                                  <span className="text-amber-800/60 font-mono text-[10px]">↳</span>
                                  <span className="hover:underline">{h3Item.text}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {(() => {
                const totalParagraphs = contentBlocks.length;
                const middleIndex = totalParagraphs >= 4 ? Math.floor(totalParagraphs / 2) : -1;
                const headingIdCountMap = new Map<string, number>();

                const renderFormattedText = (text: string): React.ReactNode => {
                  if (!text) return null;

                  // Regex matches both markdown links [label](url) and HTML links <a href="url">label</a>
                  const linkRegex = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
                  const parts: React.ReactNode[] = [];
                  let lastIndex = 0;
                  let match: RegExpExecArray | null;

                  const parseInlineStyles = (subText: string, keyPrefix: string): React.ReactNode[] => {
                    if (!subText) return [];
                    const pattern = /(\*\*[^*]+\*\*|<u>[^<]+<\/u>|~~[^~]+~~|<s>[^<]+<\/s>|\*[^*]+\*|`[^`]+`)/g;
                    const subParts = subText.split(pattern);
                    return subParts.map((subPart, i) => {
                      const subKey = `${keyPrefix}-${i}`;
                      if (subPart.startsWith('**') && subPart.endsWith('**')) {
                        return <strong key={subKey} className="font-bold text-stone-900">{subPart.slice(2, -2)}</strong>;
                      }
                      if (subPart.startsWith('<u>') && subPart.endsWith('</u>')) {
                        return <u key={subKey} className="underline decoration-amber-800/60 underline-offset-2">{subPart.slice(3, -4)}</u>;
                      }
                      if ((subPart.startsWith('~~') && subPart.endsWith('~~')) || (subPart.startsWith('<s>') && subPart.endsWith('</s>'))) {
                        const rawInner = subPart.startsWith('~~') ? subPart.slice(2, -2) : subPart.slice(3, -4);
                        return <s key={subKey} className="line-through text-stone-400">{rawInner}</s>;
                      }
                      if (subPart.startsWith('*') && subPart.endsWith('*')) {
                        return <em key={subKey} className="italic text-stone-800">{subPart.slice(1, -1)}</em>;
                      }
                      if (subPart.startsWith('`') && subPart.endsWith('`')) {
                        return <code key={subKey} className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono text-[11px]">{subPart.slice(1, -1)}</code>;
                      }
                      return subPart;
                    });
                  };

                  while ((match = linkRegex.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                      parts.push(...parseInlineStyles(text.substring(lastIndex, match.index), `txt-${match.index}`));
                    }

                    const isMarkdown = Boolean(match[1]);
                    const linkLabel = isMarkdown ? match[1] : match[4];
                    const linkHref = (isMarkdown ? match[2] : match[3]) || '#';

                    const isInternal =
                      linkHref.startsWith('/') ||
                      linkHref.startsWith('#') ||
                      (typeof window !== 'undefined' && linkHref.includes(window.location.host)) ||
                      linkHref.includes('biodata-craft') ||
                      linkHref.includes('biodatacraft');

                    let internalPath = linkHref;
                    if (isInternal && (linkHref.startsWith('http://') || linkHref.startsWith('https://'))) {
                      try {
                        const urlObj = new URL(linkHref);
                        internalPath = urlObj.pathname + urlObj.search + urlObj.hash;
                      } catch {
                        internalPath = linkHref;
                      }
                    }

                    if (linkHref.startsWith('#')) {
                      parts.push(
                        <a
                          key={`anchor-${match.index}`}
                          href={linkHref}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(linkHref.slice(1));
                          }}
                          className="text-amber-800 font-semibold underline decoration-amber-800/40 hover:text-amber-950 transition-colors cursor-pointer"
                        >
                          {parseInlineStyles(linkLabel, `lnk-anc-${match.index}`)}
                        </a>
                      );
                    } else if (isInternal) {
                      parts.push(
                        <Link
                          key={`link-${match.index}`}
                          to={internalPath}
                          className="text-amber-800 font-semibold underline decoration-amber-800/40 hover:text-amber-950 transition-colors cursor-pointer"
                        >
                          {parseInlineStyles(linkLabel, `lnk-in-${match.index}`)}
                        </Link>
                      );
                    } else {
                      parts.push(
                        <a
                          key={`link-${match.index}`}
                          href={linkHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-800 font-semibold underline decoration-amber-800/40 hover:text-amber-950 transition-colors cursor-pointer"
                        >
                          {parseInlineStyles(linkLabel, `lnk-out-${match.index}`)}
                        </a>
                      );
                    }

                    lastIndex = match.index + match[0].length;
                  }

                  if (lastIndex < text.length) {
                    parts.push(...parseInlineStyles(text.substring(lastIndex), `tail-${lastIndex}`));
                  }

                  return parts;
                };

                const renderSafeBlock = (paragraph: string, key: React.Key) => {
                  const trimmed = paragraph.trim();

                  // Horizontal Rule / Divider
                  if (/^---+|\*\*\*+$/.test(trimmed)) {
                    return <hr key={key} className="my-8 border-t border-stone-200/80" />;
                  }

                  // Inline Image ![alt](url "caption") or ![alt](url)
                  const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^"\s)]+)(?:\s+"([^"]*)")?\)$/);
                  if (imgMatch) {
                    const alt = imgMatch[1];
                    const src = imgMatch[2];
                    const caption = imgMatch[3];
                    return (
                      <figure key={key} className="my-6 rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-50 shadow-2xs">
                        <div className="max-h-[440px] overflow-hidden flex items-center justify-center bg-stone-100">
                          <img
                            src={src}
                            alt={alt || 'Article visual'}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-auto object-cover max-h-[440px]"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                        {(caption || alt) && (
                          <figcaption className="p-2.5 text-center text-xs text-stone-500 italic bg-stone-50 border-t border-stone-200/60 font-serif">
                            {caption || alt}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  // Markdown Table
                  if (trimmed.startsWith('|') && trimmed.includes('|')) {
                    const rows = trimmed
                      .split('\n')
                      .map((r) => r.trim())
                      .filter((r) => r.startsWith('|'));
                    if (rows.length >= 2) {
                      const parseRow = (rowStr: string) =>
                        rowStr
                          .slice(1, rowStr.endsWith('|') ? -1 : undefined)
                          .split('|')
                          .map((c) => c.trim());
                      const headerCols = parseRow(rows[0]);
                      const isSep = /^\|[\s-:]+\|/.test(rows[1]);
                      const bodyRows = rows.slice(isSep ? 2 : 1).map(parseRow);

                      return (
                        <div key={key} className="my-6 overflow-x-auto rounded-xl border border-stone-200/90 shadow-2xs bg-white">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-amber-50/80 border-b border-stone-200 text-amber-950 font-bold uppercase tracking-wider text-[11px]">
                                {headerCols.map((h, hIdx) => (
                                  <th key={hIdx} className="p-3">
                                    {renderFormattedText(h)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-stone-700">
                              {bodyRows.map((r, rIdx) => (
                                <tr key={rIdx} className="hover:bg-stone-50/60 transition-colors">
                                  {r.map((c, cIdx) => (
                                    <td key={cIdx} className="p-3 leading-relaxed">
                                      {renderFormattedText(c)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                  }

                  // Headings: H2, H3, H4 with anchor permalinks
                  if (trimmed.startsWith('#### ')) {
                    return (
                      <h4 key={key} className="text-sm sm:text-base font-bold font-cinzel text-amber-950 mt-5 mb-2">
                        {renderFormattedText(trimmed.slice(5))}
                      </h4>
                    );
                  }
                  if (trimmed.startsWith('### ')) {
                    const rawText = trimmed.slice(4);
                    const cleanText = rawText.replace(/[*_~`]/g, '').trim();
                    const baseSlug = slugifyHeadingText(cleanText);
                    const seenCount = headingIdCountMap.get(baseSlug) || 0;
                    headingIdCountMap.set(baseSlug, seenCount + 1);
                    const headingId = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount}`;
                    return (
                      <h3 id={headingId} key={key} className="scroll-mt-20 text-base sm:text-lg font-bold font-cinzel text-amber-950 mt-6 mb-2 flex items-center justify-between group">
                        <span>{renderFormattedText(rawText)}</span>
                        <a
                          href={`#${headingId}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(headingId);
                          }}
                          className="text-stone-300 opacity-0 group-hover:opacity-100 hover:text-amber-800 transition-opacity text-xs font-mono ml-2 cursor-pointer"
                          title="Section permalink"
                        >
                          #
                        </a>
                      </h3>
                    );
                  }
                  if (trimmed.startsWith('## ')) {
                    const rawText = trimmed.slice(3);
                    const cleanText = rawText.replace(/[*_~`]/g, '').trim();
                    const baseSlug = slugifyHeadingText(cleanText);
                    const seenCount = headingIdCountMap.get(baseSlug) || 0;
                    headingIdCountMap.set(baseSlug, seenCount + 1);
                    const headingId = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount}`;
                    return (
                      <h2 id={headingId} key={key} className="scroll-mt-20 text-lg sm:text-xl font-bold font-cinzel text-amber-950 mt-7 mb-3 border-b border-stone-200/60 pb-2 flex items-center justify-between group">
                        <span>{renderFormattedText(rawText)}</span>
                        <a
                          href={`#${headingId}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(headingId);
                          }}
                          className="text-stone-300 opacity-0 group-hover:opacity-100 hover:text-amber-800 transition-opacity text-xs font-mono ml-2 cursor-pointer"
                          title="Section permalink"
                        >
                          #
                        </a>
                      </h2>
                    );
                  }

                  // Blockquote
                  if (trimmed.startsWith('> ')) {
                    return (
                      <blockquote key={key} className="border-l-4 border-amber-800 pl-4 py-2 italic text-stone-700 bg-amber-50/50 rounded-r-xl my-4 leading-relaxed">
                        {renderFormattedText(trimmed.slice(2))}
                      </blockquote>
                    );
                  }

                  // Bullet List
                  if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
                    return (
                      <div key={key} className="flex items-start gap-2.5 my-1.5 pl-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-800 mt-2 shrink-0" />
                        <span className="leading-relaxed text-stone-700">{renderFormattedText(trimmed.replace(/^[-•*]\s*/, ''))}</span>
                      </div>
                    );
                  }

                  // Numbered List
                  if (/^\d+\.\s+/.test(trimmed)) {
                    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
                    return (
                      <div key={key} className="flex items-start gap-2.5 my-1.5 pl-2">
                        <span className="font-semibold text-amber-800 font-mono text-xs mt-0.5 shrink-0 min-w-[18px]">
                          {numMatch ? numMatch[1] : '1'}.
                        </span>
                        <span className="leading-relaxed text-stone-700">
                          {renderFormattedText(numMatch ? numMatch[2] : trimmed)}
                        </span>
                      </div>
                    );
                  }

                  // Standard Paragraph
                  return (
                    <p key={key} className="leading-relaxed text-stone-700 my-3">
                      {renderFormattedText(trimmed)}
                    </p>
                  );
                };

                return contentBlocks.map((paragraph, idx) => (
                  <React.Fragment key={idx}>
                    {renderSafeBlock(paragraph, idx)}
                    {idx === middleIndex && (
                      <div className="py-2">
                        <ResponsiveAd variant="blog-middle" label="Advertisement" />
                      </div>
                    )}
                  </React.Fragment>
                ));
              })()}

              <div className="mt-8 p-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-amber-950 font-cinzel text-base">
                    Ready to put this advice into practice?
                  </h3>
                  <p className="text-xs text-amber-900 mt-1">
                    Create your own marriage biodata with authentic Indian borders in minutes.
                  </p>
                </div>
                <Link to="/create">
                  <Button size="sm" variant="primary" className="shrink-0">
                    Create Free Biodata
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Blog Bottom Ad (rendered before related articles section) */}
          <ResponsiveAd variant="blog-bottom" label="Advertisement" />

          {/* Related Articles */}
          {otherPosts.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-base font-bold text-stone-900 font-cinzel">
                More Guides & Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherPosts.slice(0, 2).map((op) => (
                  <Card key={op.slug} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                        {op.category}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900 font-cinzel line-clamp-1">
                        <Link to={`/blog/${op.slug}`} className="hover:text-amber-800">
                          {op.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-2">{op.excerpt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
