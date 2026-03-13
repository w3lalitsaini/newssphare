import { Metadata } from 'next';
import ArticleCard from '@/components/article/ArticleCard';
import AdSlot from '@/components/ads/AdSlot';
import { TrendingUp, Award } from 'lucide-react';
import { getTrendingArticles } from '@/lib/data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Trending News & Viral Stories | NewsSphere',
  description: 'See what everyone is reading. Most popular and trending news stories on NewsSphere.',
};

export const revalidate = 60;

export default async function TrendingPage() {
  const trending = await getTrendingArticles(20);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Trending Now</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          The most popular stories and most-read articles from the last 24 hours
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <AdSlot placement="top-banner" />
      </div>

      {trending.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {trending.map((article: any, index: number) => (
              <div key={article._id.toString()} className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-black text-sm z-10 shadow-lg">
                  {index + 1}
                </div>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          <div className="flex justify-center my-10">
            <AdSlot placement="between-cards" />
          </div>
        </>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-xl font-bold text-gray-400">No trending articles at the moment</h2>
        </div>
      )}
    </div>
  );
}
