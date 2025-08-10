// Create: src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { BadgeTriggers } from '@/lib/badgeTriggers';

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    console.log('Fetching profile for user:', userId);

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      console.log('No profile found for user:', userId);
      return NextResponse.json({ profile: null });
    }

    console.log('Profile found:', profile.id);
    return NextResponse.json({ profile });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}


// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const profileData = await request.json();

    console.log('Updating profile for user:', userId, 'with data:', profileData);

    // Validate required fields
    if (!profileData.displayName || !profileData.cosplayerType) {
      return NextResponse.json(
        { error: 'Display name and cosplayer type are required' },
        { status: 400 }
      );
    }

    // Update the profile
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        displayName: profileData.displayName?.trim(),
        bio: profileData.bio?.trim() || null,
        cosplayerType: profileData.cosplayerType,
        yearsOfExperience: profileData.yearsOfExperience || null,
        specialization: profileData.specialization?.trim() || null,
        skillLevel: profileData.skillLevel?.trim() || null,
        profilePicture: profileData.profilePicture || '/images/default-avatar.png',
        coverImage: profileData.coverImage || '/images/default-cover.jpg',
        instagramUrl: profileData.instagramUrl?.trim() || null,
        facebookUrl: profileData.facebookUrl?.trim() || null,
        twitterUrl: profileData.twitterUrl?.trim() || null,
        tiktokUrl: profileData.tiktokUrl?.trim() || null,
        youtubeUrl: profileData.youtubeUrl?.trim() || null,
        receiveEmailUpdates: profileData.receiveEmailUpdates || false,
      },
    });

    console.log('Profile updated successfully:', profile.id);

    // ✅ Trigger badge check for profile update
    try {
      console.log('Triggering badge check for profile update...');
      await BadgeTriggers.onProfileUpdate(userId);
      console.log('Badge check completed for profile update');
    } catch (badgeError) {
      console.error('Error checking badges after profile update:', badgeError);
      // Don't fail the profile update if badge check fails
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      console.error('Prisma error:', {
        code: prismaError.code,
        meta: prismaError.meta,
        message: prismaError.message
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to update profile', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const profileData = await request.json();

    console.log('Creating profile for user:', userId, 'with data:', profileData);

    // Validate required fields
    if (!profileData.displayName || !profileData.cosplayerType) {
      return NextResponse.json(
        { error: 'Display name and cosplayer type are required' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists for this user' },
        { status: 409 }
      );
    }

    // Create the profile
    const profile = await prisma.profile.create({
      data: {
        userId,
        displayName: profileData.displayName?.trim(),
        bio: profileData.bio?.trim() || null,
        cosplayerType: profileData.cosplayerType,
        yearsOfExperience: profileData.yearsOfExperience || null,
        specialization: profileData.specialization?.trim() || null,
        skillLevel: profileData.skillLevel?.trim() || null,
        profilePicture: profileData.profilePicture || '/images/default-avatar.png',
        coverImage: profileData.coverImage || '/images/default-cover.jpg',
        instagramUrl: profileData.instagramUrl?.trim() || null,
        facebookUrl: profileData.facebookUrl?.trim() || null,
        twitterUrl: profileData.twitterUrl?.trim() || null,
        tiktokUrl: profileData.tiktokUrl?.trim() || null,
        youtubeUrl: profileData.youtubeUrl?.trim() || null,
        receiveEmailUpdates: profileData.receiveEmailUpdates || false,
      },
    });

    console.log('Profile created successfully:', profile.id);

    // ✅ Trigger badge check for profile completion
    try {
      console.log('Triggering badge check for profile completion...');
      await BadgeTriggers.onProfileUpdate(userId);
      console.log('Badge check completed for profile update');
    } catch (badgeError) {
      console.error('Error checking badges after profile creation:', badgeError);
      // Don't fail the profile creation if badge check fails
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile created successfully'
    });

  } catch (error) {
    console.error('Error creating profile:', error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      console.error('Prisma error:', {
        code: prismaError.code,
        meta: prismaError.meta,
        message: prismaError.message
      });
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'A profile with this information already exists' },
          { status: 409 }
        );
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create profile', details: errorMessage },
      { status: 500 }
    );
  }
}