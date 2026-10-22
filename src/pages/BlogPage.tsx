import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { blogService } from '../services/blogService';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Form';
import { BookOpen, Clock, ArrowRight, Search, Sparkles } from 'lucide-react';

export const BlogPage: React.FC = () => {
  useSEO({
    title: 'Indian Matrimony Guides, Biodata Advice & Traditions | BiodataCraft',
    description:
      'Expert advice, formatting guidelines, and cultural etiquette for Indian marriage biodata creation.',
    canonicalPath: '/blog',
    breadcrumbs: [{ name: 'Blog', path: '/blog' }]
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const allPosts = blogService.getPosts();
  const categories = ['All', ...Array.from(new Set(allPosts.map((p) => p.category)))];

  const filteredPosts = blogService.getPosts({
    category: selectedCategory,
    search: searchTerm
  });

  return (
    <div className="min-h-screen bg-stone-50 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel">
            Indian Marriage Biodata Guides
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Essential etiquette, cultural traditions, horoscope details, and step-by-step formatting guides to present your family with dignity.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.slug}
              className="flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-bold text-amber-900 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h2 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors font-cinzel leading-snug">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </CardContent>

              <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>{post.publishedDate}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
