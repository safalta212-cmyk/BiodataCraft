import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO_KEYWORD_CATEGORIES, ALL_500_SEO_KEYWORDS } from '../../data/seoKeywords';
import { Search, Sparkles, ChevronDown, ChevronUp, Tag, Compass } from 'lucide-react';

export const KeywordDirectory: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Helper to map keyword to best internal destination
  const getKeywordDestination = (kw: string): string => {
    const lower = kw.toLowerCase();
    if (lower.includes('hindu') || lower.includes('हिन्दू')) return '/hindu-marriage-biodata';
    if (lower.includes('muslim') || lower.includes('nikah') || lower.includes('निकाह')) return '/muslim-marriage-biodata';
    if (lower.includes('yadav') || lower.includes('यादव')) return '/yadav-marriage-biodata';
    if (lower.includes('marathi') || lower.includes('मराठी')) return '/marathi-biodata';
    if (lower.includes('bengali') || lower.includes('बाँग्ला') || lower.includes('biye')) return '/bengali-marriage-biodata';
    if (lower.includes('sample') || lower.includes('नमूने') || lower.includes('उदाहरण')) return '/samples';
    if (lower.includes('format') || lower.includes('checklist') || lower.includes('प्रारूप')) return '/marriage-biodata-format';
    if (lower.includes('guide') || lower.includes('kaise banaye')) return '/marriage-biodata';
    return `/templates?q=${encodeURIComponent(kw)}`;
  };

  const filteredCategories = SEO_KEYWORD_CATEGORIES.map((cat) => {
    const matchingKeywords = cat.keywords.filter((kw) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return kw.toLowerCase().includes(q);
    });
    return {
      ...cat,
      keywords: matchingKeywords
    };
  }).filter((cat) => cat.keywords.length > 0);

  const totalFilteredCount = filteredCategories.reduce((acc, cat) => acc + cat.keywords.length, 0);

  return (
    <div className="w-full bg-stone-950/70 border border-stone-800 rounded-3xl p-5 sm:p-8 text-stone-300 shadow-inner">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Matrimonial Topic & Search Index (500+ Keywords)</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white font-cinzel mt-1">
            Explore Indian Communities, Astrological & Biodata Formats
          </h4>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Find tailored marriage biodata templates, regional caste traditions, Kundali gotra formats, and bilingual samples across India.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <span>{isExpanded ? 'Collapse Keyword Index' : 'Browse All 500+ Keywords'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Keyword Cloud Container */}
      {isExpanded && (
        <div className="mt-6 space-y-6 animate-fadeIn">
          {/* Quick Search & Category Selector */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 500+ keywords (e.g. Brahmin, Doctor, Gotra, NRI, Marathi)..."
                className="w-full pl-10 pr-4 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Quick Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveCategoryId('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  activeCategoryId === 'all'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                All Topics ({totalFilteredCount})
              </button>
              {SEO_KEYWORD_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                    activeCategoryId === cat.id
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Keywords Display Grid */}
          <div className="space-y-6 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCategories
              .filter((cat) => activeCategoryId === 'all' || activeCategoryId === cat.id)
              .map((category) => (
                <div key={category.id} className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-500" />
                      <span>{category.name}</span>
                      <span className="text-stone-500 text-[11px]">({category.hindiName})</span>
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      {category.keywords.length} terms
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {category.keywords.map((keyword, idx) => (
                      <Link
                        key={idx}
                        to={getKeywordDestination(keyword)}
                        className="px-2.5 py-1 bg-stone-900/90 hover:bg-amber-950/80 hover:text-amber-300 text-stone-300 hover:border-amber-600 border border-stone-800 rounded-lg text-[11px] transition-all cursor-pointer inline-block"
                        title={`Explore marriage biodata templates for ${keyword}`}
                      >
                        {keyword}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {totalFilteredCount === 0 && (
            <div className="text-center py-6 text-stone-500 text-xs">
              No matching keywords found for &quot;{searchQuery}&quot;. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
