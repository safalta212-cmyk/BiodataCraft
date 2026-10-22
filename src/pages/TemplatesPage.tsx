import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { templateService } from '../services/templateService';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { Template, TemplateCategory, TemplateFilterParams } from '../types/template';
import { TemplateCard } from '../components/templates/TemplateCard';
import { TemplatePreviewModal } from '../components/templates/TemplatePreviewModal';
import { Input, Select } from '../components/ui/Form';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';
import { ResponsiveAd } from '../components/ads/ResponsiveAd';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Layers,
  Filter
} from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  useSEO({
    title: 'Marriage Biodata Templates - Vedic, Royal & Modern Designs | BiodataCraft',
    description:
      'Browse professional Indian marriage biodata designs: Traditional, Modern, Royal Mandap, Vedic, Muslim Nikah, and Regional templates. 100% Free, no login required.',
    canonicalPath: '/templates',
    breadcrumbs: [{ name: 'Templates', path: '/templates' }]
  });

  const navigate = useNavigate();

  // State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [religion, setReligion] = useState('all');
  const [region, setRegion] = useState('all');
  const [language, setLanguage] = useState('all');
  const [tier, setTier] = useState<'all' | 'free' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'name' | 'sortOrder'>('popular');

  // Pagination / Load more
  const [visibleCount, setVisibleCount] = useState(6);

  // Modal preview
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Advanced filter drawer toggle on mobile
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [cats, tmpls] = await Promise.all([
          templateService.getCategories(),
          templateService.getTemplates()
        ]);
        if (isMounted) {
          setCategories(cats);
          setTemplates(tmpls);
        }
      } catch (err) {
        console.error('Error fetching template catalog:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Sort Logic
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term) ||
          t.popularFor.toLowerCase().includes(term) ||
          t.tagline.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.categoryId === selectedCategory);
    }

    if (religion !== 'all') {
      result = result.filter((t) => t.religion === religion || t.religion === 'Universal');
    }

    if (region !== 'all') {
      result = result.filter((t) => t.region === region || t.region === 'NRI / Global');
    }

    if (language !== 'all') {
      result = result.filter(
        (t) => t.language === language || t.language === 'Bilingual' || t.language === 'Any'
      );
    }

    if (tier !== 'all') {
      if (tier === 'free') {
        result = result.filter((t) => t.isFree && !t.isPremium);
      } else if (tier === 'premium') {
        result = result.filter((t) => t.isPremium);
      }
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
      case 'sortOrder':
      default:
        result.sort((a, b) => a.sortOrder - b.sortOrder);
        break;
    }

    return result;
  }, [templates, search, selectedCategory, religion, region, language, tier, sortBy]);

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTemplates.length;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setReligion('all');
    setRegion('all');
    setLanguage('all');
    setTier('all');
    setSortBy('popular');
    setVisibleCount(6);
  };

  const handleUseTemplate = (template: Template) => {
    analyticsService.trackTemplateSelected(template.slug, 'templates_gallery');
    const existing = storageService.loadLocalDraft();
    storageService.saveLocalDraft({
      ...existing,
      templateId: template.slug as any,
      themeColor: template.templateConfig.primaryColor,
      fontFamily: template.templateConfig.fontFamily
    });
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span>100% Free • Publication Grade A4 Vector Exports</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel tracking-tight">
            Indian Marriage Biodata Templates
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Choose from authentic cultural layouts crafted for traditional arranged introductions and contemporary NRI proposals. Custom shlokas, gotra layouts, and elegant gold borders.
          </p>
        </div>

        {/* Primary Search & Category Quick Pills */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1">
              <Input
                placeholder="Search templates by style, community, or region (e.g. Marwari, Vedic, Saffron)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="bg-white shadow-2xs"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              leftIcon={<Filter className="w-4 h-4 text-amber-800" />}
              className="w-full sm:w-auto shrink-0 shadow-2xs"
            >
              <span>{showAdvancedFilters ? 'Hide Filters' : 'Filter & Sort'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showAdvancedFilters ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>

          {/* Quick Category Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              All Categories ({templates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-800 text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900 font-cinzel flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-800" />
                <span>Multi-Criteria Filtering</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Religion */}
              <Select
                label="Religion / Faith"
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                options={[
                  { value: 'all', label: 'All Religions' },
                  { value: 'Hindu', label: 'Hindu (Vedic / Sanatan)' },
                  { value: 'Muslim', label: 'Muslim (Nikah)' },
                  { value: 'Jain', label: 'Jain (Digambar/Shwetambar)' },
                  { value: 'Sikh', label: 'Sikh (Anand Karaj)' },
                  { value: 'Universal', label: 'Universal / Secular' }
                ]}
              />

              {/* Region */}
              <Select
                label="Indian Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                options={[
                  { value: 'all', label: 'All Regions' },
                  { value: 'North India', label: 'North India (Delhi/UP/Punjab/Raj)' },
                  { value: 'West India', label: 'West India (Gujarat/Maharashtra)' },
                  { value: 'South India', label: 'South India' },
                  { value: 'Central India', label: 'Central India (MP/CG)' },
                  { value: 'NRI / Global', label: 'NRI / Global' }
                ]}
              />

              {/* Language */}
              <Select
                label="Primary Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={[
                  { value: 'all', label: 'All Languages' },
                  { value: 'English', label: 'English' },
                  { value: 'Hindi', label: 'हिन्दी (Hindi Devanagari)' },
                  { value: 'Bilingual', label: 'Bilingual (Both)' }
                ]}
              />

              {/* Tier */}
              <Select
                label="License Tier"
                value={tier}
                onChange={(e) => setTier(e.target.value as any)}
                options={[
                  { value: 'all', label: 'All Designs' },
                  { value: 'free', label: '100% Free Layouts' },
                  { value: 'premium', label: 'Premium Royal Layouts' }
                ]}
              />

              {/* Sort By */}
              <Select
                label="Sort Order"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                options={[
                  { value: 'popular', label: 'Most Popular' },
                  { value: 'newest', label: 'Newest Additions' },
                  { value: 'name', label: 'Alphabetical (A-Z)' }
                ]}
              />
            </div>
          </div>
        )}

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
          <span>
            Showing <strong className="text-stone-900">{visibleTemplates.length}</strong> of{' '}
            <strong className="text-stone-900">{filteredTemplates.length}</strong> templates
          </span>

          {(selectedCategory !== 'all' ||
            religion !== 'all' ||
            region !== 'all' ||
            language !== 'all' ||
            tier !== 'all' ||
            search) && (
            <button
              onClick={handleResetFilters}
              className="text-amber-800 hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Templates Grid or Empty State */}
        {isLoading ? (
          <div className="py-20 text-center">
            <Loading text="Loading authentic Indian template collection..." size="lg" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <EmptyState
            title="No Matching Templates Found"
            description="Try adjusting your filter options or search terms to browse other regional and cultural designs."
            actionText="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={(tmpl) => {
                  analyticsService.trackTemplateView(tmpl.slug);
                  setPreviewTemplate(tmpl);
                }}
                onUseTemplate={handleUseTemplate}
              />
            ))}
          </div>
        )}

        {/* Load More Pagination Button */}
        {hasMore && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 shadow-xs font-bold"
            >
              Load More Templates ({filteredTemplates.length - visibleCount} remaining)
            </Button>
          </div>
        )}

        {/* AdSense Placement Space */}
        <ResponsiveAd variant="horizontal-leaderboard" monetizationLevel="TEMPLATE" />
      </div>

      {/* Full Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={(tmpl) => {
          setPreviewTemplate(null);
          handleUseTemplate(tmpl);
        }}
      />
    </div>
  );
};
