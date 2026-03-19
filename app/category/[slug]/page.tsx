import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import ArticleCard from '@/components/article/ArticleCard';
import AdSlot from '@/components/ads/AdSlot';
import { CATEGORIES } from '@/lib/utils';
import { getCategoryBySlug, getArticlesByCategory } from '@/lib/data';
import connectDB from '@/lib/db';
import Article from '@/models/Article';
import Category from '@/models/Category';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return {
    title: `${cat?.name ?? slug} News - Latest Articles`,
    description: `Latest ${cat?.name ?? slug} news and analysis from NewsSphere.`,
  };
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;

  const staticCat = CATEGORIES.find((c) => c.slug === slug);
  if (!staticCat) notFound();

  const page = Number(pageStr) || 1;
  const perPage = 12;

  // Get real category and articles using centralized data fetcher
  const { articles, total } = await getArticlesByCategory(slug, perPage, page);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-1.5 h-8 rounded-full inline-block" style={{ backgroundColor: staticCat.color }} />
          <span className="text-3xl">{staticCat.icon}</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{staticCat.name}</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 ml-8">
          Latest {staticCat.name.toLowerCase()} news, analysis and insights
          {total > 0 && <span className="ml-2 text-sm">— {total} articles</span>}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <AdSlot placement="top-banner" />
      </div>

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {articles.map((article: any, i: number) => (
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

          <div className="flex justify-center mb-8">
            <AdSlot placement="between-cards" />
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`?page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                    p === page ? 'text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  style={p === page ? { backgroundColor: staticCat.color } : {}}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">{staticCat.icon}</div>
          <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No articles yet</h2>
          <p className="text-gray-400">Check back soon for {staticCat.name.toLowerCase()} coverage.</p>
        </div>
      )}
    </div>
  );
}
