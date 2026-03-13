import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, image, password } = await req.json();
    await connectDB();
    
    const updateData: any = { name, image };
    
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true }
    ).select('-password');

    return NextResponse.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
  }
}
