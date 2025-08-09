// Create: src/app/api/upload/delete-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { deleteImageFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, publicId } = await request.json();

    if (!imageUrl && !publicId) {
      return NextResponse.json(
        { error: 'Either imageUrl or publicId is required' },
        { status: 400 }
      );
    }

    // Extract public ID from URL if not provided directly
    const targetPublicId = publicId || extractPublicIdFromUrl(imageUrl);

    if (!targetPublicId) {
      return NextResponse.json(
        { error: 'Could not extract public ID from image URL' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const deleteResult = await deleteImageFromCloudinary(targetPublicId);

    return NextResponse.json({
      success: true,
      deleted: deleteResult.result === 'ok',
      publicId: targetPublicId,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}