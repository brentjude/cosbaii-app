// Create: src/app/api/user/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch user settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    
    let settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          showCompetitionCounter: true,
          showBadges: true,
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      settings 
    });

  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const updates = await request.json();

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: updates,
      create: {
        userId,
        showCompetitionCounter: true,
        showBadges: true,
        ...updates
      }
    });

    return NextResponse.json({ 
      success: true, 
      settings 
    });

  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}