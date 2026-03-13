import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Simple Subscription model if not exists
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  subscribedAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 409 });
    }

    await Subscriber.create({ email: email.toLowerCase() });

    return NextResponse.json({ message: 'Successfully subscribed to newsletter!' }, { status: 201 });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
