'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, X, Image as ImageIcon, Tag, Layout, 
  Type, AlignLeft, Globe, Eye, Loader2, Sparkles,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface ICategory {
  _id: string;
  name: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featuredImage: '',
    status: 'draft',
    isFeatured: false,
    isTrending: false,
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
            setFormData(prev => ({ ...prev, category: data[0]._id }));
        }
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        }),
      });

      if (res.ok) {
        toast.success('Article created successfully!');
        router.push('/admin/articles');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to create article');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/admin/articles" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mb-4 text-sm font-bold uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" />
            Back to Articles
          </Link>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
             Manual <span className="text-red-600">Creation</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-black uppercase tracking-widest text-xs hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-red-500/20 flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Publish Article
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Type className="w-3 h-3 text-red-600" /> Article Title
              </label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a compelling title..."
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-lg font-black tracking-tight"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <AlignLeft className="w-3 h-3 text-red-600" /> Content (HTML Supported)
              </label>
              <textarea
                required
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                placeholder="Write your story here... HTML tags are supported."
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium leading-relaxed resize-none"
              />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-red-600" /> Excerpt (Optional)
                </label>
                <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief summary of the article..."
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm leading-relaxed resize-none"
                />
            </div>
          </div>

          {/* SEO Settings Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4">
               SEO & Meta Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Title</label>
                    <input
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Description</label>
                    <input
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                    />
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Status & Options Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Globe className="w-3 h-3 text-red-600" /> Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm font-bold uppercase tracking-widest"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="w-5 h-5 rounded-lg border-2 border-gray-200 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Mark as Featured</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="isTrending"
                        checked={formData.isTrending}
                        onChange={handleChange}
                        className="w-5 h-5 rounded-lg border-2 border-gray-200 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Mark as Trending</span>
                </label>
            </div>
          </div>

          {/* Categorization Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Layout className="w-3 h-3 text-red-600" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm font-bold"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Tag className="w-3 h-3 text-red-600" /> Tags
              </label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tag1, Tag2, Tag3..."
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
              />
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest ml-1 italic">Comma separated</p>
            </div>
          </div>

          {/* Feature Image Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <ImageIcon className="w-3 h-3 text-red-600" /> Featured Image URL
              </label>
              <input
                required
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
              />
            </div>
            {formData.featuredImage && (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 group">
                <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
