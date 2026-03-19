import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMMM d, yyyy');
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function jsonify<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const CATEGORIES = [
  { name: 'Technology', slug: 'technology', color: '#3B82F6', icon: '💻' },
  { name: 'Business', slug: 'business', color: '#10B981', icon: '📈' },
  { name: 'Entertainment', slug: 'entertainment', color: '#8B5CF6', icon: '🎬' },
  { name: 'Sports', slug: 'sports', color: '#F59E0B', icon: '⚽' },
  { name: 'Health', slug: 'health', color: '#EF4444', icon: '🏥' },
  { name: 'Politics', slug: 'politics', color: '#6B7280', icon: '🏛️' },
  { name: 'Science', slug: 'science', color: '#06B6D4', icon: '🔬' },
  { name: 'World', slug: 'world', color: '#F97316', icon: '🌍' },
];

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Latest', href: '/latest' },
  { label: 'Trending', href: '/trending' },
  { label: 'Technology', href: '/category/technology' },
  { label: 'Business', href: '/category/business' },
  { label: 'Entertainment', href: '/category/entertainment' },
  { label: 'Sports', href: '/category/sports' },
  { label: 'Health', href: '/category/health' },
];
