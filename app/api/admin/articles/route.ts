import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Article from '@/models/Article';
import Tag from '@/models/Tag';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as any)?.role === 'admin';
}

export async function GET(req: NextRequest) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const articles = await Article.find()
      .populate('category', 'name')
      .populate('author', 'name')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching articles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, category, tags, featuredImage, status, isFeatured, isTrending } = body;

    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
    }

    await connectDB();
    
    // Process tags: convert strings to ObjectIds, creating new tags if needed
    const processedTagIds = await Promise.all(
      (tags || []).map(async (tag: string | any) => {
        const tagName = typeof tag === 'string' ? tag : tag.name;
        if (!tagName) return null;
        
        const slug = slugify(tagName, { lower: true, strict: true });
        let existingTag = await Tag.findOne({ slug });
        
        if (!existingTag) {
          existingTag = await Tag.create({ name: tagName, slug });
        }
        
        return existingTag._id;
      })
    );
    const finalTags = processedTagIds.filter(id => id !== null);
    
    let slug = slugify(title, { lower: true, strict: true });
    
    // Check if slug exists
    const existing = await Article.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const article = await Article.create({
      title,
      slug,
      content,
      excerpt,
      category,
      tags: finalTags,
      featuredImage,
      status: status || 'draft',
      isFeatured: isFeatured || false,
      isTrending: isTrending || false,
      author: (session.user as any).id,
      publishedAt: status === 'published' ? new Date() : undefined
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json({ message: 'Error creating article' }, { status: 500 });
  }
}
