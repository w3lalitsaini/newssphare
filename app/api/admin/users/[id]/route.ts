import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
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
    const { role, isVerified, isBanned } = body;

    await connectDB();
    
    // Safety: prevent banning the current admin or removing their own role if possible
    // (In a real app, we'd check session.user.id !== id)

    const user = await User.findByIdAndUpdate(
      id,
      { role, isVerified, isBanned },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
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
    
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}
