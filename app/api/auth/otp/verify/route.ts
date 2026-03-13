import connectDB from '@/lib/db';
import Otp from '@/models/Otp';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ message: 'Email and code are required' }, { status: 400 });
    }

    await connectDB();

    const otp = await Otp.findOne({ email: email.toLowerCase(), code });

    if (!otp) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    if (otp.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otp._id });
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    }

    // Success - activate user
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true }
    );

    await Otp.deleteOne({ _id: otp._id });

    return NextResponse.json({ message: 'Account verified successfully. You can now log in.' });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
