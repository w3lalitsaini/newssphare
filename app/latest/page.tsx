import { Metadata } from 'next';
import ArticleCard from '@/components/article/ArticleCard';
import AdSlot from '@/components/ads/AdSlot';
import { Zap, ChevronRight } from 'lucide-react';
import { getLatestArticles } from '@/lib/data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Latest News & Stories | NewsSphere',
  description: 'Stay updated with the most recent articles and breaking news from around the world.',
};

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function LatestPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;
  const limit = 12;

  const { articles, total, pages } = await getLatestArticles(limit, page);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Latest Stories</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          The most recent updates and breaking news across all categories
          {total > 0 && <span className="ml-2 text-sm">— {total} articles</span>}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <AdSlot placement="top-banner" />
      </div>

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {articles.map((article: any) => (
              <ArticleCard key={article._id.toString()} article={article} />
            ))}
          </div>

          <div className="flex justify-center my-10">
            <AdSlot placement="between-cards" />
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/latest?page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                    p === page 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-xl font-bold text-gray-400">No latest articles found</h2>
        </div>
      )}
    </div>
  );
}
