import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    
    const comments = await Comment.find()
      .populate('userId', 'name email image')
      .populate('articleId', 'title slug')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Fetch comments error:', error);
    return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
  }
}
