import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// ✅ Updated validation schema to match Prisma model
const credentialsSchema = z.object({
  competitionId: z.number().int().positive(),
  cosplayTitle: z.string().min(1, "Cosplay title is required").max(200),
  characterName: z.string().max(200).optional(),
  seriesName: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  photos: z.string().optional(), // JSON string of photo URLs
  videoUrl: z.string().url().max(500).optional(),
  position: z.string().max(50).optional(),
  category: z.string().max(100).optional(),
  isTeam: z.boolean().optional(),
  teamMembers: z.string().optional(), // JSON string of team members
  contactEmail: z.string().email().max(255).optional(),
  contactPhone: z.string().max(50).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();

    // ✅ Validate input
    const validationResult = credentialsSchema.safeParse({
      ...body,
      competitionId: parseInt(body.competitionId),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const {
      competitionId,
      cosplayTitle,
      characterName,
      seriesName,
      description,
      photos,
      videoUrl,
      position,
      category,
      isTeam,
      teamMembers,
      contactEmail,
      contactPhone,
    } = validationResult.data;

    // ✅ Check if competition exists and is accepting participants
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      );
    }

    if (competition.status !== 'ACCEPTED' && competition.status !== 'ONGOING') {
      return NextResponse.json(
        { error: 'Competition is not accepting participants' },
        { status: 400 }
      );
    }

    // ✅ Check if user already has credentials for this competition
    const existing = await prisma.competitionParticipant.findUnique({
      where: {
        userId_competitionId: {
          userId,
          competitionId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted credentials for this competition' },
        { status: 400 }
      );
    }

    // ✅ Create participant entry with correct field names
    const participant = await prisma.competitionParticipant.create({
      data: {
        userId,
        competitionId,
        cosplayTitle,
        characterName,
        seriesName,
        description,
        photos, // ✅ Use 'photos' instead of 'imageUrl'
        videoUrl,
        position,
        category,
        isTeam: isTeam || false,
        teamMembers,
        contactEmail,
        contactPhone,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profile: {
              select: {
                displayName: true,
                profilePicture: true,
              },
            },
          },
        },
        competition: {
          select: {
            id: true,
            name: true,
            organizer: true,
          },
        },
      },
    });

    // ✅ Create notification for competition organizer/admin
    await prisma.notification.create({
      data: {
        userId: competition.submittedById,
        type: 'PARTICIPANT_SUBMITTED',
        title: 'New Participant',
        message: `${session.user.name || session.user.email} submitted credentials for "${competition.name}"`,
        relatedId: competitionId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Credentials submitted successfully',
      participant,
    });
  } catch (error) {
    console.error('Error submitting credentials:', error);
    return NextResponse.json(
      { error: 'Failed to submit credentials' },
      { status: 500 }
    );
  }
}

// ✅ GET endpoint to fetch user's credentials for a competition
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    
    if (!competitionId) {
      return NextResponse.json(
        { error: 'Competition ID is required' },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);
    const compId = parseInt(competitionId);

    if (isNaN(compId)) {
      return NextResponse.json(
        { error: 'Invalid competition ID' },
        { status: 400 }
      );
    }

    const participant = await prisma.competitionParticipant.findUnique({
      where: {
        userId_competitionId: {
          userId,
          competitionId: compId,
        },
      },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            organizer: true,
            status: true,
            eventDate: true,
            location: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Credentials not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      participant,
    });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credentials' },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";