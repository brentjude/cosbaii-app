// Update: src/app/api/user/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // ✅ Get pagination params with defaults
    const take = parseInt(searchParams.get("take") || "5");
    const skip = parseInt(searchParams.get("skip") || "0");

    // ✅ Validate pagination params
    const validTake = Math.min(Math.max(take, 1), 50); // Max 50 per request
    const validSkip = Math.max(skip, 0);

    const userId = parseInt(session.user.id);

    // ✅ Fetch notifications with pagination
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: validTake,
      skip: validSkip,
    });

    return NextResponse.json(
      { 
        notifications,
        pagination: {
          take: validTake,
          skip: validSkip,
          count: notifications.length,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}