import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Advertisement from '@/models/Advertisement';
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
    const body = await req.json();

    await connectDB();
    
    const ad = await Advertisement.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!ad) {
      return NextResponse.json({ message: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch (error) {
    console.error('Update ad error:', error);
    return NextResponse.json({ message: 'Error updating advertisement' }, { status: 500 });
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
    
    const ad = await Advertisement.findByIdAndDelete(id);

    if (!ad) {
      return NextResponse.json({ message: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    return NextResponse.json({ message: 'Error deleting advertisement' }, { status: 500 });
  }
}
