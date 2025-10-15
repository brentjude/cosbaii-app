import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get or create settings
    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          showCompetitionCounter: true,
          showBadges: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
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

    const { showCompetitionCounter, showBadges } = body;

    // Update or create settings
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        showCompetitionCounter:
          showCompetitionCounter !== undefined
            ? showCompetitionCounter
            : undefined,
        showBadges: showBadges !== undefined ? showBadges : undefined,
      },
      create: {
        userId,
        showCompetitionCounter: showCompetitionCounter ?? true,
        showBadges: showBadges ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';