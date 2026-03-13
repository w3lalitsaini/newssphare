'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Search, Plus, Edit2, Trash2, Loader2, X, Check, 
  ExternalLink, Eye, Star, TrendingUp, Filter, MoreVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface IArticle {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  category?: { _id: string, name: string };
  author: { _id: string, name: string };
  isFeatured: boolean;
  isTrending: boolean;
  views: number;
  createdAt: string;
}

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const toggleBoolean = async (id: string, field: 'isFeatured' | 'isTrending', current: boolean) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !current }),
      });
      if (res.ok) {
        toast.success(`${field} updated`);
        setArticles(articles.map(a => a._id === id ? { ...a, [field]: !current } : a));
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const deleteArticle = async (id: string, title: string) => {
    if (!confirm(`Permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Article deleted');
        setArticles(articles.filter(a => a._id !== id));
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const filtered = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
            Articles
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your stories and editorial content</p>
        </div>
        <Link 
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Write Article
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all"
          />
        </div>
        <div className="flex bg-white dark:bg-gray-900 p-1 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm w-full md:w-auto">
          {['all', 'published', 'draft'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Article</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Flags</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Metrics</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/20">
                {filtered.map((article) => (
                  <tr key={article._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="max-w-md">
                        <div className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{article.category?.name || 'Uncategorized'}</div>
                        <h3 className="font-extrabold text-gray-900 dark:text-white line-clamp-1 mb-1">{article.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          By {article.author?.name} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {new Date(article.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleBoolean(article._id, 'isFeatured', article.isFeatured)}
                          className={`p-2 rounded-lg transition-all ${article.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}
                          title="Featured"
                        >
                          <Star className={`w-4 h-4 ${article.isFeatured ? 'fill-amber-600' : ''}`} />
                        </button>
                        <button
                          onClick={() => toggleBoolean(article._id, 'isTrending', article.isTrending)}
                          className={`p-2 rounded-lg transition-all ${article.isTrending ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}
                          title="Trending"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                        <Eye className="w-4 h-4" />
                        {article.views?.toLocaleString() || 0}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/article/${article.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/articles/edit/${article._id}`}
                          className="p-2 hover:bg-white dark:hover:bg-gray-700 text-indigo-600 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => deleteArticle(article._id, article.title)}
                          className="p-2 hover:bg-white dark:hover:bg-gray-700 text-red-600 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <FileText className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                <div className="text-xl font-black text-gray-400 uppercase tracking-widest">No stories found</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
