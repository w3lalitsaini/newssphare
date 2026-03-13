import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tag from '@/models/Tag';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';

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
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    await connectDB();
    
    const slug = slugify(name, { lower: true, strict: true });
    
    const tag = await Tag.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true }
    );

    if (!tag) {
      return NextResponse.json({ message: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Update tag error:', error);
    return NextResponse.json({ message: 'Error updating tag' }, { status: 500 });
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
    
    const tag = await Tag.findByIdAndDelete(id);

    if (!tag) {
      return NextResponse.json({ message: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Delete tag error:', error);
    return NextResponse.json({ message: 'Error deleting tag' }, { status: 500 });
  }
}
