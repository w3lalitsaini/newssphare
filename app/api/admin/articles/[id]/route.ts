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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const article = await Article.findById(id).populate('tags', 'name');

    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching article' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, status, tags } = body;

    await connectDB();
    
    const updateData = { ...body };
    if (title) {
      updateData.slug = slugify(title, { lower: true, strict: true });
    }

    if (tags) {
      const processedTagIds = await Promise.all(
        (tags || []).map(async (tag: string | any) => {
          const tagName = typeof tag === 'string' ? tag : (tag.name || tag);
          if (!tagName || typeof tagName !== 'string') return tag._id || null;
          
          const slug = slugify(tagName, { lower: true, strict: true });
          let existingTag = await Tag.findOne({ slug });
          
          if (!existingTag) {
            existingTag = await Tag.create({ name: tagName, slug });
          }
          
          return existingTag._id;
        })
      );
      updateData.tags = processedTagIds.filter(id => id !== null);
    }
    
    if (status === 'published') {
      const current = await Article.findById(id);
      if (current && !current.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const article = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json({ message: 'Error updating article' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    
    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ message: 'Error deleting article' }, { status: 500 });
  }
}
