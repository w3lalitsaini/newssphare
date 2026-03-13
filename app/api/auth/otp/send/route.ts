import connectDB from '@/lib/db';
import Otp from '@/models/Otp';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendOtpMail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    // Generate 6-digit OTP
    const code = crypto.randomInt(100000, 999999).toString();

    // Upsert OTP
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, new: true }
    );

    // Send real email
    const mailResult = await sendOtpMail(email, code);

    if (!mailResult.success) {
      return NextResponse.json({ message: 'Failed to send OTP email' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'OTP sent successfully. Please check your email.',
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
