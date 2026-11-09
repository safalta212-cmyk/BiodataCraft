import React, { useEffect, useState, useTransition } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../data/blogData';
import { useToast } from '../../context/ToastContext';
import { CreateArticleEditor } from '../../components/admin/CreateArticleEditor';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const [, startTransition] = useTransition();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  // Studio Editor View State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Destructive Delete State
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<BlogPost | null>(null);

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

  useEffect(() => {
    const token = sessionStorage.getItem('biodatacraft_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadPosts();
  }, [navigate]);

  // Synchronize URL search params (e.g. /admin/blog?action=create or /admin/blog?edit=slug)
  useEffect(() => {
    const action = searchParams.get('action');
    const editSlug = searchParams.get('edit');
    if (action === 'create' || action === 'new') {
      setEditingPost(null);
      setIsEditorOpen(true);
    } else if (editSlug && posts.length > 0) {
      const match = posts.find((p) => p.slug === editSlug);
      if (match) {
        setEditingPost(match);
        setIsEditorOpen(true);
      }
    }
  }, [searchParams, posts]);

  // Open Create Studio
  const handleOpenCreate = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
    setSearchParams({ action: 'create' });
  };

  // Open Edit Studio
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditorOpen(true);
    setSearchParams({ edit: post.slug });
  };

  // Close Studio and return to catalog
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingPost(null);
    setSearchParams({});
  };

  // On Save/Publish Success
  const handleSaveSuccess = () => {
    setIsEditorOpen(false);
    setEditingPost(null);
    setSearchParams({});
    loadPosts();
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

  // If in create or edit mode, display the full professional article editor studio
  if (isEditorOpen) {
    return (
      <AdminLayout>
        <CreateArticleEditor
          initialPost={editingPost}
          existingPosts={posts}
          onBack={handleCloseEditor}
          onSaveSuccess={handleSaveSuccess}
        />
      </AdminLayout>
    );
  }

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
