import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, Tag, Eye, Share2, Bookmark } from 'lucide-react';
import Sidebar from '@/components/article/Sidebar';
import AdSlot from '@/components/ads/AdSlot';
import ArticleCard from '@/components/article/ArticleCard';
import CommentSection from '@/components/article/CommentSection';
import { formatDate } from '@/lib/utils';
import { getArticleBySlug, getRelatedArticles, getSidebarData, getArticleComments } from '@/lib/data';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug) as any;
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.title, description: article.excerpt,
      images: [{ url: article.featuredImage, width: 1200, height: 630 }],
      type: 'article', publishedTime: article.publishedAt,
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt, images: [article.featuredImage] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug) as any;
  if (!article) notFound();

  const [related, sidebarData, comments] = await Promise.all([
    getRelatedArticles(article._id.toString(), article.category._id?.toString(), 4),
    getSidebarData(),
    getArticleComments(article._id.toString()),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: article.title, description: article.excerpt,
    image: article.featuredImage, datePublished: article.publishedAt,
    author: { '@type': 'Person', name: article.author.name },
    publisher: { '@type': 'Organization', name: 'NewsSphere', logo: { '@type': 'ImageObject', url: '/logo.png' } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex justify-center mb-6">
          <AdSlot placement="top-banner" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
              <Link href="/" className="hover:text-red-600">Home</Link>
              <span>/</span>
              <Link href={`/category/${article.category.slug}`} className="hover:text-red-600">{article.category.name}</Link>
              <span>/</span>
              <span className="truncate max-w-xs text-gray-700 dark:text-gray-300">{article.title}</span>
            </nav>

            <Link href={`/category/${article.category.slug}`}
              className="inline-block px-3 py-1 rounded-full text-sm font-bold text-white mb-4"
              style={{ backgroundColor: article.category.color }}>
              {article.category.name}
            </Link>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 border-l-4 border-red-600 pl-4">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-5 mb-5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                {article.author.image
                  ? <img src={article.author.image} alt={article.author.name} className="w-8 h-8 rounded-full object-cover" />
                  : <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">{article.author.name[0]}</div>
                }
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{article.author.name}</span>
                  {article.author.bio && <span className="text-xs block text-gray-400">{article.author.bio}</span>}
                </div>
              </div>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readingTime} min read</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{article.views.toLocaleString()} views</span>
              <div className="ml-auto flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><Share2 className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><Bookmark className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
              <Image src={article.featuredImage} alt={article.featuredImageAlt || article.title} fill className="object-cover" priority />
            </div>

            <div className="flex justify-center my-6">
              <AdSlot placement="in-article" />
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-red-50 dark:prose-blockquote:bg-red-950/20
              prose-blockquote:rounded-r-xl prose-blockquote:p-4 prose-blockquote:not-italic
              prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-code:text-red-600 prose-code:bg-red-50 dark:prose-code:bg-red-950/30
              prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="flex justify-center my-8">
              <AdSlot placement="in-article" />
            </div>

            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
                <Tag className="w-4 h-4 text-gray-400 mt-1" />
                {article.tags.map((tag: any) => (
                  <Link key={tag._id.toString()} href={`/tag/${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-sm rounded-full transition-colors">
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex justify-center my-8">
              <AdSlot placement="in-article" />
            </div>

            {related.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {(related as any[]).map((rel: any) => <ArticleCard key={rel._id.toString()} article={rel} />)}
                </div>
              </div>
            )}

            <CommentSection articleId={article._id.toString()} initialComments={comments as any[]} />
          </article>

          <div className="hidden lg:block">
            <div className="sticky top-20">
              <Sidebar trending={sidebarData.trending as any[]} popular={sidebarData.popular as any[]} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
