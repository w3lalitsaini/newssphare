'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, Save, Globe, Info, Palette, Share2, 
  Search, Loader2, Link as LinkIcon, Mail, Laptop
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ISettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  appearance: {
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'appearance' | 'social'>('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success('Settings updated successfully');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-8 bg-black dark:bg-white rounded-full"></span>
            Site Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your platform identity and appearance</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 active:scale-95"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'seo', label: 'SEO & Meta', icon: Search },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'social', label: 'Social Links', icon: Share2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-gray-900 shadow-md text-red-600 border border-gray-100 dark:border-gray-800' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Site Name</label>
                      <input
                        type="text"
                        value={settings?.siteName}
                        onChange={(e) => setSettings({ ...settings!, siteName: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 transition-all font-bold outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Tagline / Description</label>
                      <textarea
                        rows={3}
                        value={settings?.siteDescription}
                        onChange={(e) => setSettings({ ...settings!, siteDescription: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 transition-all font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Site URL</label>
                      <input
                        type="url"
                        value={settings?.siteUrl}
                        onChange={(e) => setSettings({ ...settings!, siteUrl: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 transition-all font-mono text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={settings?.contactEmail}
                        onChange={(e) => setSettings({ ...settings!, contactEmail: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 transition-all font-mono text-sm outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'seo' && (
                <motion.div
                  key="seo"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Meta Title</label>
                      <input
                        type="text"
                        value={settings?.seo.metaTitle}
                        onChange={(e) => setSettings({ ...settings!, seo: { ...settings!.seo, metaTitle: e.target.value } })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 transition-all font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Meta Description</label>
                      <textarea
                        rows={4}
                        value={settings?.seo.metaDescription}
                        onChange={(e) => setSettings({ ...settings!, seo: { ...settings!.seo, metaDescription: e.target.value } })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 transition-all font-medium outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Logo URL</label>
                      <input
                        type="text"
                        value={settings?.appearance.logoUrl}
                        onChange={(e) => setSettings({ ...settings!, appearance: { ...settings!.appearance, logoUrl: e.target.value } })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 transition-all font-mono text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings?.appearance.primaryColor}
                          onChange={(e) => setSettings({ ...settings!, appearance: { ...settings!.appearance, primaryColor: e.target.value } })}
                          className="w-16 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings?.appearance.primaryColor}
                          onChange={(e) => setSettings({ ...settings!, appearance: { ...settings!.appearance, primaryColor: e.target.value } })}
                          className="flex-1 px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 transition-all font-mono text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'social' && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['facebook', 'twitter', 'instagram', 'youtube'].map((platform) => (
                      <div key={platform}>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 capitalize">{platform}</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={(settings?.socialLinks as any)?.[platform] || ''}
                            onChange={(e) => setSettings({ ...settings!, socialLinks: { ...settings!.socialLinks, [platform]: e.target.value } })}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 transition-all font-mono text-xs outline-none"
                            placeholder={`https://${platform}.com/...`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
