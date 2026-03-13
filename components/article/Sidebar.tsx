import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Star } from 'lucide-react';
import AdSlot from '@/components/ads/AdSlot';
import { formatDate } from '@/lib/utils';

interface SidebarArticle {
  _id: string;
  title: string;
  slug: string;
  featuredImage: string;
  publishedAt: string;
  views?: number;
  category: { name: string; color: string };
}

interface SidebarProps {
  trending?: SidebarArticle[];
  popular?: SidebarArticle[];
}

export default function Sidebar({ trending = [], popular = [] }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Sidebar Ad */}
      <AdSlot placement="sidebar" />

      {/* Trending */}
      {trending.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-gray-900 dark:text-white">Trending Now</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {trending.map((article, i) => (
              <Link
                key={article._id}
                href={`/article/${article.slug}`}
                className="group flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-3xl font-black text-gray-200 dark:text-gray-700 leading-none w-8 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-xs font-bold uppercase"
                    style={{ color: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mt-0.5">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(article.publishedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sidebar Ad 2 */}
      <AdSlot placement="sidebar" />

      {/* Popular */}
      {popular.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">Most Read</h3>
          </div>
          <div className="p-3 space-y-1">
            {popular.map((article) => (
              <Link
                key={article._id}
                href={`/article/${article.slug}`}
                className="group flex gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{article.views?.toLocaleString()} views</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-5 text-white">
        <h3 className="font-bold text-lg mb-1">Stay Updated</h3>
        <p className="text-red-100 text-sm mb-4">Get the latest news in your inbox every morning.</p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-sm text-white placeholder-white/60 focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-white text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors"
          >
            Subscribe Free
          </button>
        </form>
      </div>
    </aside>
  );
}
