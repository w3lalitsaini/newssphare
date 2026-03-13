import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: string;
    author: { name: string };
    category: { name: string; slug: string; color: string };
    publishedAt: string;
    readingTime: number;
    views?: number;
  };
  variant?: 'default' | 'compact' | 'featured' | 'horizontal';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'horizontal') {
    return (
      <Link href={`/article/${article.slug}`} className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: article.category.color }}
          >
            {article.category.name}
          </span>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mt-0.5 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {article.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{formatDate(article.publishedAt)}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} className="group flex gap-3">
        <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 transition-colors">
            {article.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{formatDate(article.publishedAt)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-lg"
            style={{ backgroundColor: article.category.color }}
          >
            {article.category.name}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {article.author.name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {article.readingTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
