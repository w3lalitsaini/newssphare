import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Article from '@/models/Article';
import { calculateReadingTime } from '@/lib/utils';

interface Params { params: Promise<{ slug: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    await connectDB();
    const article = await Article.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name image bio')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .lean();

    if (!article) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'author'].includes((session.user as any).role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    if (body.content) body.readingTime = calculateReadingTime(body.content);
    if (body.status === 'published') body.publishedAt = new Date();

    const article = await Article.findOneAndUpdate({ slug }, body, { new: true });
    if (!article) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    await Article.findOneAndDelete({ slug });
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
