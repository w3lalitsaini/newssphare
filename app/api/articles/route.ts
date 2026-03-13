import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Article from '@/models/Article';
import { generateSlug, calculateReadingTime } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const isFeatured = searchParams.get('featured');
    const isTrending = searchParams.get('trending');
    const q = searchParams.get('q');

    const query: any = { status };
    if (category) query.category = category;
    if (isFeatured === 'true') query.isFeatured = true;
    if (isTrending === 'true') query.isTrending = true;
    if (q) query.$text = { $search: q };

    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate('author', 'name image')
        .populate('category', 'name slug color')
        .populate('tags', 'name slug')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(query),
    ]);

    return NextResponse.json({ articles, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'author'].includes((session.user as any).role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const slug = body.slug || generateSlug(body.title);
    const readingTime = calculateReadingTime(body.content);

    const article = await Article.create({
      ...body,
      slug,
      readingTime,
      author: (session.user as any).id,
      publishedAt: body.status === 'published' ? new Date() : undefined,
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
