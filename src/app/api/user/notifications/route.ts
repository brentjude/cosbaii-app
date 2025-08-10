// Create: src/app/api/user/notifications/route.ts (if it doesn't exist)
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
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('Fetching notifications for user:', userId);

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    console.log('Found notifications:', notifications.length);

    return NextResponse.json({
      success: true,
      notifications,
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
    const { notificationIds, markAllRead } = await request.json();

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { 
          userId,
          isRead: false 
        },
        data: { isRead: true },
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      await prisma.notification.updateMany({
        where: { 
          userId,
          id: { in: notificationIds }
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications updated successfully',
    });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}