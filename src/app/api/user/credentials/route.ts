// Create: src/app/api/user/credentials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const {
      competitionId,
      position,
      cosplayTitle,
      description,
      imageUrl,
      category,
    } = await request.json();

    // Validate required fields
    if (!competitionId || !position || !cosplayTitle) {
      return NextResponse.json(
        { error: 'Competition, position, and cosplay title are required' },
        { status: 400 }
      );
    }

    // Check if user already has credentials for this competition
    const existing = await prisma.competitionParticipant.findUnique({
      where: {
        userId_competitionId: {
          userId,
          competitionId: parseInt(competitionId),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You already have credentials for this competition' },
        { status: 409 }
      );
    }

    // Create new competition participant record
    const participant = await prisma.competitionParticipant.create({
      data: {
        userId,
        competitionId: parseInt(competitionId),
        position,
        cosplayTitle,
        description: description || null,
        imageUrl: imageUrl || null,
        category: category || null,
        verified: false, // Will be verified by admin
      },
      include: {
        competition: true,
      },
    });

    return NextResponse.json({
      success: true,
      participant,
      message: 'Credential added successfully and pending verification',
    });

  } catch (error) {
    console.error('Error adding credential:', error);
    return NextResponse.json(
      { error: 'Failed to add credential' },
      { status: 500 }
    );
  }
}

export async function GET() { // ✅ Removed unused 'request' parameter
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const credentials = await prisma.competitionParticipant.findMany({
      where: { userId },
      include: {
        competition: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      credentials,
    });

  } catch (error) {
    console.error('Error fetching credentials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credentials' },
      { status: 500 }
    );
  }
}