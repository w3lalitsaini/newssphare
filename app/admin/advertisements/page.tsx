'use client';

import { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Edit2, Trash2, Loader2, X, Check, 
  ExternalLink, Layout, Code as CodeIcon, Image as ImageIcon,
  Calendar, ToggleLeft, ToggleRight, Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface IAd {
  _id: string;
  title: string;
  type: 'image' | 'code' | 'google-adsense';
  placement: string;
  provider?: string;
  code?: string;
  image?: string;
  link?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

const PLACEMENTS = [
  'top-banner', 'sidebar', 'in-article', 'between-cards', 'bottom-footer'
];

export default function AdvertisementsPage() {
  const [ads, setAds] = useState<IAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<IAd | null>(null);

  const [formData, setFormData] = useState<Partial<IAd>>({
    title: '',
    type: 'image',
    placement: PLACEMENTS[0],
    provider: '',
    code: '',
    image: '',
    link: '',
    active: true,
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/advertisements');
      const data = await res.json();
      setAds(data);
    } catch (error) {
      toast.error('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingAd 
      ? `/api/admin/advertisements/${editingAd._id}` 
      : '/api/admin/advertisements';
    const method = editingAd ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Ad ${editingAd ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        setEditingAd(null);
        setFormData({ title: '', type: 'image', placement: PLACEMENTS[0], active: true });
        fetchAds();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Error occurred');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const toggleStatus = async (ad: IAd) => {
    try {
      const res = await fetch(`/api/admin/advertisements/${ad._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !ad.active }),
      });
      if (res.ok) {
        toast.success(`Ad ${ad.active ? 'disabled' : 'enabled'}`);
        setAds(ads.map(a => a._id === ad._id ? { ...a, active: !a.active } : a));
      }
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      const res = await fetch(`/api/admin/advertisements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Ad deleted');
        setAds(ads.filter(a => a._id !== id));
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
            Advertisements
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monetize your platform with custom placements</p>
        </div>
        <button 
          onClick={() => {
            setEditingAd(null);
            setFormData({ title: '', type: 'image', placement: PLACEMENTS[0], active: true });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Ad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {ads.map((ad) => (
              <motion.div
                key={ad._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-2xl ${!ad.active ? 'opacity-60 bg-gray-50' : ''}`}
              >
                <div className="p-6 flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <Layout className="w-3 h-3" />
                      {ad.placement}
                    </div>
                    <button 
                      onClick={() => toggleStatus(ad)}
                      className={`transition-colors ${ad.active ? 'text-indigo-600' : 'text-gray-400'}`}
                    >
                      {ad.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-black leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{ad.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 font-bold">
                      <span className="uppercase tracking-widest">{ad.type}</span>
                      {ad.provider && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{ad.provider}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="aspect-video bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-4 border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                    {ad.type === 'image' && ad.image ? (
                      <img src={ad.image} alt="" className="w-full h-full object-contain" />
                    ) : ad.type === 'code' || ad.type === 'google-adsense' ? (
                      <div className="text-center space-y-2">
                        <CodeIcon className="w-8 h-8 text-gray-300 mx-auto" />
                        <div className="text-[10px] text-gray-400 font-mono line-clamp-2 px-4">{ad.code}</div>
                      </div>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => { setEditingAd(ad); setFormData(ad); setIsModalOpen(true); }}
                      className="p-2 hover:bg-white dark:hover:bg-gray-700 text-gray-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteAd(ad._id)}
                      className="p-2 hover:bg-white dark:hover:bg-gray-700 text-gray-400 hover:text-red-600 rounded-xl transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {ad.link && (
                    <a href={ad.link} target="_blank" className="p-2 text-indigo-600 hover:underline text-xs font-black uppercase tracking-widest flex items-center gap-1">
                      Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
            {ads.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <Megaphone className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <div className="text-xl font-black text-gray-400 uppercase tracking-widest">No advertisements configured</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Slide-over or Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
                <h3 className="text-xl font-black">{editingAd ? 'Edit Advertisement' : 'New Advertisement'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-6 h-6 border" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Campaign Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold"
                      placeholder="Summer Sale 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Ad Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['image', 'code', 'google-adsense'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: t as any })}
                          className={`py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                            formData.type === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200'
                          }`}
                        >
                          {t.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Placement</label>
                    <select
                      value={formData.placement}
                      onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 font-bold appearance-none transition-all"
                    >
                      {PLACEMENTS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>

                {formData.type === 'image' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Image URL</label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-5 py-4 bg-white dark:bg-gray-900 rounded-2xl outline-none border border-gray-100 dark:border-gray-800 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Destination Link</label>
                      <input
                        type="text"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full px-5 py-4 bg-white dark:bg-gray-900 rounded-2xl outline-none border border-gray-100 dark:border-gray-800 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {(formData.type === 'code' || formData.type === 'google-adsense') && (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    {formData.type === 'google-adsense' && (
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">AdSense Provider ID (Optional)</label>
                        <input
                          type="text"
                          value={formData.provider}
                          onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                          className="w-full px-5 py-4 bg-white dark:bg-gray-900 rounded-2xl outline-none border border-gray-100 dark:border-gray-800 font-bold"
                          placeholder="ca-pub-..."
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Embed Code / Script</label>
                      <textarea
                        rows={4}
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-5 py-4 bg-white dark:bg-gray-900 rounded-2xl outline-none border border-gray-100 dark:border-gray-800 font-mono text-xs"
                        placeholder="<script async src='...'></script>"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 py-4 border-t border-gray-50 dark:border-gray-800">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30 transition-all active:scale-95"
                  >
                    {editingAd ? 'Update Advertisement' : 'Initialize Campaign'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-5 bg-gray-100 dark:bg-gray-800 text-gray-500 font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
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
