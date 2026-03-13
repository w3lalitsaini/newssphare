'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send, Trash2, Edit3 } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface Comment {
  _id: string;
  author: { _id: string; name: string; image?: string };
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  articleId: string;
  initialComments?: Comment[];
}

export default function CommentSection({ articleId, initialComments = [] }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments as Comment[]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim() || !session) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, content: newComment }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const saveEdit = (id: string) => {
    setComments(comments.map((c) => c._id === id ? { ...c, content: editContent } : c));
    setEditingId(null);
  };

  const deleteComment = (id: string) => {
    setComments(comments.filter((c) => c._id !== id));
  };

  return (
    <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-red-600" />
        Comments ({comments.length})
      </h2>

      {/* Comment form */}
      {session ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            {session.user?.image ? (
              <img src={session.user.image} alt="" className="w-10 h-10 rounded-full shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold shrink-0">
                {session.user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !newComment.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            <Link href="/auth/login" className="text-red-600 font-semibold hover:underline">Sign in</Link> to join the conversation
          </p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-5">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            {comment.author.image ? (
              <img src={comment.author.image} alt={comment.author.name} className="w-9 h-9 rounded-full shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-bold shrink-0">
                {comment.author.name[0]}
              </div>
            )}
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{comment.author.name}</span>
                  <span className="text-xs text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                {editingId === comment._id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => saveEdit(comment._id)} className="text-xs px-3 py-1 bg-red-600 text-white rounded-lg">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                )}
              </div>
              {session && (session.user as any)?.id === comment.author._id && editingId !== comment._id && (
                <div className="flex gap-3 mt-1 px-2">
                  <button onClick={() => handleEdit(comment)} className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => deleteComment(comment._id)} className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
