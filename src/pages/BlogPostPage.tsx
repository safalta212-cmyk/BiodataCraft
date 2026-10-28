import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { blogService } from '../services/blogService';
import { BlogPost } from '../data/blogData';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { ResponsiveAd } from '../components/ads/ResponsiveAd';
import { ArrowLeft, Clock, User, Calendar, Share2, Sparkles, BookOpen } from 'lucide-react';
import { useToast } from '../context/ToastContext';

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
      : [{ name: 'Blog', path: '/blog' }],
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
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

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
                alt={post.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                loading="lazy"
                decoding="async"
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
              {(() => {
                const totalParagraphs = post.content.length;
                // Sensible content threshold: middle ad only rendered if article has at least 4 paragraphs
                const middleIndex = totalParagraphs >= 4 ? Math.floor(totalParagraphs / 2) : -1;

                const renderFormattedText = (text: string) => {
                  const parts = text.split(/(\*\*[^*]+\*\*)/g);
                  return parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="font-bold text-stone-900">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  });
                };

                const renderSafeBlock = (paragraph: string, key: React.Key) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={key} className="text-base sm:text-lg font-bold font-cinzel text-amber-950 mt-6 mb-2">
                        {renderFormattedText(trimmed.slice(4))}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={key} className="text-lg sm:text-xl font-bold font-cinzel text-amber-950 mt-7 mb-3 border-b border-stone-100 pb-2">
                        {renderFormattedText(trimmed.slice(3))}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith('> ')) {
                    return (
                      <blockquote key={key} className="border-l-4 border-amber-800 pl-4 py-2 italic text-stone-700 bg-amber-50/50 rounded-r-xl my-4">
                        {renderFormattedText(trimmed.slice(2))}
                      </blockquote>
                    );
                  }
                  if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                    return (
                      <div key={key} className="flex items-start gap-2.5 my-1.5 pl-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-800 mt-2 shrink-0" />
                        <span className="leading-relaxed text-stone-700">{renderFormattedText(trimmed.replace(/^[-•]\s*/, ''))}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={key} className="leading-relaxed text-stone-700">
                      {renderFormattedText(trimmed)}
                    </p>
                  );
                };

                return post.content.map((paragraph, idx) => (
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
                  <h4 className="font-bold text-amber-950 font-cinzel text-base">
                    Ready to put this advice into practice?
                  </h4>
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
