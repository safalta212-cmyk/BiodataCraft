import React, { useState, useEffect, useTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Form';
import { templateService } from '../../services/templateService';
import { TEMPLATE_CATEGORIES } from '../../data/templateData';
import {
  Template,
  TemplateCategory,
  ReligionType,
  RegionType,
  LanguageFilterType,
  StyleType,
  TemplateConfig
} from '../../types/template';
import { useToast } from '../../context/ToastContext';
import { getTemplateDisplayThumbnail, generateTemplateSvgDataUri } from '../../utils/templateVisuals';
import {
  Palette,
  Eye,
  Plus,
  CheckCircle2,
  Crown,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  Search,
  Filter,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  LayoutGrid,
  List,
  RefreshCw,
  FileText,
  Sliders,
  Check
} from 'lucide-react';

const RELIGIONS: ReligionType[] = [
  'Hindu',
  'Muslim',
  'Jain',
  'Sikh',
  'Christian',
  'Universal'
];

const REGIONS: RegionType[] = [
  'North India',
  'South India',
  'West India',
  'East India',
  'Central India',
  'NRI / Global'
];

const LANGUAGES: LanguageFilterType[] = [
  'English',
  'Hindi',
  'Bilingual',
  'Any'
];

const STYLES: StyleType[] = [
  'Royal',
  'Vedic',
  'Contemporary',
  'Floral',
  'Minimalist',
  'Classic',
  'Traditional'
];

const DEFAULT_CONFIG: TemplateConfig = {
  primaryColor: '#7a1426',
  secondaryColor: '#c59b27',
  accentBg: '#fffaf5',
  cardBorder: '#e8c97e',
  fontFamily: 'cinzel',
  borderStyle: 'ornate',
  cornerStyle: 'fluted',
  headerStyle: 'royal',
  defaultSymbol: 'ganesh',
  defaultHeaderTitle: '॥ श्री गणेशाय नमः ॥',
  photoFrameStyle: 'arch',
  columns: 2,
  watermarkOpacity: 0.05
};

export const AdminTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [, startTransition] = useTransition();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & View State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [religionFilter, setReligionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'assets' | 'config'>('general');

  // Destructive Delete Confirmation Modal State
  const [deleteConfirmTemplate, setDeleteConfirmTemplate] = useState<Template | null>(null);
  const [deleteTypedSlug, setDeleteTypedSlug] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [categoryId, setCategoryId] = useState('traditional');
  const [religion, setReligion] = useState<ReligionType>('Hindu');
  const [region, setRegion] = useState<RegionType>('North India');
  const [language, setLanguage] = useState<LanguageFilterType>('Bilingual');
  const [style, setStyle] = useState<StyleType>('Royal');
  const [thumbnail, setThumbnail] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [popularFor, setPopularFor] = useState('');
  const [config, setConfig] = useState<TemplateConfig>(DEFAULT_CONFIG);

  // Asset Upload States
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingPreview, setIsUploadingPreview] = useState(false);
  const [thumbnailLoadError, setThumbnailLoadError] = useState(false);
  const [previewLoadError, setPreviewLoadError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tmpls, cats] = await Promise.all([
        templateService.getTemplates({ includeUnpublished: true, status: 'all', sortBy: 'sortOrder', forceRefresh: true }),
        templateService.getCategories()
      ]);
      setTemplates(tmpls);
      setCategories(cats);
    } catch (err) {
      console.error('Error loading admin templates:', err);
      toast.error('Failed to load templates from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuthed = Boolean(
      sessionStorage.getItem('biodatacraft_admin_token') ||
      sessionStorage.getItem('biodatacraft_admin_session_token') ||
      sessionStorage.getItem('biodatacraft_admin_auth_user') ||
      localStorage.getItem('biodatacraft_admin_token')
    );
    if (!isAuthed) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  // Open Editor for Creating New Template
  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setName('');
    setSlug('');
    setDescription('');
    setTagline('');
    setCategoryId(categories[0]?.id || 'traditional');
    setReligion('Hindu');
    setRegion('North India');
    setLanguage('Bilingual');
    setStyle('Royal');
    setThumbnail('');
    setPreviewImage('');
    setIsPremium(false);
    setIsPublished(true);
    setSortOrder(templates.length + 1);
    setSeoTitle('');
    setSeoDescription('');
    setPopularFor('Traditional North Indian Families');
    setConfig({ ...DEFAULT_CONFIG });
    setActiveTab('general');
    setIsEditorOpen(true);
  };

  // Open Editor for Editing Existing Template
  const handleOpenEditModal = (template: Template) => {
    setEditingTemplate(template);
    setName(template.name);
    setSlug(template.slug);
    setDescription(template.description || '');
    setTagline(template.tagline || '');
    setCategoryId(template.categoryId);
    setReligion(template.religion || 'Hindu');
    setRegion(template.region || 'North India');
    setLanguage(template.language || 'Bilingual');
    setStyle(template.style || 'Royal');
    setThumbnail(template.thumbnail || '');
    setPreviewImage(template.previewImage || '');
    setIsPremium(Boolean(template.isPremium));
    setIsPublished(Boolean(template.isPublished));
    setSortOrder(template.sortOrder || 1);
    setSeoTitle(template.seoTitle || '');
    setSeoDescription(template.seoDescription || '');
    setPopularFor(template.popularFor || '');
    setConfig({
      ...DEFAULT_CONFIG,
      ...(template.templateConfig || {})
    });
    setActiveTab('general');
    setIsEditorOpen(true);
  };

  // Handle Form Submission (Create or Update)
  const handleSaveTemplate = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault?.();
    if (isSaving) return; // Prevent accidental double-submit

    if (!name.trim()) {
      toast.error('Template Name is required.');
      return;
    }
    if (!slug.trim()) {
      toast.error('Template Slug is required.');
      return;
    }

    const formattedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const duplicate = templates.find(
      (t) => t.slug === formattedSlug && (!editingTemplate || t.id !== editingTemplate.id)
    );
    if (duplicate) {
      toast.error(`Slug "${formattedSlug}" is already in use by template "${duplicate.name}". Please specify a unique slug.`);
      return;
    }

    const selectedCat =
      categories.find((c) => c.id === categoryId) ||
      TEMPLATE_CATEGORIES.find((c) => c.id === categoryId) ||
      { id: categoryId, name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1) };

    // Auto-generate elegant SVG thumbnail if none provided
    let finalThumbnail = thumbnail.trim();
    if (!finalThumbnail) {
      finalThumbnail = generateTemplateSvgDataUri(
        name.trim(),
        config.primaryColor,
        config.secondaryColor,
        config.accentBg,
        style,
        config.defaultHeaderTitle
      );
      setThumbnail(finalThumbnail);
    }


    setIsSaving(true);
    try {
      const templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        slug: formattedSlug,
        description: description.trim(),
        tagline: tagline.trim() || 'Handcrafted Matrimonial Design',
        categoryId,
        categoryName: selectedCat.name || categoryId,
        religion,
        region,
        language,
        gender: 'Unisex',
        style,
        thumbnail: finalThumbnail,
        previewImage: previewImage.trim() || finalThumbnail,
        isFree: !isPremium,
        isPremium,
        isPublished,
        sortOrder: Number(sortOrder) || 1,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        popularFor: popularFor.trim() || `${region} ${religion} families`,
        templateConfig: config
      };

      if (editingTemplate) {
        await templateService.updateTemplate(editingTemplate.id, templateData);
        toast.success(`Template "${name}" updated successfully in Firestore.`);
      } else {
        await templateService.createTemplate(templateData);
        toast.success(`Template "${name}" created and saved to Firestore.`);
      }

      setIsEditorOpen(false);
      await loadData();
    } catch (err: any) {
      console.error('Save template error:', err);
      toast.error(err?.message || 'Failed to save template to Firestore. Please check your network connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Publish / Unpublish
  const handleTogglePublish = async (template: Template) => {
    const nextStatus = !template.isPublished;
    try {
      await templateService.updateTemplate(template.id, { isPublished: nextStatus });
      toast.success(
        nextStatus
          ? `Published "${template.name}". Now visible to users.`
          : `Unpublished "${template.name}". Set to Draft.`
      );
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? { ...t, isPublished: nextStatus } : t))
      );
    } catch {
      toast.error('Failed to update publication status.');
    }
  };

  // Duplicate Template
  const handleDuplicate = async (template: Template) => {
    try {
      const cloned = await templateService.duplicateTemplate(template.id);
      if (cloned) {
        toast.success(`Duplicated "${template.name}" as "${cloned.name}".`);
        loadData();
      }
    } catch {
      toast.error('Failed to duplicate template.');
    }
  };

  // Sort Order Reordering (Move Up / Down)
  const handleMoveSort = async (template: Template, direction: 'up' | 'down') => {
    const sorted = [...templates].sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = sorted.findIndex((t) => t.id === template.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    // Swap sort orders
    const targetTemplate = sorted[targetIndex];
    const currentOrder = template.sortOrder;
    const targetOrder = targetTemplate.sortOrder;

    startTransition(() => {
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.id === template.id) return { ...t, sortOrder: targetOrder };
          if (t.id === targetTemplate.id) return { ...t, sortOrder: currentOrder };
          return t;
        })
      );
    });

    try {
      await Promise.all([
        templateService.updateTemplate(template.id, { sortOrder: targetOrder }),
        templateService.updateTemplate(targetTemplate.id, { sortOrder: currentOrder })
      ]);
      toast.success(`Updated sort order for ${template.name}.`);
    } catch {
      toast.error('Failed to update sort order.');
      loadData();
    }
  };

  // Direct numeric sort order change
  const handleQuickSortChange = async (template: Template, newOrder: number) => {
    try {
      await templateService.updateTemplate(template.id, { sortOrder: newOrder });
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? { ...t, sortOrder: newOrder } : t))
      );
      toast.success(`Sort order set to #${newOrder}.`);
    } catch {
      toast.error('Failed to set sort order.');
    }
  };

  // Asset Upload to Firebase Storage
  const handleAssetUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'thumbnail' | 'preview'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check invalid MIME type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      toast.error('Invalid file type. Only JPEG, PNG, WEBP, and SVG images are supported.');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB maximum limit.');
      e.target.value = '';
      return;
    }

    if (type === 'thumbnail') setIsUploadingThumbnail(true);
    else setIsUploadingPreview(true);

    try {
      const url = await templateService.uploadTemplateAsset(file, file.name, type);
      if (type === 'thumbnail') {
        setThumbnail(url);
        toast.success('Thumbnail asset uploaded and live preview ready!');
      } else {
        setPreviewImage(url);
        toast.success('Preview image uploaded and showcase ready!');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Asset upload failed. Please try a valid image file.');
    } finally {
      if (type === 'thumbnail') setIsUploadingThumbnail(false);
      else setIsUploadingPreview(false);
      e.target.value = '';
    }
  };

  // Destructive Delete with Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmTemplate) return;

    setIsDeleting(true);
    try {
      await templateService.deleteTemplate(deleteConfirmTemplate.id);
      toast.success(`Template "${deleteConfirmTemplate.name}" permanently deleted.`);
      setDeleteConfirmTemplate(null);
      setDeleteTypedSlug('');
      loadData();
    } catch {
      toast.error('Failed to delete template.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter templates list client-side
  const filteredTemplates = templates.filter((tmpl) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        tmpl.name.toLowerCase().includes(q) ||
        tmpl.slug.toLowerCase().includes(q) ||
        tmpl.description.toLowerCase().includes(q) ||
        tmpl.popularFor.toLowerCase().includes(q) ||
        (tmpl.categoryName && tmpl.categoryName.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (categoryFilter !== 'all') {
      if (categoryFilter === 'premium') {
        const isPrem =
          tmpl.isPremium ||
          tmpl.categoryId === 'premium' ||
          tmpl.style === 'Royal' ||
          (tmpl.categoryName && tmpl.categoryName.toLowerCase().includes('premium'));
        if (!isPrem) return false;
      } else if (categoryFilter === 'royal') {
        const isRoyal =
          tmpl.style === 'Royal' ||
          tmpl.categoryId === 'royal' ||
          tmpl.isPremium ||
          (tmpl.categoryName && tmpl.categoryName.toLowerCase().includes('royal'));
        if (!isRoyal) return false;
      } else if (
        tmpl.categoryId !== categoryFilter &&
        !(tmpl.categoryName && tmpl.categoryName.toLowerCase().includes(categoryFilter.toLowerCase()))
      ) {
        return false;
      }
    }

    if (religionFilter !== 'all' && tmpl.religion !== religionFilter && tmpl.religion !== 'Universal') {
      return false;
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'published' && !tmpl.isPublished) return false;
      if (statusFilter === 'draft' && tmpl.isPublished) return false;
    }

    if (tierFilter !== 'all') {
      if (tierFilter === 'free' && tmpl.isPremium) return false;
      if (
        tierFilter === 'premium' &&
        !(
          tmpl.isPremium ||
          tmpl.style === 'Royal' ||
          tmpl.categoryId === 'premium' ||
          (tmpl.categoryName && tmpl.categoryName.toLowerCase().includes('premium'))
        )
      ) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => a.sortOrder - b.sortOrder);

  const totalCount = templates.length;
  const publishedCount = templates.filter((t) => t.isPublished).length;
  const draftCount = templates.filter((t) => !t.isPublished).length;
  const premiumCount = templates.filter((t) => t.isPremium).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                Phase 11 Inventory
              </span>
              <span className="text-xs text-stone-400">• Firestore Metadata & Storage Assets</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel">
              Template Inventory Management
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Create, configure, publish, and order matrimonial biodata designs.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              isLoading={loading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreateModal}
            >
              Add New Template
            </Button>
          </div>
        </div>

        {/* Quick Inventory Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Total Designs
            </span>
            <div className="text-2xl font-extrabold text-stone-900 mt-1">{totalCount}</div>
            <span className="text-[10px] text-stone-400">Inventory Catalog</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Published Live
            </span>
            <div className="text-2xl font-extrabold text-emerald-800 mt-1">{publishedCount}</div>
            <span className="text-[10px] text-emerald-600 font-medium">Accessible to Users</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Draft / Hidden
            </span>
            <div className="text-2xl font-extrabold text-amber-800 mt-1">{draftCount}</div>
            <span className="text-[10px] text-amber-600 font-medium">Unpublished</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Free vs Premium
            </span>
            <div className="text-2xl font-extrabold text-stone-900 mt-1">
              {totalCount - premiumCount} <span className="text-xs text-stone-400 font-normal">Free</span> • {premiumCount} <span className="text-xs text-stone-400 font-normal">VIP</span>
            </div>
            <span className="text-[10px] text-stone-400">Tier Distribution</span>
          </div>
        </div>

        {/* Search & Multi-filter Controls Bar */}
        <Card className="border-stone-200 shadow-xs">
          <CardContent className="p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search templates by name, slug, tagline, or culture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-sans"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 self-end md:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Dropdowns Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div>
                <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full text-xs py-1.5 px-2.5 rounded-xl border border-stone-200 bg-white focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2.5 rounded-xl border border-stone-200 bg-white focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                  Religion
                </label>
                <select
                  value={religionFilter}
                  onChange={(e) => setReligionFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2.5 rounded-xl border border-stone-200 bg-white focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Religions</option>
                  {RELIGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                  Tier
                </label>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as any)}
                  className="w-full text-xs py-1.5 px-2.5 rounded-xl border border-stone-200 bg-white focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Tiers</option>
                  <option value="free">Free Designs</option>
                  <option value="premium">Premium VIP</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Display Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-64 border-stone-200" />
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-stone-200 p-8">
            <Palette className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold font-cinzel text-stone-900">
              No matching templates found
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or clearing active filters to view all designs.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setReligionFilter('all');
                setStatusFilter('all');
                setTierFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tmpl, idx) => (
              <Card
                key={tmpl.id}
                className="flex flex-col justify-between border-stone-200 shadow-xs hover:shadow-md transition-all group overflow-hidden"
              >
                {/* Header Banner with Thumbnail Image, Primary & Secondary Colors */}
                <div
                  className="h-28 p-4 flex flex-col justify-between text-white relative transition-colors overflow-hidden"
                  style={{ backgroundColor: tmpl.templateConfig?.primaryColor || '#7a1426' }}
                >
                  {/* Background Thumbnail Image with Fallback */}
                  <img
                    src={getTemplateDisplayThumbnail(tmpl)}
                    alt={tmpl.name}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-55 group-hover:opacity-75 group-hover:scale-105 transition-all duration-300 pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-stone-950/20 pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/40 backdrop-blur-xs text-white border border-white/20">
                        #{tmpl.sortOrder}
                      </span>
                      {tmpl.isPremium && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-400 text-amber-950 flex items-center gap-0.5 shadow-2xs">
                          <Crown className="w-2.5 h-2.5" />
                          <span>VIP</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Sort Order Up / Down buttons */}
                      <button
                        type="button"
                        onClick={() => handleMoveSort(tmpl, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-black/30 hover:bg-black/50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-white backdrop-blur-xs"
                        title="Move Up in Order"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSort(tmpl, 'down')}
                        disabled={idx === filteredTemplates.length - 1}
                        className="p-1 rounded bg-black/30 hover:bg-black/50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-white backdrop-blur-xs"
                        title="Move Down in Order"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>

                      {/* Accent color dot */}
                      <span
                        className="w-4 h-4 rounded-full border-2 border-white shadow-2xs ml-1"
                        style={{ backgroundColor: tmpl.templateConfig?.secondaryColor || '#c59b27' }}
                        title="Secondary Accent Color"
                      />
                    </div>
                  </div>

                  <div className="z-10">
                    <h3 className="font-bold text-base font-cinzel text-white leading-tight drop-shadow-sm">
                      {tmpl.name}
                    </h3>
                    <span className="text-[11px] text-stone-200 line-clamp-1 mt-0.5">
                      {tmpl.tagline || `slug: ${tmpl.slug}`}
                    </span>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold">
                        {tmpl.categoryName || tmpl.categoryId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {tmpl.religion}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {tmpl.region}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono">
                        {tmpl.language}
                      </span>
                    </div>

                    <div className="mt-2.5 text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-xl font-medium border border-amber-200/50">
                      <strong>Best for:</strong> {tmpl.popularFor}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    {/* Publication Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(tmpl)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                        tmpl.isPublished
                          ? 'text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 border border-emerald-200'
                          : 'text-amber-800 bg-amber-100/70 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{tmpl.isPublished ? 'Published' : 'Draft'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Preview link */}
                      <Link
                        to={`/templates/${tmpl.slug}`}
                        title="Preview Template Page"
                        className="inline-flex items-center justify-center p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {/* Duplicate */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDuplicate(tmpl)}
                        className="px-2 text-stone-500 hover:text-amber-800"
                        title="Duplicate Template"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>

                      {/* Edit */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditModal(tmpl)}
                        className="text-xs"
                      >
                        Edit
                      </Button>

                      {/* Delete */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setDeleteConfirmTemplate(tmpl);
                          setDeleteTypedSlug('');
                        }}
                        className="px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Table View Mode */
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Template</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Religion & Region</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredTemplates.map((tmpl, idx) => (
                    <tr key={tmpl.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={tmpl.sortOrder}
                            onChange={(e) => handleQuickSortChange(tmpl, parseInt(e.target.value) || 1)}
                            className="w-12 py-1 px-1.5 text-center font-mono rounded border border-stone-200 text-xs bg-stone-50"
                          />
                          <button
                            type="button"
                            onClick={() => handleMoveSort(tmpl, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSort(tmpl, 'down')}
                            disabled={idx === filteredTemplates.length - 1}
                            className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={getTemplateDisplayThumbnail(tmpl)}
                            alt={tmpl.name}
                            className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0 shadow-2xs bg-stone-100"
                            loading="lazy"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{tmpl.name}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{tmpl.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                          {tmpl.categoryName || tmpl.categoryId}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {tmpl.religion} • {tmpl.region}
                      </td>

                      <td className="py-3 px-4">
                        {tmpl.isPremium ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            Premium
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                            Free
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(tmpl)}
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                            tmpl.isPublished
                              ? 'text-emerald-800 bg-emerald-100/70 border border-emerald-200'
                              : 'text-amber-800 bg-amber-100/70 border border-amber-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{tmpl.isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/templates/${tmpl.slug}`}
                            title="Preview Template Page"
                            className="inline-flex items-center justify-center p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicate(tmpl)}
                            className="px-2 text-stone-500 hover:text-amber-800"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEditModal(tmpl)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setDeleteConfirmTemplate(tmpl);
                              setDeleteTypedSlug('');
                            }}
                            className="px-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* TEMPLATE EDITOR MODAL (Supports Add & Edit with Tabs & Live Config) */}
      {/* ============================================================== */}
      {isEditorOpen && (
        <Modal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={editingTemplate ? `Edit Template: ${name}` : 'Add New Template'}
          description="Configure layout metadata, styling configuration, and upload storage assets."
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setIsEditorOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleSaveTemplate}
                isLoading={isSaving}
                disabled={isSaving || isUploadingThumbnail || isUploadingPreview}
              >
                {editingTemplate ? 'Save Changes' : 'Create Template'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Editor Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'general'
                    ? 'bg-amber-800 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                1. General Metadata
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('assets')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'assets'
                    ? 'bg-amber-800 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                2. Visual Assets & SEO
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('config')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'config'
                    ? 'bg-amber-800 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                3. Design Configuration
              </button>
            </div>

            {/* TAB 1: General Metadata */}
            {activeTab === 'general' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Template Name"
                    placeholder="e.g. Royal Heritage"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingTemplate) {
                        setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
                      }
                    }}
                    required
                  />

                  <Input
                    label="Slug (URL identifier)"
                    placeholder="e.g. royal-heritage"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    hint="Unique identifier used in URLs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Tagline / Short Hook"
                    placeholder="e.g. Timeless Rajasthani Mandap & Gold Fluting"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />

                  <Input
                    label="Best Suited For (Cultural Note)"
                    placeholder="e.g. North Indian Hindu, Rajput, Marwari families"
                    value={popularFor}
                    onChange={(e) => setPopularFor(e.target.value)}
                  />
                </div>

                <Textarea
                  label="Description"
                  placeholder="Elaborate on the aesthetic, typography, cultural motifs, and border design..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Select
                    label="Category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  />

                  <Select
                    label="Religion"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value as ReligionType)}
                    options={RELIGIONS.map((r) => ({ value: r, label: r }))}
                  />

                  <Select
                    label="Region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value as RegionType)}
                    options={REGIONS.map((r) => ({ value: r, label: r }))}
                  />

                  <Select
                    label="Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as LanguageFilterType)}
                    options={LANGUAGES.map((l) => ({ value: l, label: l }))}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                  <Select
                    label="Style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value as StyleType)}
                    options={STYLES.map((s) => ({ value: s, label: s }))}
                  />

                  <Input
                    label="Sort Order"
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                    hint="Priority in template catalogs"
                  />

                  <div className="flex flex-col justify-end space-y-2 pb-1">
                    <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="rounded border-stone-300 text-amber-800 focus:ring-amber-500"
                      />
                      <span className="font-bold text-xs">Published Live</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                      <input
                        type="checkbox"
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.target.checked)}
                        className="rounded border-stone-300 text-amber-800 focus:ring-amber-500"
                      />
                      <span className="font-bold text-xs">Mark as Premium VIP</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Visual Assets & SEO */}
            {activeTab === 'assets' && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl shrink-0 mt-0.5">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-amber-950 block text-xs">Firebase Storage Asset Uploader</span>
                    <p className="text-[11px] text-amber-900/80 leading-relaxed">
                      Upload banner previews and catalog thumbnails directly. Images are automatically optimized and compressed client-side (&lt;75KB) for instant frontend rendering and reliable cloud persistence.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Thumbnail */}
                  <div className="space-y-2 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-800">Thumbnail Asset</span>
                        <span className="text-[10px] text-stone-500">Catalog card preview</span>
                      </div>
                      <Input
                        placeholder="https://... or data:image/..."
                        value={thumbnail}
                        onChange={(e) => {
                          setThumbnail(e.target.value);
                          setThumbnailLoadError(false);
                        }}
                        hint="Direct image URL or optimized Data URI"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 cursor-pointer font-semibold text-xs shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-amber-800" />
                        <span>{isUploadingThumbnail ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAssetUpload(e, 'thumbnail')}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          const generated = generateTemplateSvgDataUri(
                            name || 'Royal Heritage',
                            config.primaryColor,
                            config.secondaryColor,
                            config.accentBg,
                            style,
                            config.defaultHeaderTitle
                          );
                          setThumbnail(generated);
                          setThumbnailLoadError(false);
                          toast.success('Generated Vedic vector card thumbnail!');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-100/70 hover:bg-amber-100 text-amber-900 font-bold text-xs cursor-pointer shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                        <span>Generate Vector</span>
                      </button>

                      {thumbnail && (
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnail('');
                            setThumbnailLoadError(false);
                          }}
                          className="px-2 py-1.5 text-stone-500 hover:text-red-600 text-xs font-semibold cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Live Preview Container */}
                    <div className="mt-2 h-44 rounded-xl overflow-hidden border border-stone-200 bg-stone-900/5 relative flex items-center justify-center p-2">
                      {thumbnail ? (
                        thumbnailLoadError ? (
                          <div className="text-center p-3 space-y-1">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto" />
                            <span className="text-[11px] text-stone-700 font-bold block">
                              Image could not be loaded
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              Check URL connectivity or generate a vector card.
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const generated = generateTemplateSvgDataUri(
                                  name || 'Royal Heritage',
                                  config.primaryColor,
                                  config.secondaryColor,
                                  config.accentBg,
                                  style,
                                  config.defaultHeaderTitle
                                );
                                setThumbnail(generated);
                                setThumbnailLoadError(false);
                              }}
                              className="mt-1 text-[11px] text-amber-800 font-bold underline cursor-pointer"
                            >
                              Auto-Generate Vector Card
                            </button>
                          </div>
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center group/preview">
                            <img
                              src={thumbnail}
                              alt="Thumbnail preview"
                              loading="lazy"
                              decoding="async"
                              className="h-full w-auto max-w-full object-contain rounded-lg shadow-sm"
                              onLoad={() => setThumbnailLoadError(false)}
                              onError={() => setThumbnailLoadError(true)}
                            />
                            <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-black/70 text-amber-200 border border-white/20 backdrop-blur-xs">
                              From BiodataCraft
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="text-center p-3 space-y-1">
                          <ImageIcon className="w-6 h-6 text-stone-400 mx-auto" />
                          <span className="text-[11px] text-stone-600 font-semibold block">
                            No custom thumbnail uploaded
                          </span>
                          <span className="text-[10px] text-stone-400 block max-w-xs">
                            Upload a JPEG/PNG/WebP, paste an image link, or generate an auspicious vector card.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview Image */}
                  <div className="space-y-2 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-800">Full Preview Image</span>
                        <span className="text-[10px] text-stone-500">High-res showcase image</span>
                      </div>
                      <Input
                        placeholder="https://... or data:image/..."
                        value={previewImage}
                        onChange={(e) => {
                          setPreviewImage(e.target.value);
                          setPreviewLoadError(false);
                        }}
                        hint="Used in full-screen showcase modal"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 cursor-pointer font-semibold text-xs shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-amber-800" />
                        <span>{isUploadingPreview ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAssetUpload(e, 'preview')}
                        />
                      </label>

                      {thumbnail && !previewImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(thumbnail);
                            setPreviewLoadError(false);
                            toast.success('Copied thumbnail to preview image!');
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer shadow-2xs"
                        >
                          Use Thumbnail
                        </button>
                      )}

                      {previewImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage('');
                            setPreviewLoadError(false);
                          }}
                          className="px-2 py-1.5 text-stone-500 hover:text-red-600 text-xs font-semibold cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Live Preview Container */}
                    <div className="mt-2 h-44 rounded-xl overflow-hidden border border-stone-200 bg-stone-900/5 relative flex items-center justify-center p-2">
                      {previewImage ? (
                        previewLoadError ? (
                          <div className="text-center p-3 space-y-1">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto" />
                            <span className="text-[11px] text-stone-700 font-bold block">
                              Showcase image could not be loaded
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              Check URL connectivity or upload a new file.
                            </span>
                          </div>
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <img
                              src={previewImage}
                              alt="Full preview"
                              loading="lazy"
                              decoding="async"
                              className="h-full w-auto max-w-full object-contain rounded-lg shadow-sm"
                              onLoad={() => setPreviewLoadError(false)}
                              onError={() => setPreviewLoadError(true)}
                            />
                            <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-black/70 text-amber-200 border border-white/20 backdrop-blur-xs">
                              From BiodataCraft
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="text-center p-3 space-y-1">
                          <ImageIcon className="w-6 h-6 text-stone-400 mx-auto" />
                          <span className="text-[11px] text-stone-600 font-semibold block">
                            No full showcase image uploaded
                          </span>
                          <span className="text-[10px] text-stone-400 block max-w-xs">
                            Upload a high-res screenshot or leave blank to mirror the thumbnail.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>


                {/* SEO Optimization */}
                <div className="pt-2 border-t border-stone-100 space-y-3">
                  <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-800" />
                    <span>Search Engine Optimization (SEO)</span>
                  </h4>

                  <Input
                    label="SEO Title Tag"
                    placeholder="e.g. Royal Heritage Matrimonial Biodata Template | Free Download"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    hint="Displayed in Google search results and browser title"
                  />

                  <Textarea
                    label="SEO Meta Description"
                    placeholder="e.g. Download authentic Rajasthani royal maroon matrimonial biodata template in Hindi & English..."
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Design Configuration */}
            {activeTab === 'config' && (
              <div className="space-y-4 text-xs">
                {/* Live Header Simulation */}
                <div
                  className="p-4 rounded-2xl text-white shadow-xs border transition-colors flex items-center justify-between"
                  style={{
                    backgroundColor: config.primaryColor,
                    borderColor: config.cardBorder
                  }}
                >
                  <div>
                    <span className="text-[10px] text-white/70 block uppercase font-mono">
                      Live Header Preview
                    </span>
                    <h3
                      className="text-base font-bold"
                      style={{
                        fontFamily:
                          config.fontFamily === 'cinzel'
                            ? 'Cinzel, serif'
                            : config.fontFamily === 'rozha'
                            ? 'Rozha One, serif'
                            : 'serif'
                      }}
                    >
                      {config.defaultHeaderTitle}
                    </h3>
                  </div>

                  <span
                    className="w-5 h-5 rounded-full border-2 border-white shadow-2xs shrink-0"
                    style={{ backgroundColor: config.secondaryColor }}
                    title="Secondary Color"
                  />
                </div>

                {/* Color Configuration Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Primary Color */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <label className="font-bold text-stone-700 block mb-1.5">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300"
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="w-full font-mono text-[11px] p-1 rounded border border-stone-300"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <label className="font-bold text-stone-700 block mb-1.5">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300"
                      />
                      <input
                        type="text"
                        value={config.secondaryColor}
                        onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                        className="w-full font-mono text-[11px] p-1 rounded border border-stone-300"
                      />
                    </div>
                  </div>

                  {/* Accent Background */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <label className="font-bold text-stone-700 block mb-1.5">Accent Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.accentBg}
                        onChange={(e) => setConfig({ ...config, accentBg: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300"
                      />
                      <input
                        type="text"
                        value={config.accentBg}
                        onChange={(e) => setConfig({ ...config, accentBg: e.target.value })}
                        className="w-full font-mono text-[11px] p-1 rounded border border-stone-300"
                      />
                    </div>
                  </div>

                  {/* Card Border */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <label className="font-bold text-stone-700 block mb-1.5">Card Border</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.cardBorder}
                        onChange={(e) => setConfig({ ...config, cardBorder: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300"
                      />
                      <input
                        type="text"
                        value={config.cardBorder}
                        onChange={(e) => setConfig({ ...config, cardBorder: e.target.value })}
                        className="w-full font-mono text-[11px] p-1 rounded border border-stone-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography and Stylistic Settings */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Select
                    label="Font Family"
                    value={config.fontFamily}
                    onChange={(e) => setConfig({ ...config, fontFamily: e.target.value as any })}
                    options={[
                      { value: 'cinzel', label: 'Cinzel Serif' },
                      { value: 'rozha', label: 'Rozha One Traditional' },
                      { value: 'playfair', label: 'Playfair Display' },
                      { value: 'sans', label: 'Modern Sans' }
                    ]}
                  />

                  <Select
                    label="Border Style"
                    value={config.borderStyle}
                    onChange={(e) => setConfig({ ...config, borderStyle: e.target.value as any })}
                    options={[
                      { value: 'ornate', label: 'Ornate Filigree' },
                      { value: 'mandap', label: 'Mandap Fluting' },
                      { value: 'floral', label: 'Floral Motif' },
                      { value: 'double', label: 'Double Classic' },
                      { value: 'clean', label: 'Clean Line' }
                    ]}
                  />

                  <Select
                    label="Corner Style"
                    value={config.cornerStyle}
                    onChange={(e) => setConfig({ ...config, cornerStyle: e.target.value as any })}
                    options={[
                      { value: 'fluted', label: 'Fluted Rajasthani' },
                      { value: 'arch', label: 'Mughal / Temple Arch' },
                      { value: 'rounded', label: 'Modern Rounded' },
                      { value: 'sharp', label: 'Sharp Geometric' }
                    ]}
                  />

                  <Select
                    label="Header Style"
                    value={config.headerStyle}
                    onChange={(e) => setConfig({ ...config, headerStyle: e.target.value as any })}
                    options={[
                      { value: 'royal', label: 'Royal Banner' },
                      { value: 'traditional', label: 'Traditional Mandap' },
                      { value: 'modern', label: 'Modern Clean' },
                      { value: 'minimal', label: 'Minimalist' }
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Default Header Shloka / Title"
                    value={config.defaultHeaderTitle}
                    onChange={(e) => setConfig({ ...config, defaultHeaderTitle: e.target.value })}
                  />

                  <Select
                    label="Default Auspicious Symbol"
                    value={config.defaultSymbol}
                    onChange={(e) => setConfig({ ...config, defaultSymbol: e.target.value })}
                    options={[
                      { value: 'ganesh', label: 'Lord Ganesha (ॐ श्री गणेशाय नमः)' },
                      { value: 'om', label: 'Om (ॐ)' },
                      { value: 'swastik', label: 'Swastika (卐)' },
                      { value: 'kalash', label: 'Mangal Kalash' },
                      { value: 'ek_onkar', label: 'Ek Onkar (ੴ)' },
                      { value: 'bismillah', label: 'Bismillah' },
                      { value: 'cross', label: 'Christian Cross' },
                      { value: 'floral', label: 'Floral Neutral Emblem' }
                    ]}
                  />

                  <Select
                    label="Layout Columns"
                    value={String(config.columns)}
                    onChange={(e) => setConfig({ ...config, columns: parseInt(e.target.value) as 1 | 2 })}
                    options={[
                      { value: '2', label: '2 Columns (Standard Balance)' },
                      { value: '1', label: '1 Column (Vertical Full)' }
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ============================================================== */}
      {/* DESTRUCTIVE ACTION CONFIRMATION DIALOG (Prevents Accidental Deletion) */}
      {/* ============================================================== */}
      {deleteConfirmTemplate && (
        <Modal
          isOpen={Boolean(deleteConfirmTemplate)}
          onClose={() => setDeleteConfirmTemplate(null)}
          title="Delete Template Permanently"
          description="Destructive action confirmation required."
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeleteConfirmTemplate(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleDeleteConfirm}
                isLoading={isDeleting}
                disabled={deleteTypedSlug !== deleteConfirmTemplate.slug}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Confirm Delete
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block text-red-950">
                  Are you sure you want to delete this template?
                </span>
                <p className="mt-1 text-red-900/80 leading-relaxed">
                  This will permanently delete the metadata for{' '}
                  <strong className="font-mono font-bold text-red-950">{deleteConfirmTemplate.name}</strong> from Firestore.
                  Existing links referencing slug{' '}
                  <code className="bg-red-100 px-1 py-0.5 rounded font-mono font-bold">
                    {deleteConfirmTemplate.slug}
                  </code>{' '}
                  will no longer work.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-stone-700 block font-medium">
                To prevent accidental deletion, type the slug{' '}
                <strong className="font-mono text-red-700 font-bold">
                  {deleteConfirmTemplate.slug}
                </strong>{' '}
                below:
              </label>
              <input
                type="text"
                placeholder={deleteConfirmTemplate.slug}
                value={deleteTypedSlug}
                onChange={(e) => setDeleteTypedSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
};
