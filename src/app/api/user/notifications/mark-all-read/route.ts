import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;

    // ✅ Check if userId is valid
    if (!userId || isNaN(Number(userId))) {
      console.error("Invalid user ID:", userId);
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const userIdNumber = Number(userId);

    console.log("Marking all notifications as read for user:", userIdNumber);

    // ✅ First, check if there are any unread notifications
    const unreadCount = await prisma.notification.count({
      where: {
        userId: userIdNumber,
        isRead: false,
      },
    });

    console.log("Unread notifications count:", unreadCount);

    if (unreadCount === 0) {
      return NextResponse.json(
        { 
          message: "No unread notifications",
          count: 0
        },
        { status: 200 }
      );
    }

    // ✅ Update all unread notifications
    const result = await prisma.notification.updateMany({
      where: { 
        userId: userIdNumber,
        isRead: false 
      },
      data: { isRead: true },
    });

    console.log("Updated notifications count:", result.count);

    return NextResponse.json(
      { 
        message: "All notifications marked as read",
        count: result.count
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    
    // ✅ Return detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json(
      { 
        message: "Failed to mark all notifications as read",
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}