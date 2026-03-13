import { Metadata } from 'next';
import { 
  getLatestArticles, 
  getCategories, 
  getTrendingArticles 
} from '@/lib/data';
import ArticleCard from '@/components/article/ArticleCard';
import AdSlot from '@/components/ads/AdSlot';
import { 
  Newspaper, TrendingUp, Filter, ChevronRight, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - NewsSphere | Latest Stories & Deep Dives',
  description: 'Explore our latest articles, news stories, and professional analysis.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; sort?: string }>;
}) {
  const { page = '1', category, sort = 'latest' } = await searchParams;
  const currentPage = parseInt(page);
  
  const { articles, pages: totalPages, total: totalArticles } = await getLatestArticles(
    12,
    currentPage, 
    category
  );
  
  const categories = await getCategories();
  const trending = await getTrendingArticles(5);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <span className="w-8 h-px bg-red-600"></span>
              The Dispatch
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 leading-[0.9]">
              Latest <span className="text-red-600">Stories</span> & <br /> Insightful <span className="text-gray-400">Dives</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl">
              Stay ahead with curated journalism. From breaking news to in-depth analysis across technology, politics, and culture.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:flex-1 space-y-12">
            {/* Filters Bar */}
            <div className="sticky top-20 z-10 flex flex-wrap items-center justify-between gap-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Link
                  href="/blog"
                  className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    !category ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  All
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.slug}
                    href={`/blog?category=${cat.slug}`}
                    className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      category === cat.slug ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                <Filter className="w-4 h-4" />
                <span>Showing {articles.length} of {totalArticles} articles</span>
              </div>
            </div>

            {/* Pagination Banner */}
            {currentPage > 1 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-sm font-bold text-gray-500">Page {currentPage} of {totalPages}</span>
                <Link href="/blog" className="text-xs font-black text-red-600 uppercase tracking-widest hover:underline">Reset to First Page</Link>
              </div>
            )}

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article: any, idx: number) => (
                <div key={article._id.toString()}>
                  <ArticleCard article={article} />
                  {(idx + 1) === 4 && (
                    <div className="md:col-span-2 mt-8">
                      <AdSlot placement="between-cards" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8">
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}${category ? `&category=${category}` : ''}`}
                    className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-gray-100 dark:border-gray-800 hover:border-red-600 hover:text-red-600 transition-all group"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1;
                    if (totalPages > 5 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) return null;
                    return (
                      <Link
                        key={p}
                        href={`/blog?page=${p}${category ? `&category=${category}` : ''}`}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                          currentPage === p ? 'bg-black text-white dark:bg-white dark:text-black scale-110 shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400'
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>
                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}${category ? `&category=${category}` : ''}`}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600 text-white shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all group"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-96 space-y-12">
            <div className="sticky top-32 space-y-12">
              {/* Ad Slot */}
              <AdSlot placement="sidebar" />

              {/* Trending */}
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  Trending <span className="text-gray-400">Now</span>
                </h3>
                <div className="space-y-8">
                  {trending.slice(0, 5).map((article: any, idx: number) => (
                    <Link 
                      key={article._id.toString()} 
                      href={`/article/${article.slug}`}
                      className="group flex gap-4"
                    >
                      <span className="text-4xl font-black text-gray-100 dark:text-gray-800 group-hover:text-red-500/20 transition-colors leading-none">{idx + 1}</span>
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {article.category?.name} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {Math.ceil(article.content.split(' ').length / 200)}m Read
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Small */}
              <div className="bg-red-600 rounded-4xl p-8 text-white shadow-2xl shadow-red-500/30">
                <Newspaper className="w-10 h-10 mb-6 opacity-50" />
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-4">
                  The Morning <br /> Intelligence
                </h3>
                <p className="text-sm font-medium text-red-100 mb-6">
                  Get the day&apos;s most important stories delivered to your inbox.
                </p>
                <Link 
                  href="#newsletter" 
                  className="inline-flex w-full items-center justify-center py-4 bg-white text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                  Join the Society
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
