import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Users, MessageSquare, Eye, TrendingUp, Plus, ArrowUpRight, CheckCircle, XCircle } from 'lucide-react';
import { getAdminStats, getRecentArticlesAdmin, getPendingComments } from '@/lib/data';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Admin Dashboard | NewsSphere' };
export const revalidate = 30;

export default async function AdminDashboard() {
  const [stats, recentArticles, pendingComments] = await Promise.all([
    getAdminStats(),
    getRecentArticlesAdmin(5),
    getPendingComments(5),
  ]);

  const statCards = [
    { label: 'Published Articles', value: stats.totalArticles.toLocaleString(), icon: FileText, color: 'blue', href: '/admin/articles' },
    { label: 'Registered Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'green', href: '/admin/users' },
    { label: 'Total Comments', value: stats.totalComments.toLocaleString(), icon: MessageSquare, color: 'yellow', href: '/admin/comments' },
    { label: 'Total Views', value: stats.totalViews >= 1000000 ? `${(stats.totalViews / 1000000).toFixed(1)}M` : stats.totalViews >= 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : stats.totalViews.toString(), icon: Eye, color: 'red', href: '#' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Live data — updates every 30 seconds</p>
        </div>
        <Link href="/admin/articles/new" className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white">Recent Articles</h2>
            <Link href="/admin/articles" className="text-xs text-red-600 hover:underline flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          {recentArticles.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {(recentArticles as any[]).map((article: any) => (
                <div key={article._id.toString()} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{article.author?.name} · {formatRelativeTime(article.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {article.views > 0 && <span className="text-xs text-gray-500">{article.views.toLocaleString()} views</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      article.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>{article.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center text-gray-400">No articles yet. <Link href="/admin/articles/new" className="text-red-600 hover:underline">Create one</Link></div>
          )}
        </div>

        {/* Pending Comments */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white">Pending Comments</h2>
            <Link href="/admin/comments" className="text-xs text-red-600 hover:underline">Review all</Link>
          </div>
          {pendingComments.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {(pendingComments as any[]).map((comment: any) => (
                <div key={comment._id.toString()} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{comment.author?.name}</span>
                    <span className="text-xs text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{comment.content}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 truncate">{(comment.article as any)?.title}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 transition-colors">
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                    <button className="flex items-center gap-1 text-xs px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 transition-colors">
                      <XCircle className="w-3 h-3" /> Spam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center text-gray-400 text-sm">No pending comments 🎉</div>
          )}
        </div>
      </div>
    </div>
  );
}
