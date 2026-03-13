'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Loader2, X, Tag as TagIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ITag {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<ITag | null>(null);
  
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tags');
      const data = await res.json();
      setTags(data);
    } catch (error) {
      toast.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTag 
      ? `/api/admin/tags/${editingTag._id}` 
      : '/api/admin/tags';
    const method = editingTag ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Tag ${editingTag ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        setEditingTag(null);
        setFormData({ name: '' });
        fetchTags();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Error occurred');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete tag "#${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Tag deleted');
        fetchTags();
      } else {
        toast.error('Failed to delete tag');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openEditModal = (tag: ITag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name });
    setIsModalOpen(true);
  };

  const filtered = tags.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
            Tags
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage content labels and keywords</p>
        </div>
        <button 
          onClick={() => {
            setEditingTag(null);
            setFormData({ name: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Tag
        </button>
      </div>

      {/* Grid: Search and Count */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all"
          />
        </div>
        <div className="bg-white dark:bg-gray-900 px-6 py-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-2">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Total:</span>
          <span className="text-xl font-black text-red-600">{tags.length}</span>
        </div>
      </div>

      {/* Tags List */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.map(tag => (
              <div key={tag._id} className="group flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-red-600 transition-colors shadow-sm">
                    <TagIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">#{tag.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">{tag.slug}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(tag)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(tag._id, tag.name)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <TagIcon className="w-12 h-12 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
                <div className="font-bold text-gray-400 lowercase">No tags found</div>
              </div>
            )}
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
              className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-xl font-black">{editingTag ? 'Edit Tag' : 'New Tag'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 uppercase tracking-wider text-gray-400">Tag Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300">#</span>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={formData.name}
                      onChange={(e) => setFormData({ name: e.target.value })}
                      className="w-full pl-8 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-black"
                      placeholder="BreakingNews"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/30 transition-all active:scale-95"
                  >
                    {editingTag ? 'Save Changes' : 'Create Tag'}
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
