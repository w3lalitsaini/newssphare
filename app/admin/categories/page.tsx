'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Loader2, X, Check, Image as ImageIcon, FileText, ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCategory 
      ? `/api/admin/categories/${editingCategory._id}` 
      : '/api/admin/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', image: '' });
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Error occurred');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openEditModal = (category: ICategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    });
    setIsModalOpen(true);
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your content taxonomies</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '', image: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Stats/Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Categories</div>
          <div className="text-4xl font-black text-gray-900 dark:text-white">{categories.length}</div>
        </div>
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-lg outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Slug</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filtered.map(category => (
                  <tr key={category._id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                          {category.image ? (
                            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500 max-w-xs truncate">{category.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400 font-mono">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(category)}
                          className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-500 hover:shadow-md rounded-lg transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category._id, category.name)}
                          className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 hover:shadow-md rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center">
                      <div className="text-4xl mb-2">📁</div>
                      <div className="font-bold text-gray-400">No categories found matching your search.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/30">
                <h3 className="text-xl font-black">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 uppercase tracking-wider text-gray-400">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-bold"
                    placeholder="Technology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 uppercase tracking-wider text-gray-400">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                    placeholder="Latest tech news and reviews..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 uppercase tracking-wider text-gray-400">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm font-mono"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/30 transition-all active:scale-95"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
