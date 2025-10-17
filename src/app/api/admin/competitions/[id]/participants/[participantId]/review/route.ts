import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { triggerMilestoneBadges } from '@/lib/badgeTriggers';

const reviewSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
});

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const competitionId = parseInt(params.id);
    const participantId = parseInt(params.participantId);

    if (isNaN(competitionId) || isNaN(participantId)) {
      return NextResponse.json(
        { error: 'Invalid IDs' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { action } = validationResult.data;

    // Get participant
    const participant = await prisma.competitionParticipant.findUnique({
      where: { id: participantId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        competition: {
          select: {
            id: true,
            name: true,
            eventDate: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    if (participant.competitionId !== competitionId) {
      return NextResponse.json(
        { error: 'Participant does not belong to this competition' },
        { status: 400 }
      );
    }

    if (participant.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Participant has already been reviewed' },
        { status: 400 }
      );
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    // Update participant status
    const updatedParticipant = await prisma.competitionParticipant.update({
      where: { id: participantId },
      data: {
        status: newStatus,
        reviewedAt: new Date(),
      },
    });

     // ✅ Trigger badge check
    try {
      await triggerMilestoneBadges(participantId);
      
    } catch (badgeError) {
      console.error('Error checking badges:', badgeError);
    }

    // ✅ Create notification for the participant
    const notificationType = action === 'APPROVE' 
      ? 'PARTICIPANT_APPROVED' 
      : 'PARTICIPANT_REJECTED';

    const notificationTitle = action === 'APPROVE'
      ? 'Participation Approved'
      : 'Participation Rejected';

    const notificationMessage = action === 'APPROVE'
      ? `Your participation in "${participant.competition.name}" has been approved! You are now officially registered for this competition.`
      : `Your participation in "${participant.competition.name}" was not approved. Please contact the organizers for more information.`;

    await prisma.notification.create({
      data: {
        userId: participant.user.id,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        relatedId: competitionId, // Link to competition
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Participant ${action.toLowerCase()}d successfully`,
      participant: updatedParticipant,
    });
  } catch (error) {
    console.error('Error reviewing participant:', error);
    return NextResponse.json(
      { error: 'Failed to review participant' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';