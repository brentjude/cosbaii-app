// Create: src/app/api/user/profile/setup/route.ts
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

    const userId = parseInt(session.user.id);
    const profileData = await request.json();

    const {
      cosplayerType,
      yearsOfExperience,
      specialization,
      skillLevel,
      displayName,
      bio,
      profilePicture,
      coverImage,
      profilePicturePublicId,
      coverImagePublicId,
    } = profileData;

    // Validate required fields
    if (!cosplayerType || !specialization || !skillLevel || !displayName) {
      return NextResponse.json(
        { error: 'Missing required profile fields' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    let profile;

    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { userId },
        data: {
          cosplayerType,
          yearsOfExperience,
          specialization,
          skillLevel,
          displayName,
          bio: bio || null,
          profilePicture,
          coverImage,
          profilePicturePublicId,
          coverImagePublicId,
        },
      });
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          userId,
          cosplayerType,
          yearsOfExperience,
          specialization,
          skillLevel,
          displayName,
          bio: bio || null,
          profilePicture,
          coverImage,
          profilePicturePublicId,
          coverImagePublicId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile setup completed successfully',
    });

  } catch (error) {
    console.error('Error setting up profile:', error);
    return NextResponse.json(
      { error: 'Failed to setup profile' },
      { status: 500 }
    );
  }
}