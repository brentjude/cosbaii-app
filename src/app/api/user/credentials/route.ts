// Create: src/app/api/user/credentials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const credentials = await prisma.competitionParticipant.findMany({
      where: {
        userId: parseInt(session.user.id),
      },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            eventDate: true,
            location: true,
            logoUrl: true,
            competitionType: true,
            rivalryType: true,
            level: true,
          },
        },
      },
      orderBy: [
        { verified: 'desc' }, // Verified credentials first
        { createdAt: 'desc' }, // Then most recent first
      ],
    });

    return NextResponse.json({
      success: true,
      credentials,
    });

  } catch (error) {
    console.error('Error fetching user credentials:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}