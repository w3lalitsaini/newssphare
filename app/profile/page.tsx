'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  User as UserIcon, Mail, Shield, Calendar, Edit2, 
  Save, Loader2, Camera, Lock, Key, CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      setProfile(data);
      setFormData({
        name: data.name,
        image: data.image || '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
          password: formData.password || undefined
        }),
      });

      if (res.ok) {
        toast.success('Profile updated');
        await update({ name: formData.name, image: formData.image });
        fetchProfile();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              profile.role === 'admin' ? 'bg-red-100 text-red-600' :
              profile.role === 'author' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {profile.role} Account
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:40 rounded-[2rem] bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-700 overflow-hidden shadow-xl flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-300">
                    {profile.name[0]}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center md:text-left space-y-2">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {profile.name}
                {profile.isVerified && <CheckCircle2 className="w-6 h-6 inline ml-2 text-blue-500 fill-blue-500/10" />}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-sm">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-sm">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                <UserIcon className="w-5 h-5 text-red-600" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Display Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Avatar URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 outline-none transition-all font-mono text-sm"
                    placeholder="https://cloudinary.com/..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
                <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-600" />
                  Security
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-red-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto px-10 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Update Profile
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            {/* Quick Stats sidebar */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Insights</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Verification</div>
                    <div className="text-xs text-gray-500 font-medium">
                      {profile.isVerified ? 'Fully Verified' : 'Needs Verification'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Access Level</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-widest font-black">
                      {profile.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-black text-white rounded-[2rem] p-8 shadow-xl shadow-black/10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">NewsSphere Premium</h3>
              <p className="text-sm font-bold leading-relaxed mb-6">
                You are currently on our base reader plan. Upgrade for exclusive insights and ad-free experience.
              </p>
              <button className="w-full py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
                Explore Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
