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

export async function GET() {
  try {
    await connectDB();
    const tags = await Tag.find().sort({ name: 1 });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching tags' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    await connectDB();
    
    const slug = slugify(name, { lower: true, strict: true });
    
    const existing = await Tag.findOne({ slug });
    if (existing) {
      return NextResponse.json({ message: 'Tag already exists' }, { status: 409 });
    }

    const tag = await Tag.create({ name, slug });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Create tag error:', error);
    return NextResponse.json({ message: 'Error creating tag' }, { status: 500 });
  }
}
