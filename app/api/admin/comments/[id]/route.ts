import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as any)?.role === 'admin';
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
    const { status } = await req.json();

    if (!['pending', 'approved', 'spam'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    await connectDB();
    
    const comment = await Comment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    return NextResponse.json({ message: 'Error updating comment' }, { status: 500 });
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
    
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ message: 'Error deleting comment' }, { status: 500 });
  }
}
