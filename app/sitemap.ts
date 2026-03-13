import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newssphere.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${siteUrl}/latest`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }));

  // In production, fetch articles from DB:
  // const articles = await Article.find({ status: 'published' }).select('slug updatedAt').lean();
  // const articlePages = articles.map(a => ({ url: `${siteUrl}/article/${a.slug}`, lastModified: a.updatedAt, ... }));

  return [...staticPages, ...categoryPages];
}
