import connectDB from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendResetPasswordMail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // We don't want to leak if the email exists, but for better UX we can just say "If an account exists..."
    // However, for this project, let's just proceed if user exists.
    if (!user) {
      return NextResponse.json({ message: 'If an account exists with that email, a reset link has been sent.' });
    }

    // Generate token (reusing Otp model for simplicity, or we can use a dedicated ResetToken model)
    const token = crypto.randomBytes(32).toString('hex');
    
    // Upsert Token into Otp model (we'll treat the 'code' field as the token)
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code: token, expiresAt: new Date(Date.now() + 60 * 60 * 1000) }, // 1 hour
      { upsert: true, new: true }
    );

    const mailResult = await sendResetPasswordMail(email, token);

    if (!mailResult.success) {
      return NextResponse.json({ message: 'Failed to send reset email' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'If an account exists with that email, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
