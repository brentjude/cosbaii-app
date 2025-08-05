// src/app/api/admin/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent notifications
    });

    const unreadCount = await prisma.notification.count({
      where: { 
        userId,
        isRead: false 
      }
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      message: "Notifications fetched successfully"
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ 
      message: "Failed to fetch notifications" 
    }, { status: 500 });
  }
}