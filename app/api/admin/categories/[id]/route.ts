import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';

// Auth check helper
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
    const { name, description, image } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    await connectDB();
    
    const slug = slugify(name, { lower: true, strict: true });
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, image },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({ message: 'Error updating category' }, { status: 500 });
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
    
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ message: 'Error deleting category' }, { status: 500 });
  }
}
