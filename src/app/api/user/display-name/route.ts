// Create: src/app/api/user/display-name/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { displayName } = await request.json();
    const userId = parseInt(session.user.id);

    // Validate input
    if (!displayName || !displayName.trim()) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 }
      );
    }

    if (displayName.length < 2 || displayName.length > 50) {
      return NextResponse.json(
        { error: "Display name must be between 2 and 50 characters" },
        { status: 400 }
      );
    }

    // Check if user can change display name (7-day cooldown)
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    if (userSettings?.lastDisplayNameChange) {
      const lastChange = new Date(userSettings.lastDisplayNameChange);
      const now = new Date();
      const daysSinceLastChange = Math.floor(
        (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastChange < 7) {
        return NextResponse.json(
          { error: `You can change your display name again in ${7 - daysSinceLastChange} day(s)` },
          { status: 400 }
        );
      }
    }

    // Update profile display name
    await prisma.profile.update({
      where: { userId },
      data: {
        displayName: displayName.trim(),
      }
    });

    // Update settings to track last change
    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        lastDisplayNameChange: new Date(),
      },
      create: {
        userId,
        showCompetitionCounter: true,
        showBadges: true,
        lastDisplayNameChange: new Date(),
      }
    });

    return NextResponse.json({ 
      success: true,
      message: "Display name updated successfully!"
    });

  } catch (error) {
    console.error("Error changing display name:", error);
    return NextResponse.json(
      { error: "Failed to change display name" },
      { status: 500 }
    );
  }
}