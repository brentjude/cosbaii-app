// Update: src/app/api/upload/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { deleteImageFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, imageType, publicId } = await request.json();

    if (!imageUrl || !imageType || !['profile', 'cover'].includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // Get current profile to check for existing images
    const currentProfile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        profilePicture: true,
        profilePicturePublicId: true,
        coverImage: true,
        coverImagePublicId: true,
      },
    });

    // Determine which field to update
    const isProfile = imageType === 'profile';
    const currentImageUrl = isProfile ? currentProfile?.profilePicture : currentProfile?.coverImage;
    const currentPublicId = isProfile ? currentProfile?.profilePicturePublicId : currentProfile?.coverImagePublicId;

    // Delete old image from Cloudinary if it exists and is not a default image
    if (currentImageUrl && 
        !currentImageUrl.includes('/images/default-') && 
        currentImageUrl.includes('res.cloudinary.com')) {
      
      try {
        // Use stored public ID or extract from URL
        const oldPublicId = currentPublicId || extractPublicIdFromUrl(currentImageUrl);
        
        if (oldPublicId) {
          await deleteImageFromCloudinary(oldPublicId);
          console.log(`Deleted old ${imageType} image:`, oldPublicId);
        }
      } catch (deleteError) {
        console.error(`Error deleting old ${imageType} image:`, deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Update profile with new image URL and public ID
    const updateData = isProfile 
      ? { 
          profilePicture: imageUrl,
          profilePicturePublicId: publicId 
        }
      : { 
          coverImage: imageUrl,
          coverImagePublicId: publicId 
        };

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      publicId,
      message: `${imageType} image updated successfully`,
      deletedOld: currentImageUrl ? true : false,
    });

  } catch (error) {
    console.error('Error updating profile image:', error);
    return NextResponse.json(
      { error: 'Failed to update profile image' },
      { status: 500 }
    );
  }
}