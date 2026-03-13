import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Advertisement from '@/models/Advertisement';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as any)?.role === 'admin';
}

export async function GET() {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const ads = await Advertisement.find().sort({ createdAt: -1 });
    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching advertisements' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, type, placement, provider, code, image, link, active, startDate, endDate } = body;

    if (!title || !placement) {
      return NextResponse.json({ message: 'Title and placement are required' }, { status: 400 });
    }

    await connectDB();
    
    const ad = await Advertisement.create({
      title, type, placement, provider, code, image, link, active, startDate, endDate
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json({ message: 'Error creating advertisement' }, { status: 500 });
  }
}
