import connectDB from './db';
import Article from '@/models/Article';
import Category from '@/models/Category';
import User from '@/models/User';
import Comment from '@/models/Comment';
import { jsonify } from './utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching for data fetchers to ensure fresh data in production

export async function getFeaturedArticles(limit = 5) {
  try {
    await connectDB();
    const articles = await Article.find({ status: 'published', isFeatured: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate('category', 'name slug color icon')
      .populate('author', 'name image')
      .lean();
    return jsonify(articles);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
}

export async function getTrendingArticles(limit = 6) {
  try {
    await connectDB();
    const articles = await Article.find({ status: 'published', isTrending: true })
      .sort({ views: -1, publishedAt: -1 })
      .limit(limit)
      .populate('category', 'name slug color icon')
      .populate('author', 'name image')
      .lean();
    return jsonify(articles);
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return jsonify(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getLatestArticles(limit = 8, page = 1, categorySlug?: string) {
  try {
    await connectDB();
    const skip = (page - 1) * limit;
    
    let query: any = { status: 'published' };
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        query.category = category._id;
      }
    }

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category', 'name slug color icon')
        .populate('author', 'name image')
        .lean(),
      Article.countDocuments(query),
    ]);

    return jsonify({
      articles,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return { articles: [], total: 0, pages: 0 };
  }
}

export async function getArticlesByCategory(categorySlug: string, limit = 10, page = 1) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) return { articles: [], total: 0 };

    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
      Article.find({ 
        status: 'published', 
        category: category._id 
      })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category', 'name slug color icon')
        .populate('author', 'name image')
        .lean(),
      Article.countDocuments({ status: 'published', category: category._id }),
    ]);

    return jsonify({ articles, total });
  } catch (error) {
    console.error(`Error fetching articles for category ${categorySlug}:`, error);
    return { articles: [], total: 0 };
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    await connectDB();
    const article = await Article.findOne({ slug, status: 'published' })
      .populate('category', 'name slug color icon')
      .populate('author', 'name image bio')
      .populate('tags', 'name slug')
      .lean();
    return jsonify(article);
  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error);
    return null;
  }
}

export async function getRelatedArticles(currentId: string, categoryId: string, limit = 4) {
  try {
    await connectDB();
    const articles = await Article.find({
      _id: { $ne: currentId },
      category: categoryId,
      status: 'published'
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate('category', 'name slug color icon')
      .populate('author', 'name image')
      .lean();
    return jsonify(articles);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export async function getSidebarData() {
  try {
    await connectDB();
    const [trending, popular] = await Promise.all([
      Article.find({ status: 'published', isTrending: true })
        .sort({ publishedAt: -1 })
        .limit(5)
        .populate('category', 'name slug color icon')
        .lean(),
      Article.find({ status: 'published' })
        .sort({ views: -1 })
        .limit(5)
        .populate('category', 'name slug color icon')
        .lean(),
    ]);
    return jsonify({ trending, popular });
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
    return { trending: [], popular: [] };
  }
}

export async function getArticleComments(articleId: string) {
  try {
    await connectDB();
    const comments = await Comment.find({ article: articleId, status: 'approved' })
      .sort({ createdAt: -1 })
      .populate('author', 'name image')
      .lean();
    return jsonify(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug }).lean();
    return jsonify(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function searchArticles(query: string, page = 1, limit = 12) {
  try {
    await connectDB();
    const skip = (page - 1) * limit;
    const filter = query 
      ? { status: 'published', $text: { $search: query } }
      : { status: 'published' };

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .sort(query ? { score: { $meta: 'textScore' } } : { publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category', 'name slug color icon')
        .populate('author', 'name image')
        .lean(),
      Article.countDocuments(filter),
    ]);

    return jsonify({
      articles,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error searching articles:', error);
    return { articles: [], total: 0, pages: 0 };
  }
}

export async function getAdminStats() {
  try {
    await connectDB();
    const [totalArticles, totalUsers, totalComments, viewStats] = await Promise.all([
      Article.countDocuments({ status: 'published' }),
      User.countDocuments(),
      Comment.countDocuments(),
      Article.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]),
    ]);

    return jsonify({
      totalArticles,
      totalUsers,
      totalComments,
      totalViews: viewStats[0]?.totalViews || 0,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return { totalArticles: 0, totalUsers: 0, totalComments: 0, totalViews: 0 };
  }
}

export async function getRecentArticlesAdmin(limit = 5) {
  try {
    await connectDB();
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'name')
      .lean();
    return jsonify(articles);
  } catch (error) {
    console.error('Error fetching recent articles for admin:', error);
    return [];
  }
}

export async function getPendingComments(limit = 5) {
  try {
    await connectDB();
    const comments = await Comment.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'name')
      .populate('article', 'title')
      .lean();
    return jsonify(comments);
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    return [];
  }
}
