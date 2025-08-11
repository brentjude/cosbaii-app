// src/app/api/upload/signature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { generateUploadSignature } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { timestamp, upload_preset, folder } = await request.json();

    // Validate environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.error('CLOUDINARY_CLOUD_NAME is not set');
      return NextResponse.json({ error: 'Cloudinary configuration missing' }, { status: 500 });
    }

    if (!process.env.CLOUDINARY_API_KEY) {
      console.error('CLOUDINARY_API_KEY is not set');
      return NextResponse.json({ error: 'Cloudinary configuration missing' }, { status: 500 });
    }

    // Validate required fields
    if (!timestamp || !upload_preset) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const paramsToSign = {
      timestamp: timestamp.toString(),
      upload_preset,
      ...(folder && { folder }),
    };

    const signature = generateUploadSignature(paramsToSign);

    return NextResponse.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });

  } catch (error) {
    console.error('Error generating upload signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}