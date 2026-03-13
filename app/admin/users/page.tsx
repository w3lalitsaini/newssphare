'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, Shield, Ban, Trash2, Loader2, Mail, 
  Calendar, CheckCircle2, MoreVertical, X, Check, Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'author' | 'admin';
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  image?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, updates: Partial<IUser>) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        toast.success('User updated');
        setUsers(users.map(u => u._id === id ? { ...u, ...updates } : u));
        setEditingUser(null);
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete account for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('User deleted');
        setUsers(users.filter(u => u._id !== id));
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-8 bg-black dark:bg-white rounded-full"></span>
            User Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Control access, roles, and status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar/Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Quick Stats</div>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-gray-500">Total Users</div>
                <div className="text-3xl font-black">{users.length}</div>
              </div>
              <div className="h-px bg-gray-100 dark:bg-gray-800"></div>
              <div>
                <div className="text-sm font-bold text-gray-500">Admins</div>
                <div className="text-xl font-black">{users.filter(u => u.role === 'admin').length}</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-500">Banned</div>
                <div className="text-xl font-black text-red-600">{users.filter(u => u.isBanned).length}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-sm transition-all"
            />
          </div>
        </div>

        {/* User Card Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
              <Loader2 className="w-12 h-12 animate-spin text-red-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(user => (
                <div key={user._id} className={`bg-white dark:bg-gray-900 group rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:shadow-2xl transition-all relative overflow-hidden ${user.isBanned ? 'opacity-75 grayscale bg-gray-100' : ''}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => deleteUser(user._id, user.name)}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-700 overflow-hidden shadow-sm flex-shrink-0">
                      {user.image ? (
                        <img src={user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-2xl text-gray-400">
                          {user.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white leading-tight">
                        {user.name}
                        {user.isVerified && <CheckCircle2 className="w-4 h-4 inline ml-1 text-blue-500 fill-blue-500/10" />}
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'author' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {user.role}
                        </span>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <select
                      value={user.role}
                      onChange={(e) => updateUser(user._id, { role: e.target.value as any })}
                      className="flex-1 bg-gray-50 dark:bg-gray-800 text-xs font-bold px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                    >
                      <option value="user">USER</option>
                      <option value="author">AUTHOR</option>
                      <option value="admin">ADMIN</option>
                    </select>

                    <button
                      onClick={() => updateUser(user._id, { isVerified: !user.isVerified })}
                      title={user.isVerified ? "Revoke Verification" : "Verify User"}
                      className={`p-2 rounded-xl transition-all ${user.isVerified ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}
                    >
                      <Shield className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => updateUser(user._id, { isBanned: !user.isBanned })}
                      title={user.isBanned ? "Unban User" : "Ban User"}
                      className={`p-2 rounded-xl transition-all ${user.isBanned ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 hover:text-red-600'}`}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
