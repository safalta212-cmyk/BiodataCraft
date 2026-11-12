import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Form';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { templateService } from '../../services/templateService';
import { TemplateCategory, Template } from '../../types/template';
import { TEMPLATE_CATEGORIES } from '../../data/templateData';
import { FolderTree, Plus, CheckCircle2, Tag, Trash2, RefreshCw, Layers, Search, ShieldCheck } from 'lucide-react';

interface CategoryWithCount extends TemplateCategory {
  templateCount: number;
  isCore: boolean;
}

export const AdminCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form Fields
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Delete Confirmation Modal
  const [deleteCandidate, setDeleteCandidate] = useState<CategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, tmpls] = await Promise.all([
        templateService.getCategories(true),
        templateService.getTemplates({ includeUnpublished: true, status: 'all', forceRefresh: true })
      ]);

      const coreIds = new Set(TEMPLATE_CATEGORIES.map((c) => c.id));

      const enriched: CategoryWithCount[] = cats.map((cat) => {
        const count = tmpls.filter((t) => {
          const matchCatId = t.categoryId === cat.id || t.categoryId === cat.slug;
          const matchStyle = t.style?.toLowerCase() === cat.name.toLowerCase();
          const matchCatName = t.categoryName?.toLowerCase() === cat.name.toLowerCase();
          return matchCatId || matchStyle || matchCatName;
        }).length;

        return {
          ...cat,
          templateCount: count,
          isCore: coreIds.has(cat.id)
        };
      });

      setCategories(enriched);
    } catch (err) {
      console.error('Failed to load categories:', err);
      toast.error('Failed to load categories from database.');
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

  const handleNameChange = (val: string) => {
    setNewCatName(val);
    if (!newCatSlug || newCatSlug === newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setNewCatSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error('Category Name is required.');
      return;
    }

    const cleanSlug = (newCatSlug || newCatName).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = categories.find((c) => c.slug === cleanSlug || c.id === cleanSlug);
    if (existing) {
      toast.error(`A category with slug "${cleanSlug}" already exists.`);
      return;
    }

    setIsSaving(true);
    try {
      await templateService.createCategory({
        slug: cleanSlug,
        name: newCatName.trim(),
        description: newCatDesc.trim() || `${newCatName.trim()} cultural and regional designs`,
        sortOrder: categories.length + 1
      });

      toast.success(`Category "${newCatName.trim()}" created successfully in Firestore.`);
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDesc('');
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await templateService.deleteCategory(deleteCandidate.id);
      toast.success(`Category "${deleteCandidate.name}" removed successfully.`);
      setDeleteCandidate(null);
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                Taxonomy & Groupings
              </span>
              <span className="text-xs text-stone-400">• Firestore-Backed /categories</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel">
              Template Categories & Regional Taxonomy
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Organize cultural classifications, regional traditions, and filter groups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              isLoading={loading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Category Form */}
          <Card className="md:col-span-1 border-stone-200 shadow-xs h-fit">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5 font-cinzel">
                <Plus className="w-4 h-4 text-amber-800" />
                <span>Create New Category</span>
              </h3>

              <form onSubmit={handleAddCategory} className="space-y-3">
                <Input
                  label="Category Name"
                  placeholder="e.g. South Indian Traditional"
                  value={newCatName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />

                <Input
                  label="Category Slug (URL Identifier)"
                  placeholder="e.g. south-indian-traditional"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  hint="Used in filters and template matching"
                  required
                />

                <Input
                  label="Description"
                  placeholder="e.g. Designed for Tamil, Telugu & Kannada weddings"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                />

                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  className="w-full"
                  isLoading={isSaving}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Save Category
                </Button>
              </form>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <span className="font-bold text-stone-700 block">Category Integration:</span>
                <p>
                  Newly created categories become immediately available in the Template Manager when creating or editing biodata designs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Existing Categories List */}
          <div className="md:col-span-2 space-y-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search categories by name, slug, or description..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-white border border-stone-200 rounded-2xl" />
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-200 text-stone-500 text-xs">
                No matching categories found.
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <Card key={cat.id} className="border-stone-200 shadow-xs hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm font-cinzel">
                            {cat.name}
                          </h4>
                          <span className="text-[10px] font-mono text-stone-400">
                            /{cat.slug}
                          </span>
                          <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                            {cat.templateCount} {cat.templateCount === 1 ? 'Template' : 'Templates'}
                          </span>
                          {cat.isCore && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded">
                              Core System
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{cat.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Active
                      </span>

                      {!cat.isCore && (
                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(cat)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <Modal
          isOpen={Boolean(deleteCandidate)}
          onClose={() => setDeleteCandidate(null)}
          title="Delete Category"
          description={`Are you sure you want to delete "${deleteCandidate.name}"?`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button size="sm" variant="outline" onClick={() => setDeleteCandidate(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleDeleteCategory}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete Category
              </Button>
            </div>
          }
        >
          <p className="text-xs text-stone-600 leading-relaxed">
            Deleting category <strong>{deleteCandidate.name}</strong> will remove it from the classification taxonomy. Existing templates assigned to this category will remain intact.
          </p>
        </Modal>
      )}
    </AdminLayout>
  );
};
