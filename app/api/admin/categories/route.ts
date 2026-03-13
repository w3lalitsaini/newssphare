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

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, image } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    await connectDB();
    
    const slug = slugify(name, { lower: true, strict: true });
    
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ message: 'Category already exists' }, { status: 409 });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ message: 'Error creating category' }, { status: 500 });
  }
}
