// Create: src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile,
    });

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

    const {
      displayName,
      bio,
      profilePicture,
      coverImage,
      cosplayerType,
      yearsOfExperience,
      specialization,
      skillLevel,
      // Note: featured is handled separately in /api/user/featured
    } = profileData;

    // Validate required fields
    if (!specialization || !skillLevel || !cosplayerType) {
      return NextResponse.json(
        { error: 'Missing required profile fields' },
        { status: 400 }
      );
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete profile setup first.' },
        { status: 404 }
      );
    }

    // Update the profile
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        displayName: displayName || existingProfile.displayName,
        bio: bio || null,
        profilePicture: profilePicture || existingProfile.profilePicture,
        coverImage: coverImage || existingProfile.coverImage,
        cosplayerType,
        yearsOfExperience,
        specialization,
        skillLevel,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'Profile updated successfully',
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// POST - Create initial profile (if needed)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const profileData = await request.json();

    const {
      displayName,
      bio,
      profilePicture,
      coverImage,
      cosplayerType,
      yearsOfExperience,
      specialization,
      skillLevel,
    } = profileData;

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists. Use PUT to update.' },
        { status: 409 }
      );
    }

    // Create new profile
    const newProfile = await prisma.profile.create({
      data: {
        userId,
        displayName,
        bio: bio || null,
        profilePicture: profilePicture || "/images/default-avatar.png",
        coverImage: coverImage || "/images/default-cover.jpg",
        cosplayerType,
        yearsOfExperience,
        specialization,
        skillLevel,
      },
    });

    return NextResponse.json({
      success: true,
      profile: newProfile,
      message: 'Profile created successfully',
    });

  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}