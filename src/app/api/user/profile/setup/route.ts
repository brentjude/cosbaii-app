// Update: src/app/api/user/profile/setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { BadgeTriggers } from '@/lib/badgeTriggers';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    console.log('Setting up profile for user:', userId);
    
    const profileData = await request.json();
    console.log('Profile data received:', profileData);

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
      // ✅ Add social media fields
      instagramUrl,
      facebookUrl,
      twitterUrl,
      tiktokUrl,
      youtubeUrl,
      receiveEmailUpdates,
    } = profileData;

    // ✅ Validate only required fields (be less strict)
    if (!cosplayerType || !displayName?.trim()) {
      return NextResponse.json(
        { error: 'Display name and cosplayer type are required' },
        { status: 400 }
      );
    }

    // ✅ Validate cosplayerType enum
    const validCosplayerTypes = ['HOBBY', 'COMPETITIVE', 'PROFESSIONAL'];
    if (!validCosplayerTypes.includes(cosplayerType)) {
      return NextResponse.json(
        { error: 'Invalid cosplayer type' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    console.log('Existing profile found:', !!existingProfile);

    let profile;

    // ✅ Prepare profile data with proper null handling
    const profileDataForDb = {
      cosplayerType,
      yearsOfExperience: yearsOfExperience || null,
      specialization: specialization?.trim() || null,
      skillLevel: skillLevel?.trim() || null,
      displayName: displayName.trim(),
      bio: bio?.trim() || null,
      profilePicture: profilePicture || '/images/default-avatar.png',
      coverImage: coverImage || '/images/default-cover.jpg',
      profilePicturePublicId: profilePicturePublicId || null,
      coverImagePublicId: coverImagePublicId || null,
      // ✅ Handle social media URLs
      instagramUrl: instagramUrl?.trim() || null,
      facebookUrl: facebookUrl?.trim() || null,
      twitterUrl: twitterUrl?.trim() || null,
      tiktokUrl: tiktokUrl?.trim() || null,
      youtubeUrl: youtubeUrl?.trim() || null,
      receiveEmailUpdates: receiveEmailUpdates || false,
    };

    console.log('Profile data for database:', profileDataForDb);

    if (existingProfile) {
      // Update existing profile
      console.log('Updating existing profile...');
      profile = await prisma.profile.update({
        where: { userId },
        data: profileDataForDb,
      });
      console.log('Profile updated successfully:', profile.id);
    } else {
      // Create new profile
      console.log('Creating new profile...');
      profile = await prisma.profile.create({
        data: {
          userId,
          ...profileDataForDb,
        },
      });
      console.log('Profile created successfully:', profile.id);
    }

    // ✅ Trigger badge check for profile completion
    try {
      console.log('Triggering badge check for profile update...');
      await BadgeTriggers.onProfileUpdate(userId);
      console.log('Badge check completed for profile update');
    } catch (badgeError) {
      console.error('Error checking badges after profile setup:', badgeError);
      // Don't fail the profile setup if badge check fails
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile setup completed successfully',
    });

  } catch (error) {
    console.error('Error setting up profile:', error);
    
    // ✅ Better error handling for Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      console.error('Prisma error details:', {
        code: prismaError.code,
        meta: prismaError.meta,
        message: prismaError.message
      });
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Profile data conflicts with existing data' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to setup profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}