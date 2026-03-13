import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'author'].includes((session.user as any).role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ message: 'No file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'newssphere',
      transformation: [{ width: 1200, height: 630, crop: 'fill', quality: 'auto', fetch_format: 'auto' }],
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
