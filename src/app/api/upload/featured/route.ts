// Create: src/app/api/upload/featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, publicId, featuredIndex, competitionId } = await request.json();

    if (!imageUrl || featuredIndex === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the featured cosplay image URL
    // You can extend this to save full featured cosplay data
    return NextResponse.json({
      success: true,
      imageUrl,
      publicId,
      message: 'Featured image uploaded successfully',
    });

  } catch (error) {
    console.error('Error uploading featured image:', error);
    return NextResponse.json(
      { error: 'Failed to upload featured image' },
      { status: 500 }
    );
  }
}