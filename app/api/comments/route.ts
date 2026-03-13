import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get('articleId');
    const status = searchParams.get('status') || 'approved';

    const query: any = { status };
    if (articleId) query.article = articleId;

    const comments = await Comment.find(query)
      .populate('author', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(comments);
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Login required' }, { status: 401 });

    await connectDB();
    const { articleId, content, parentComment } = await req.json();

    if (!content?.trim()) return NextResponse.json({ message: 'Content required' }, { status: 400 });

    const comment = await Comment.create({
      article: articleId,
      author: (session.user as any).id,
      content: content.trim(),
      parentComment,
      status: 'pending',
    });

    await comment.populate('author', 'name image');
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
