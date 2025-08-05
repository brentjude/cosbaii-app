import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// ✅ Updated schema with 160 character bio limit
const profileSetupSchema = z.object({
  cosplayerType: z.enum(["COMPETITIVE", "HOBBY", "PROFESSIONAL"]),
  yearsOfExperience: z.number().nullable().optional(),
  specialization: z.string().min(1, "Specialization is required").max(100),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  profilePicture: z.string().optional(),
  coverImage: z.string().optional(),
});

// POST: Create or update user profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = profileSetupSchema.parse(body);
    
    const {
      cosplayerType,
      yearsOfExperience,
      specialization,
      skillLevel,
      displayName,
      bio,
      profilePicture,
      coverImage,
    } = validatedData;

    // ✅ Convert string ID to number safely
    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ 
        message: "Invalid user ID" 
      }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
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
          profilePicture: profilePicture || "/images/default-avatar.png",
          coverImage: coverImage || "/images/default-cover.jpg",
          updatedAt: new Date(),
        }
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
          profilePicture: profilePicture || "/images/default-avatar.png",
          coverImage: coverImage || "/images/default-cover.jpg",
        }
      });
    }

    return NextResponse.json({
      profile,
      message: "Profile setup completed successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error setting up profile:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: "Validation failed",
        errors: error.issues
      }, { status: 400 });
    }
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        message: "Profile setup failed",
        error: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}

// GET: Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    // ✅ Convert string ID to number safely
    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ 
        message: "Invalid user ID" 
      }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    return NextResponse.json({
      profile,
      message: profile ? "Profile fetched successfully" : "Profile not found"
    }, { status: profile ? 200 : 404 });

  } catch (error) {
    console.error("Error fetching profile:", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        message: "Failed to fetch profile",
        error: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}