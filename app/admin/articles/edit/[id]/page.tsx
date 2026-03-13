'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, Eye, Upload, X, Plus, Loader2, ChevronLeft, 
  Image as ImageIcon, Hash, Layout, Type, FileText, Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, artRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch(`/api/admin/articles/${id}`)
      ]);
      
      const cats = await catRes.json();
      const article = await artRes.json();
      
      setCategories(cats);
      
      if (artRes.ok) {
        setTitle(article.title);
        setSlug(article.slug);
        setExcerpt(article.excerpt);
        setContent(article.content);
        setCategory(article.category);
        setTags(article.tags || []);
        setStatus(article.status);
        setIsFeatured(article.isFeatured);
        setIsTrending(article.isTrending);
        setFeaturedImage(article.featuredImage);
        setMetaTitle(article.metaTitle || '');
        setMetaDesc(article.metaDescription || '');
      } else {
        toast.error('Article not found');
        router.push('/admin/articles');
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const autoSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFeaturedImage(data.url);
        toast.success('Image uploaded');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (publish = false) => {
    if (!title || !content || !category || !featuredImage) {
      toast.error('Please fill all required fields (*) including image');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, slug, excerpt, content, category, tags,
          status: publish ? 'published' : status,
          isFeatured, isTrending, featuredImage,
          metaTitle, metaDescription: metaDesc
        }),
      });

      if (res.ok) {
        toast.success(publish ? 'Article updated and published' : 'Article updated');
        router.push('/admin/articles');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Edit <span className="text-red-600">Story</span></h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Refine your editorial piece</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Update'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Editor Main */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setSlug(autoSlug(e.target.value)); }}
                placeholder="Story Headline *"
                className="w-full text-4xl font-black bg-transparent border-none outline-none placeholder:text-gray-200 dark:placeholder:text-gray-800 uppercase tracking-tighter"
              />
              <div className="flex items-center gap-4 border-b border-gray-50 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <Layout className="w-3 h-3" />
                  Slug: <span className="text-red-600 lowercase">{slug}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <Hash className="w-3 h-3" />
                  ID: <span className="text-gray-500 font-mono">{id}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Excerpt *</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Enter a punchy summary of your article..."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent focus:border-red-500 outline-none transition-all font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Main Content *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={25}
                  placeholder="Tell your story here... (Markdown supported)"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent focus:border-red-500 outline-none transition-all font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          </section>

          {/* SEO Section */}
          <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-6">
              <Search className="w-4 h-4 text-red-600" />
              Search Engine Optimization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Max 60 chars"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl focus:border-red-500 outline-none border-2 border-transparent font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Meta Description</label>
                <input
                  type="text"
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  placeholder="Max 160 chars"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl focus:border-red-500 outline-none border-2 border-transparent"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Featured Image */}
          <section className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Media *</h3>
            <div className="relative group">
              {featuredImage ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800">
                  <img src={featuredImage} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setFeaturedImage('')} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-red-500 hover:bg-red-50/10 transition-all cursor-pointer">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </section>

          {/* Settings */}
          <section className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none font-bold text-sm appearance-none border-2 border-transparent focus:border-red-500"
              >
                <option value="">Select...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Engagement Flags</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-2 border-gray-200 checked:bg-red-600 checked:border-red-600 transition-all focus:ring-0"
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-red-600 uppercase tracking-widest">Featured Article</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-2 border-gray-200 checked:bg-red-600 checked:border-red-600 transition-all focus:ring-0"
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-red-600 uppercase tracking-widest">Mark as Trending</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="tag name..."
                  className="flex-1 min-w-0 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-bold outline-none border-2 border-transparent focus:border-red-500"
                />
                <button onClick={addTag} className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg transition-transform active:scale-90">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <span key={typeof tag === 'string' ? tag : tag._id} className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-700">
                  {typeof tag === 'string' ? tag : tag.name}
                  <button onClick={() => setTags(tags.filter((t: any) => t !== tag))} className="p-0.5 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
