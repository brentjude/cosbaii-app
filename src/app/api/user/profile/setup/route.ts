import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { triggerProfileBadges } from '@/lib/badgeTriggers';

// ✅ Only include fields that exist in the Profile schema
const profileSetupSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(100),
  bio: z.string().max(500).optional(),
  profilePicture: z.string().url().optional(),
  profilePicturePublicId: z.string().optional(),
  coverImage: z.string().url().optional(),
  coverImagePublicId: z.string().optional(),
  cosplayerType: z.enum(['COMPETITIVE', 'HOBBY', 'PROFESSIONAL']).optional(),
  yearsOfExperience: z.number().int().min(0).max(100).nullable().optional(),
  specialization: z.string().max(200).optional(),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  tiktokUrl: z.string().url().optional().or(z.literal('')),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  receiveEmailUpdates: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();

    const validationResult = profileSetupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      );
    }

    // ✅ Create profile with ONLY fields that exist in schema
    const profile = await prisma.profile.create({
      data: {
        userId,
        displayName: data.displayName,
        bio: data.bio || null,
        profilePicture: data.profilePicture || '/images/default-avatar.png',
        profilePicturePublicId: data.profilePicturePublicId || null,
        coverImage: data.coverImage || '/images/default-cover.jpg',
        coverImagePublicId: data.coverImagePublicId || null,
        cosplayerType: data.cosplayerType || 'HOBBY',
        yearsOfExperience: data.yearsOfExperience ?? null,
        specialization: data.specialization || null,
        skillLevel: data.skillLevel || null,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        twitterUrl: data.twitterUrl || null,
        tiktokUrl: data.tiktokUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        receiveEmailUpdates: data.receiveEmailUpdates ?? false,
      },
    });

    // ✅ Trigger profile badge checks
    await triggerProfileBadges(userId);

    return NextResponse.json(
      {
        message: 'Profile created successfully',
        profile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';