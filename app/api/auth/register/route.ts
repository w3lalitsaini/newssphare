import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import crypto from 'crypto';
import { sendOtpMail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password: hashed,
      isVerified: false // Explicitly set to false until OTP verified
    });

    // Generate and send OTP
    const code = crypto.randomInt(100000, 999999).toString();
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, new: true }
    );

    await sendOtpMail(email, code);

    return NextResponse.json({ 
      message: 'Account created. Please check your email for verification code.',
      requiresVerification: true,
      email: email.toLowerCase()
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
