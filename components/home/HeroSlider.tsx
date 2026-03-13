'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface HeroArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: { name: string; slug: string; color: string };
  publishedAt: string;
  readingTime: number;
}

interface HeroSliderProps {
  articles: HeroArticle[];
}

export default function HeroSlider({ articles }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % articles.length);
  }, [articles.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + articles.length) % articles.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  if (!articles.length) return null;

  const article = articles[current];

  return (
    <div className="relative w-full h-[520px] md:h-[600px] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 80 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-content'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.name}
              </span>
              <span className="flex items-center gap-1 text-white/70 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1 text-white/70 text-xs">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime} min read
              </span>
            </div>
            <Link href={`/article/${article.slug}`}>
              <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight hover:text-red-300 transition-colors max-w-3xl">
                {article.title}
              </h2>
            </Link>
            <p className="text-white/80 text-sm md:text-base max-w-2xl line-clamp-2 mb-6">
              {article.excerpt}
            </p>
            <Link
              href={`/article/${article.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Read Full Story
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4">
        <button
          onClick={prev}
          className="w-10 h-10 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4">
        <button
          onClick={next}
          className="w-10 h-10 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {articles.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-5 right-5 text-white/70 text-sm font-mono">
        {String(current + 1).padStart(2, '0')} / {String(articles.length).padStart(2, '0')}
      </div>
    </div>
  );
}
