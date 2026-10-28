import React, { useEffect, useState, useTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Form';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../data/blogData';
import { useToast } from '../../context/ToastContext';
import {
  BookOpen,
  Plus,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  Edit,
  Search,
  Filter,
  Image as ImageIcon,
  Sparkles,
  FileText,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Upload
} from 'lucide-react';


const DEFAULT_CATEGORIES = [
  'Guides',
  'Culture & Tradition',
  'Tips & Etiquette',
  'Astrology & Kundali',
  'Family & Matrimony'
];

export const AdminBlogPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [, startTransition] = useTransition();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  // Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Destructive Delete State
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<BlogPost | null>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Guides');
  const [customCategory, setCustomCategory] = useState('');
  const [author, setAuthor] = useState('Editorial Team');
  const [readTime, setReadTime] = useState('5 min read');
  const [featuredImage, setFeaturedImage] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadPosts = async () => {
    setLoading(true);
    try {
      const allPosts = await blogService.getPosts({ includeUnpublished: true, forceRefresh: true });
      setPosts(allPosts);
    } catch {
      toast.error('Failed to load blog articles from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      toast.error('Invalid file type. Only JPEG, PNG, WEBP, and SVG images are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB maximum limit.');
      e.target.value = '';
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await blogService.uploadBlogImage(file);
      setFeaturedImage(url);
      toast.success('Featured image uploaded successfully.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('biodatacraft_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadPosts();
  }, [navigate]);


  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCategory('Guides');
    setCustomCategory('');
    setAuthor('Editorial Team');
    setReadTime('5 min read');
    setFeaturedImage('');
    setContentBody('');
    setSeoTitle('');
    setSeoDescription('');
    setIsPublished(true);
    setFormErrors({});
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    if (DEFAULT_CATEGORIES.includes(post.category)) {
      setCategory(post.category);
      setCustomCategory('');
    } else {
      setCategory('Custom');
      setCustomCategory(post.category);
    }
    setAuthor(post.author || 'Editorial Team');
    setReadTime(post.readTime || '5 min read');
    setFeaturedImage(post.featuredImage || '');
    setContentBody(Array.isArray(post.content) ? post.content.join('\n\n') : String(post.content || ''));
    setSeoTitle(post.seoTitle || post.title);
    setSeoDescription(post.seoDescription || post.excerpt);
    setIsPublished(post.isPublished !== false);
    setFormErrors({});
    setIsEditorOpen(true);
  };

  // Form Validation & Save
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaving) return; // Prevent double-submit

    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Article title is required.';
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!cleanSlug) {
      errors.slug = 'Slug identifier is required.';
    } else if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens.';
    } else {
      const duplicate = posts.find(
        (p) => p.slug === cleanSlug && (!editingPost || p.id !== editingPost.id)
      );
      if (duplicate) {
        errors.slug = `Slug "${cleanSlug}" is already in use by article "${duplicate.title}". Please choose a unique slug.`;
      }
    }

    if (!contentBody.trim()) {
      errors.content = 'Article content is required and cannot be empty.';
    }

    if (featuredImage.trim()) {
      const isHttp = /^https?:\/\/.+/i.test(featuredImage.trim());
      const isDataImg = /^data:image\/(jpeg|png|webp|svg\+xml);base64,/i.test(featuredImage.trim());
      const isPath = /^\/[a-zA-Z0-9_\-\.\/]+$/i.test(featuredImage.trim());
      if (!isHttp && !isDataImg && !isPath) {
        errors.featuredImage = 'Featured image must be a valid http(s) URL, image data URI, or asset path.';
      }
      if (/javascript:/i.test(featuredImage) || /<script/i.test(featuredImage)) {
        errors.featuredImage = 'Security error: Malicious image URI detected.';
      }
    }

    const finalCategory = category === 'Custom' ? customCategory.trim() || 'General' : category;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix validation errors before saving.');
      return;
    }

    setIsSaving(true);
    try {
      // Clean script tags or dangerous schemes from body
      const cleanBody = contentBody
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript\s*:/gi, '')
        .replace(/on\w+\s*=/gi, '');

      // Split content by blank lines into structured paragraphs
      const paragraphs = cleanBody
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);

      const wordCount = cleanBody.trim().split(/\s+/).length;
      const estimatedMinutes = Math.max(1, Math.round(wordCount / 180));
      const computedReadTime = `${estimatedMinutes} min read`;

      const postPayload: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        slug: cleanSlug,
        excerpt: excerpt.trim() || paragraphs[0]?.slice(0, 160) + '...',
        category: finalCategory,
        author: author.trim() || 'Editorial Team',
        readTime: readTime || computedReadTime,
        publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        featuredImage: featuredImage.trim(),
        content: paragraphs.length > 0 ? paragraphs : [cleanBody],
        seoTitle: seoTitle.trim() || `${title} | BiodataCraft Guides`,
        seoDescription: seoDescription.trim() || excerpt.trim().slice(0, 160),
        isPublished
      };

      if (editingPost) {
        await blogService.updatePost(editingPost.slug, postPayload);
        toast.success(`Article "${title}" updated successfully in Firestore.`);
      } else {
        await blogService.createPost(postPayload);
        toast.success(`Article "${title}" created and saved to Firestore.`);
      }

      setIsEditorOpen(false);
      await loadPosts();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save article.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Publication
  const handleTogglePublish = async (post: BlogPost) => {
    const token = sessionStorage.getItem('biodatacraft_admin_token');
    if (!token) {
      toast.error('Unauthorized. Please log in as admin.');
      navigate('/admin/login');
      return;
    }

    const nextStatus = !post.isPublished;
    try {
      await blogService.updatePost(post.slug, { isPublished: nextStatus });
      toast.success(nextStatus ? `Published "${post.title}".` : `Unpublished "${post.title}" (Draft).`);
      await loadPosts();
    } catch {
      toast.error('Failed to update publication status.');
    }
  };

  // Delete Article
  const handleDeletePost = async () => {
    if (!deleteConfirmPost) return;
    const token = sessionStorage.getItem('biodatacraft_admin_token');
    if (!token) {
      toast.error('Unauthorized. Please log in as admin.');
      navigate('/admin/login');
      return;
    }

    try {
      await blogService.deletePost(deleteConfirmPost.slug);
      toast.success(`Article "${deleteConfirmPost.title}" deleted from Firestore.`);
      setDeleteConfirmPost(null);
      await loadPosts();
    } catch {
      toast.error('Failed to delete article.');
    }
  };


  // Filter List
  const filteredPosts = posts.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (categoryFilter !== 'All' && p.category !== categoryFilter) {
      return false;
    }

    if (statusFilter === 'Published' && p.isPublished === false) return false;
    if (statusFilter === 'Draft' && p.isPublished !== false) return false;

    return true;
  });

  const allCategories = ['All', ...Array.from(new Set([...DEFAULT_CATEGORIES, ...posts.map((p) => p.category)]))];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                Phase 12 Content
              </span>
              <span className="text-xs text-stone-400">• Editorial Guides & SEO Articles</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel">
              Blog & Article Content Manager
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Create, edit, publish, and optimize Indian matrimonial guides and cultural advice articles.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={loadPosts}
              isLoading={loading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreate}
            >
              Create New Article
            </Button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <Card className="border-stone-200 shadow-xs">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search articles by title, keyword, slug, or excerpt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-sans"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white focus:ring-1 focus:ring-amber-500"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white focus:ring-1 focus:ring-amber-500"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published Only</option>
                <option value="Draft">Drafts Only</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="h-32 border-stone-200" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-stone-200 p-8 space-y-2">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold font-cinzel text-stone-900">
              No matching articles found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your search query or category filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card
                key={post.slug}
                className="border-stone-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
              >
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  {/* Article Thumbnail / Motif */}
                  <div className="w-full md:w-36 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 flex items-center justify-center">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-8 h-8 text-stone-300" />
                    )}
                  </div>

                  {/* Article Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        {post.category}
                      </span>
                      <span className="text-xs text-stone-400">•</span>
                      <span className="text-xs text-stone-500 font-mono">{post.readTime}</span>
                      <span className="text-xs text-stone-400">•</span>
                      <span className="text-xs text-stone-500">{post.publishedDate}</span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm sm:text-base font-cinzel line-clamp-1">
                      {post.title}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-400 font-mono">
                      <span>slug: /{post.slug}</span>
                      {post.seoTitle && (
                        <span className="text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded text-[10px] truncate max-w-xs">
                          SEO: {post.seoTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-wrap md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(post)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        post.isPublished !== false
                          ? 'text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'
                          : 'text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{post.isPublished !== false ? 'Published' : 'Draft'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/blog/${post.slug}`}
                        title="View Public Post"
                        className="inline-flex items-center justify-center p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(post)}
                        leftIcon={<Edit className="w-3 h-3" />}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirmPost(post)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 px-2"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ARTICLE EDITOR MODAL (Create & Edit) */}
      {/* ============================================================== */}
      {isEditorOpen && (
        <Modal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={editingPost ? `Edit Article: ${title}` : 'Create New Article'}
          description="Craft matrimonial guides, configure SEO metadata, and add featured imagery."
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
                onClick={handleSavePost}
                isLoading={isSaving}
              >
                {editingPost ? 'Save Article' : 'Publish Article'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Title & Slug */}
            <div className="space-y-3">
              <Input
                label="Article Title"
                placeholder="e.g. How to Format Astrological Details in Matrimonial Biodata"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingPost) {
                    setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
                  }
                }}
                error={formErrors.title}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Slug (URL Path)"
                  placeholder="e.g. format-astrological-details"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  hint="Used in the browser URL (/blog/[slug])"
                  error={formErrors.slug}
                  required
                />

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white focus:ring-1 focus:ring-amber-500"
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Custom">+ Custom Category</option>
                  </select>
                </div>
              </div>

              {category === 'Custom' && (
                <Input
                  label="Custom Category Name"
                  placeholder="e.g. Kundali & Astrological Guides"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              )}
            </div>

            {/* Author, Read Time, Image */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Author"
                placeholder="e.g. Editorial Team"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />

              <Input
                label="Estimated Read Time"
                placeholder="e.g. 5 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
              />

              <div className="space-y-1">
                <Input
                  label="Featured Image URL"
                  placeholder="https://... or upload below"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  hint="Banner image for article cards"
                />
                <div className="flex items-center gap-2 pt-1">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 cursor-pointer font-semibold text-[11px] shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-amber-800" />
                    <span>{isUploadingImage ? 'Uploading Image...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingImage}
                      onChange={handleImageUpload}
                    />
                  </label>
                  {featuredImage && (
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="text-[11px] text-red-600 hover:underline cursor-pointer"
                    >
                      Clear Image
                    </button>
                  )}
                </div>
              </div>
            </div>


            {/* Excerpt */}
            <Textarea
              label="Article Excerpt (Catalog Summary)"
              placeholder="Short 2-3 sentence overview shown in the blog directory..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />

            {/* Content Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  Article Body (Separate paragraphs with blank lines)
                </label>
                <span className="text-[10px] text-stone-400 font-mono">
                  {contentBody.trim() ? contentBody.trim().split(/\s+/).length : 0} words
                </span>
              </div>
              <Textarea
                placeholder="Write the full educational guide here. Separate each paragraph with a blank double enter..."
                value={contentBody}
                onChange={(e) => setContentBody(e.target.value)}
                rows={8}
                error={formErrors.content}
                required
              />
            </div>

            {/* SEO Optimization Box */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs font-cinzel">
                <FileText className="w-3.5 h-3.5 text-amber-800" />
                <span>Search Engine Optimization (SEO) Metadata</span>
              </h4>

              <Input
                label="SEO Title Tag"
                placeholder="e.g. Complete Guide to Indian Marriage Biodata | BiodataCraft"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                hint="Displayed in Google search result headers (50-60 characters recommended)"
              />

              <Textarea
                label="SEO Meta Description"
                placeholder="e.g. Master the art of Indian marriage biodata writing with step-by-step instructions on Kundali, education, and family etiquette..."
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                hint="Search snippet text shown under title (120-160 characters recommended)"
              />
            </div>

            {/* Publication Status Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-stone-300 text-amber-800 focus:ring-amber-500"
                />
                <span className="font-bold text-xs">Publish Article Immediately</span>
              </label>
              <p className="text-[11px] text-stone-400 ml-6">
                When checked, this article will be publicly indexed and visible on /blog.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* ============================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ============================================================== */}
      {deleteConfirmPost && (
        <Modal
          isOpen={Boolean(deleteConfirmPost)}
          onClose={() => setDeleteConfirmPost(null)}
          title="Delete Article"
          description="Are you sure you want to permanently delete this article?"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeleteConfirmPost(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleDeletePost}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Permanently Delete
              </Button>
            </div>
          }
        >
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">This action cannot be undone.</span>
              <p className="mt-1 text-red-900/80 leading-relaxed">
                Article <strong className="font-bold text-red-950">{deleteConfirmPost.title}</strong> will be removed. The URL path <code className="bg-red-100 px-1 py-0.5 rounded font-mono font-bold">/blog/{deleteConfirmPost.slug}</code> will return a 404 error.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
};
