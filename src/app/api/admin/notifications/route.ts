import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    
    // ✅ Fetch admin-relevant notifications
    // These are notifications specifically for this admin user
    // (like when someone submits a competition they need to review)
    const notifications = await prisma.notification.findMany({
      where: { 
        userId,
        type: {
          in: [
            'COMPETITION_SUBMITTED',
            'PARTICIPANT_SUBMITTED',
            'NEW_USER_REGISTERED',
            'FEEDBACK_SUBMITTED',
          ]
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // ✅ Enrich notifications with related data
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        let relatedData = null;

        try {
          // ✅ Fetch related data based on notification type
          if (notification.type === 'COMPETITION_SUBMITTED' && notification.relatedId) {
            const competition = await prisma.competition.findUnique({
              where: { id: notification.relatedId },
              select: {
                id: true,
                name: true,
                status: true,
                eventDate: true,
                submittedBy: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            });
            relatedData = competition;
          } else if (notification.type === 'PARTICIPANT_SUBMITTED' && notification.relatedId) {
            const competition = await prisma.competition.findUnique({
              where: { id: notification.relatedId },
              select: {
                id: true,
                name: true,
                status: true,
                _count: {
                  select: {
                    participants: true,
                  },
                },
              },
            });
            relatedData = competition;
          }
        } catch (error) {
          console.error(`Error fetching related data for notification ${notification.id}:`, error);
        }

        return {
          ...notification,
          relatedData,
        };
      })
    );

    const unreadCount = await prisma.notification.count({
      where: { 
        userId,
        isRead: false,
        type: {
          in: [
            'COMPETITION_SUBMITTED',
            'PARTICIPANT_SUBMITTED',
            'NEW_USER_REGISTERED',
            'FEEDBACK_SUBMITTED',
          ]
        }
      }
    });

    return NextResponse.json({
      notifications: enrichedNotifications,
      unreadCount,
      message: "Notifications fetched successfully"
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ 
      message: "Failed to fetch notifications",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// ✅ Mark notification as read
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: {
          userId: parseInt(session.user.id),
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json({
        message: "All notifications marked as read",
        success: true,
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Mark single notification as read
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return NextResponse.json({
      message: "Notification marked as read",
      notification,
      success: true,
    });

  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ 
      message: "Failed to mark notification as read",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";