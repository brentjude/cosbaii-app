import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId: number = Number(session.user.id);
    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const notifId = typeof notificationId === 'string' 
      ? parseInt(notificationId) 
      : notificationId;

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

    // ✅ Changed from 'read' to 'isRead'
    const updatedNotification = await prisma.notification.update({
      where: { id: notifId },
      data: { isRead: true },
    });

    return NextResponse.json(
      { 
        message: "Notification marked as read",
        notification: updatedNotification 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { message: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}