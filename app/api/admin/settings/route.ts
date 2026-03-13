import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Setting from '@/models/Setting';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as any)?.role === 'admin';
}

export async function GET() {
  try {
    await connectDB();
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({});
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();
    
    const settings = await Setting.findOneAndUpdate(
      {},
      body,
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ message: 'Error updating settings' }, { status: 500 });
  }
}
