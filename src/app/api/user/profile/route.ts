import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    const featuredItems = await prisma.featuredItem.findMany({
      where: { userId },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            eventDate: true,
            location: true,
            competitionType: true,
            rivalryType: true,
            level: true,
            logoUrl: true,
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      profile,
      featured: featuredItems,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();

    const {
      displayName,
      bio,
      profilePicture,
      coverImage,
      cosplayerType,
      yearsOfExperience,
      specialization,
      skillLevel,
      facebookUrl,
      instagramUrl,
      twitterUrl,
    } = body;

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        displayName,
        bio,
        profilePicture,
        coverImage,
        cosplayerType,
        yearsOfExperience,
        specialization,
        skillLevel,
        facebookUrl: facebookUrl || null,
        instagramUrl: instagramUrl || null,
        twitterUrl: twitterUrl || null,
      },
    });

    const featuredItems = await prisma.featuredItem.findMany({
      where: { userId },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            eventDate: true,
            location: true,
            competitionType: true,
            rivalryType: true,
            level: true,
            logoUrl: true,
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      profile: updatedProfile,
      featured: featuredItems,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      displayName,
      bio,
      profilePicture,
      coverImage,
      cosplayerType,
      yearsOfExperience,
      specialization,
      skillLevel,
    } = body;

    const newProfile = await prisma.profile.create({
      data: {
        userId,
        displayName,
        bio,
        profilePicture,
        coverImage,
        cosplayerType,
        yearsOfExperience,
        specialization,
        skillLevel,
      },
    });

    return NextResponse.json({
      profile: newProfile,
      featured: [],
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}