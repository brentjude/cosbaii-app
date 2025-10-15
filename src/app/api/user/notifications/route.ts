import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    console.log('Fetching notifications for user:', userId);

    // Build where clause
    const whereClause: {
      userId: number;
      isRead?: boolean;
    } = {
      userId,
    };

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    console.log('Found notifications:', notifications.length);

    // ✅ Enrich notifications with related data
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        let relatedData = null;

        try {
          // ✅ Fetch related data based on notification type
          switch (notification.type) {
            case 'COMPETITION_SUBMITTED':
            case 'COMPETITION_ACCEPTED':
            case 'COMPETITION_REJECTED':
              if (notification.relatedId) {
                const competition = await prisma.competition.findUnique({
                  where: { id: notification.relatedId },
                  select: {
                    id: true,
                    name: true,
                    status: true,
                    eventDate: true,
                    location: true,
                    competitionType: true,
                    rivalryType: true,
                    level: true,
                    logoUrl: true,
                    rejectionReason: true,
                  },
                });
                relatedData = competition;
              }
              break;

            case 'PARTICIPANT_SUBMITTED':
            case 'PARTICIPANT_APPROVED':
            case 'PARTICIPANT_REJECTED':
              if (notification.relatedId) {
                // For participant notifications, relatedId is the competitionId
                const competition = await prisma.competition.findUnique({
                  where: { id: notification.relatedId },
                  select: {
                    id: true,
                    name: true,
                    status: true,
                    eventDate: true,
                    location: true,
                    logoUrl: true,
                  },
                });

                // Get participant status
                const participant = await prisma.competitionParticipant.findUnique({
                  where: {
                    userId_competitionId: {
                      userId,
                      competitionId: notification.relatedId,
                    },
                  },
                  select: {
                    id: true,
                    status: true,
                    cosplayTitle: true,
                    characterName: true,
                    seriesName: true,
                    submittedAt: true,
                    reviewedAt: true,
                  },
                });

                relatedData = {
                  competition,
                  participant,
                };
              }
              break;

            case 'BADGE_EARNED':
              if (notification.relatedId) {
                const badge = await prisma.badge.findUnique({
                  where: { id: notification.relatedId },
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    iconUrl: true,
                    type: true,
                  },
                });
                relatedData = badge;
              }
              break;

            case 'AWARD_RECEIVED':
              if (notification.relatedId) {
                const award = await prisma.award.findUnique({
                  where: { id: notification.relatedId },
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    competition: {
                      select: {
                        id: true,
                        name: true,
                        eventDate: true,
                      },
                    },
                  },
                });
                relatedData = award;
              }
              break;

            default:
              // For other notification types, no additional data needed
              break;
          }
        } catch (error) {
          console.error(
            `Error fetching related data for notification ${notification.id}:`,
            error
          );
        }

        return {
          ...notification,
          relatedData,
        };
      })
    );

    // ✅ Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      notifications: enrichedNotifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { notificationIds, markAllRead } = body;

    if (markAllRead) {
      // Mark all notifications as read
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
        updatedCount: result.count,
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          id: { in: notificationIds },
        },
        data: { isRead: true },
      });

      return NextResponse.json({
        success: true,
        message: 'Notifications updated successfully',
        updatedCount: result.count,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid request: provide notificationIds or markAllRead' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

// ✅ Add DELETE endpoint to delete specific notifications
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const id = parseInt(notificationId);

    // Verify ownership before deleting
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';