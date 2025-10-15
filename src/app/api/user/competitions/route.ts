import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { triggerParticipationBadges } from '@/lib/badgeTriggers';

// ✅ Use local type definition
type CompetitionStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

interface PrismaError {
  code?: string;
  meta?: Record<string, unknown>;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const competitionData = await request.json();

    const {
      name,
      eventDate,
      competitionType,
      rivalryType,
      level,
      description,
      location,
      organizer,
      logoUrl,
      eventUrl,
      facebookUrl,
      instagramUrl,
      referenceLinks,
    } = competitionData;

    if (!name || !eventDate || !competitionType || !rivalryType || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const competition = await prisma.competition.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        eventDate: new Date(eventDate),
        location: location?.trim() || null,
        organizer: organizer?.trim() || null,
        competitionType,
        rivalryType,
        level,
        logoUrl: logoUrl?.trim() || null,
        eventUrl: eventUrl?.trim() || null,
        facebookUrl: facebookUrl?.trim() || null,
        instagramUrl: instagramUrl?.trim() || null,
        referenceLinks: referenceLinks?.trim() || null,
        submittedById: userId,
        status: 'SUBMITTED',
      },
    });

    // ✅ Trigger badge check
    try {
      await triggerParticipationBadges(userId);
    } catch (badgeError) {
      console.error('Error checking badges:', badgeError);
    }

    // ✅ Create notifications for ALL admins
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      });

      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map(admin => ({
            userId: admin.id,
            type: 'COMPETITION_SUBMITTED',
            title: 'New Competition Submitted',
            message: `${session.user.name || session.user.email} submitted a new competition: "${competition.name}"`,
            relatedId: competition.id,
            isRead: false,
          })),
        });
      }
    } catch (notificationError) {
      console.error('Failed to create admin notifications:', notificationError);
    }

    return NextResponse.json({
      success: true,
      competition,
      message: 'Competition submitted successfully',
    });

  } catch (error) {
    console.error('Error submitting competition:', error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'A competition with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to submit competition' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const userId = parseInt(session.user.id);

    const where: {
      submittedById: number;
      status?: CompetitionStatus;
    } = {
      submittedById: userId,
    };

    if (statusParam) {
      const validStatuses: CompetitionStatus[] = [
        'DRAFT',
        'SUBMITTED',
        'ACCEPTED',
        'ONGOING',
        'COMPLETED',
        'REJECTED',
        'CANCELLED',
      ];

      if (validStatuses.includes(statusParam as CompetitionStatus)) {
        where.status = statusParam as CompetitionStatus;
      }
    }

    const competitions = await prisma.competition.findMany({
      where,
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
          },
        },
        _count: {
          select: {
            participants: true,
            awards: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ competitions });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';