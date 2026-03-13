import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Zap, ChevronRight } from 'lucide-react';
import HeroSlider from '@/components/home/HeroSlider';
import ArticleCard from '@/components/article/ArticleCard';
import AdSlot from '@/components/ads/AdSlot';
import { CATEGORIES } from '@/lib/utils';
import {
  getFeaturedArticles,
  getTrendingArticles,
  getLatestArticles,
  getArticlesByCategory,
} from '@/lib/data';

export const metadata: Metadata = {
  title: 'NewsSphere - Breaking News, Analysis & Global Insights',
  description: 'Your premier source for breaking news, technology, business, sports, health, and more.',
};

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const [featured, trending, { articles: latest }] = await Promise.all([
    getFeaturedArticles(5),
    getTrendingArticles(6),
    getLatestArticles(8),
  ]);

  // Fetch category articles in parallel
  const categoryData = await Promise.all(
    CATEGORIES.slice(0, 4).map(async (cat) => ({
      cat,
      articles: await getArticlesByCategory(cat.slug, 4),
    }))
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Top Banner Ad */}
      <div className="flex justify-center mb-6">
        <AdSlot placement="top-banner" />
      </div>

      {/* Hero + Side Stories */}
      {featured.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <HeroSlider articles={featured as any} />
          </div>
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-red-600 inline-block" />Top Stories
            </h2>
            {latest.slice(0, 4).map((article: any) => (
              <ArticleCard key={article._id.toString()} article={article} variant="horizontal" />
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />Trending Now
            </h2>
            <Link href="/trending" className="text-sm text-red-600 font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trending.map((article: any) => (
              <ArticleCard key={article._id.toString()} article={article} />
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-center my-8">
        <AdSlot placement="between-cards" />
      </div>

      {/* Latest Articles */}
      {latest.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />Latest Articles
            </h2>
            <Link href="/latest" className="text-sm text-red-600 font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latest.map((article: any) => (
              <ArticleCard key={article._id.toString()} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Category Sections */}
      {categoryData.map(({ cat, articles }, idx) => (
        articles.length > 0 && (
          <section key={cat.slug} className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                {cat.icon} {cat.name}
              </h2>
              <Link href={`/category/${cat.slug}`} className="text-sm font-semibold flex items-center gap-1" style={{ color: cat.color }}>
                More {cat.name} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(articles as any[]).map((article: any) => (
                <ArticleCard key={article._id.toString()} article={article} />
              ))}
            </div>
            {idx % 2 === 1 && (
              <div className="flex justify-center mt-6">
                <AdSlot placement="between-cards" />
              </div>
            )}
          </section>
        )
      ))}

      {/* Empty state when no articles published yet */}
      {featured.length === 0 && trending.length === 0 && latest.length === 0 && (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-black text-gray-700 dark:text-gray-300 mb-2">No articles yet</h2>
          <p className="text-gray-500 mb-6">Head to the admin panel to publish your first article.</p>
          <Link href="/admin" className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
            Go to Admin Panel
          </Link>
        </div>
      )}
    </div>
  );
}
