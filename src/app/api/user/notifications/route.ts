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
    
    const take = parseInt(searchParams.get("take") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const validTake = Math.min(Math.max(take, 1), 50);
    const validSkip = Math.max(skip, 0);

    const userId: number = Number(session.user.id);

    // ✅ Build where clause without explicit Prisma types
    const whereClause = { 
      userId,
      ...(unreadOnly && { isRead: false })
    };

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: validTake,
        skip: validSkip,
      }),
      prisma.notification.count({
        where: whereClause,
      }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return NextResponse.json(
      { 
        notifications,
        pagination: {
          take: validTake,
          skip: validSkip,
          count: notifications.length,
          totalCount,
          hasMore: validSkip + validTake < totalCount,
        },
        unreadCount,
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const userId: number = Number(session.user.id);
    const notifId = parseInt(notificationId);

    if (isNaN(notifId)) {
      return NextResponse.json(
        { message: "Invalid notification ID" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notifId },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.userId !== userId) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.notification.delete({
      where: { id: notifId },
    });

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { message: "Failed to delete notification" },
      { status: 500 }
    );
  }
}