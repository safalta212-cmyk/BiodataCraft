import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Form';
import { useToast } from '../../context/ToastContext';
import { FolderTree, Plus, CheckCircle2, Tag } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  templateCount: number;
}

export const AdminCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = sessionStorage.getItem('biodatacraft_admin_token');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 'cat-royal', name: 'Royal', description: 'Rajasthan, Rajput & Marwari Mandap fluting and ornate borders', templateCount: 2 },
    { id: 'cat-modern', name: 'Modern', description: 'Contemporary corporate layouts for IT professionals and doctors', templateCount: 1 },
    { id: 'cat-spiritual', name: 'Spiritual', description: 'Vedic mantras, saffron sandalwood themes, temple pillars', templateCount: 1 },
    { id: 'cat-traditional', name: 'Traditional', description: 'Peacock motifs, Gujarati & South Indian auspicious styling', templateCount: 1 },
    { id: 'cat-minimalist', name: 'Minimalist', description: 'Soft rose gold and delicate burgundy floral borders', templateCount: 1 }
  ]);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Regional matrimonial design category',
      templateCount: 0
    };

    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    toast.success(`Category "${newCat.name}" added successfully.`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-cinzel">
            Template Categories & Regional Groupings
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Organize cultural classifications and regional filtering taxonomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Category Form */}
          <Card className="md:col-span-1">
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
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                />

                <Input
                  label="Description"
                  placeholder="e.g. Designed for Tamil, Telugu & Kannada weddings"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                />

                <Button type="submit" size="sm" variant="primary" className="w-full">
                  Save Category
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Categories List */}
          <div className="md:col-span-2 space-y-3">
            {categories.map((cat) => (
              <Card key={cat.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm font-cinzel">
                          {cat.name}
                        </h4>
                        <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                          {cat.templateCount} Templates
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{cat.description}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    Active
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
