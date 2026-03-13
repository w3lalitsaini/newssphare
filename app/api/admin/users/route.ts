import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
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
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}
