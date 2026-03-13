'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Check, X, ShieldAlert, Trash2, 
  Loader2, User, ExternalLink, Calendar, Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface IComment {
  _id: string;
  content: string;
  status: 'pending' | 'approved' | 'spam';
  userId: { _id: string, name: string, email: string, image?: string };
  articleId: { _id: string, title: string, slug: string };
  createdAt: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('all');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/comments');
      const data = await res.json();
      setComments(data);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Comment ${status}`);
        setComments(comments.map(c => c._id === id ? { ...c, status } as IComment : c));
      } else {
        toast.error('Failed to update comment');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Comment deleted');
        setComments(comments.filter(c => c._id !== id));
      } else {
        toast.error('Failed to delete comment');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const filtered = comments.filter(c => {
    const matchesSearch = c.content.toLowerCase().includes(search.toLowerCase()) || 
                         c.userId?.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-8 bg-amber-500 rounded-full"></span>
            Moderation
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage user discussions</p>
        </div>
        <div className="flex bg-white dark:bg-gray-900 p-1 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          {['all', 'pending', 'approved', 'spam'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search comments or users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-4 py-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl outline-none focus:ring-2 focus:ring-amber-500 shadow-xl transition-all text-lg"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((comment) => (
              <motion.div
                key={comment._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white dark:bg-gray-900 p-6 rounded-3xl border shadow-sm group transition-all ${
                  comment.status === 'pending' ? 'border-amber-200 dark:border-amber-900/30' : 
                  comment.status === 'spam' ? 'border-red-100 dark:border-red-900/20 opacity-60' : 'border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* User Info */}
                  <div className="md:w-48 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                        {comment.userId?.image ? (
                          <img src={comment.userId.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-black text-xs truncate uppercase tracking-wider">{comment.userId?.name}</div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {comment.status === 'pending' && (
                      <div className="mt-4 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full inline-block">
                        Needs Review
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <Link 
                      href={`/article/${comment.articleId?.slug}`} 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-amber-600 transition-colors bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg"
                    >
                      Article: {comment.articleId?.title}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-2xl italic">
                      &ldquo;{comment.content}&rdquo;
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center justify-center gap-2">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(comment._id, 'approved')}
                        className="flex-1 md:flex-none p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    {comment.status !== 'spam' && (
                      <button
                        onClick={() => updateStatus(comment._id, 'spam')}
                        className="flex-1 md:flex-none p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Mark as Spam"
                      >
                        <ShieldAlert className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="flex-1 md:flex-none p-3 bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="py-24 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <div className="text-xl font-black text-gray-400 uppercase tracking-widest">No comments found</div>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
