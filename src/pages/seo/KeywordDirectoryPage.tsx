import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { SEO_KEYWORD_CATEGORIES } from '../../data/seoKeywords';
import { getSlugForKeyword } from '../../data/keywordCatalog';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Search, Compass, Tag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const KeywordDirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('all');

  useSEO({
    title: 'Indian Marriage Biodata Topics & Cultural Directory | BiodataCraft',
    description:
      'Explore 500+ matrimonial biodata formats across Indian communities, Vedic astrology, castes, professions, and regional languages. 100% free with instant PDF download.',
    canonicalPath: '/biodata',
    breadcrumbs: [{ name: 'Matrimonial Topics', path: '/biodata' }]
  });

  const filteredCategories = useMemo(() => {
    return SEO_KEYWORD_CATEGORIES.map((cat) => {
      const filteredKeywords = cat.keywords.filter((kw) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return kw.toLowerCase().includes(q);
      });
      return {
        ...cat,
        keywords: filteredKeywords
      };
    }).filter((cat) => cat.keywords.length > 0);
  }, [searchQuery]);

  const totalFiltered = filteredCategories.reduce((acc, cat) => acc + cat.keywords.length, 0);

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ name: 'Topics Directory', path: '/biodata' }]} />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>500+ Curated Indian Matrimonial Topics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel">
            Marriage Biodata Topics & Regional Formats
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Browse our comprehensive index of community traditions, Vedic astrology guides, career credentials, and regional formats for Indian weddings.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 500+ topics (e.g., Brahmin, Software Engineer, Gotra, NRI, Marathi, Yadav)..."
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-amber-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCatId('all')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium cursor-pointer transition-all ${
                selectedCatId === 'all'
                  ? 'bg-amber-800 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Categories ({totalFiltered})
            </button>
            {SEO_KEYWORD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium cursor-pointer transition-all ${
                  selectedCatId === cat.id
                    ? 'bg-amber-800 text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Listings by Category */}
        <div className="space-y-10">
          {filteredCategories
            .filter((cat) => selectedCatId === 'all' || selectedCatId === cat.id)
            .map((category) => (
              <div
                key={category.id}
                className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-cinzel flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-800" />
                      <span>{category.name}</span>
                    </h2>
                    <span className="text-xs text-stone-500 font-medium">
                      {category.hindiName}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full w-fit">
                    {category.keywords.length} Pages Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
                  {category.keywords.map((kw, idx) => {
                    const slug = getSlugForKeyword(kw);
                    return (
                      <Link
                        key={idx}
                        to={`/biodata/${slug}`}
                        className="p-3 bg-stone-50 hover:bg-amber-50 text-stone-800 hover:text-amber-900 border border-stone-200/80 hover:border-amber-300 rounded-xl transition-all font-medium flex items-center justify-between group shadow-2xs"
                      >
                        <span className="truncate pr-2">{kw}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

          {totalFiltered === 0 && (
            <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center space-y-3">
              <p className="text-stone-500 text-sm">
                No matching topics found for &quot;{searchQuery}&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-amber-800 hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
