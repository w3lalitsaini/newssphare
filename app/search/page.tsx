import { Metadata } from 'next';
// Force dynamic rendering and disable caching to ensure fresh articles in production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Fragment } from 'react';
import ArticleCard from '@/components/article/ArticleCard';
import AdSlot from '@/components/ads/AdSlot';
import { Search } from 'lucide-react';
import { searchArticles } from '@/lib/data';

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}"` : 'Search Articles',
    description: q ? `Search results for "${q}" on NewsSphere` : 'Search NewsSphere',
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  const { articles, total, pages } = await searchArticles(q, page, 12);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <form className="flex gap-3 max-w-2xl mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search articles, topics, categories..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
          />
        </div>
        <button type="submit" className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">
          Search
        </button>
      </form>

      {q && (
        <p className="text-sm text-gray-500 mb-6">
          {total > 0 ? <><span className="font-bold text-gray-900 dark:text-white">{total}</span> results for &ldquo;{q}&rdquo;</> : `No results for "${q}"`}
        </p>
      )}

      <div className="flex justify-center mb-8">
        <AdSlot placement="top-banner" />
      </div>

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {(articles as any[]).map((article: any, i: number) => (
              <Fragment key={article._id.toString()}>
                <ArticleCard article={article} />
                {(i + 1) % 4 === 0 && (i + 1) < articles.length && (
                  <div className="col-span-full flex justify-center my-4">
                    <AdSlot placement="between-cards" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          <div className="flex justify-center my-10">
            <AdSlot placement="between-cards" />
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400">
            {q ? 'No articles found' : 'Search NewsSphere'}
          </h2>
          <p className="text-gray-400 mt-2">
            {q ? 'Try different keywords or browse categories' : 'Enter keywords to find articles and stories'}
          </p>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`?q=${encodeURIComponent(q)}&page=${p}`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                p === page ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
