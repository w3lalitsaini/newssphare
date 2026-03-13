import connectDB from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await connectDB();

    const otpData = await Otp.findOne({ email: email.toLowerCase(), code: token });

    if (!otpData) {
      return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (otpData.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpData._id });
      return NextResponse.json({ message: 'Reset link has expired' }, { status: 400 });
    }

    // Hash new password
    const hashed = await bcrypt.hash(password, 12);

    // Update user
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashed }
    );

    // Delete token
    await Otp.deleteOne({ _id: otpData._id });

    return NextResponse.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
