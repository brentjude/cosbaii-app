import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { triggerParticipationBadges } from '@/lib/badgeTriggers';

// ✅ Updated validation schema to include imageUrl
const credentialsSchema = z.object({
  competitionId: z.number().int().positive(),
  cosplayTitle: z.string().min(1, "Cosplay title is required").max(200),
  characterName: z.string().max(200).optional(),
  seriesName: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().url().optional(), // ✅ Add imageUrl field
  videoUrl: z.string().url().max(500).optional(),
  position: z.string().max(50).optional(),
  category: z.string().max(100).optional(),
  isTeam: z.boolean().optional(),
  teamMembers: z.string().optional(),
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
      imageUrl, // ✅ Get imageUrl from validated data
      videoUrl,
      position,
      category,
      isTeam,
      teamMembers,
      contactEmail,
      contactPhone,
    } = validationResult.data;

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

    // ✅ Create photos array - store as JSON string
    const photosArray = imageUrl ? [imageUrl] : [];
    const photosJson = photosArray.length > 0 ? JSON.stringify(photosArray) : null;

    const participant = await prisma.competitionParticipant.create({
      data: {
        userId,
        competitionId,
        cosplayTitle,
        characterName,
        seriesName,
        description,
        photos: photosJson, // ✅ Store as JSON string
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
            eventDate: true,
            location: true,
            competitionType: true,
            rivalryType: true,
            level: true,
            logoUrl: true,
          },
        },
      },
    });

    // Trigger badge check
    try {
      await triggerParticipationBadges(userId);
      
    } catch (badgeError) {
      console.error('Error checking badges:', badgeError);
    }
        

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

// ✅ Updated GET endpoint - Parse photos JSON
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    const userId = parseInt(session.user.id);

    if (competitionId) {
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
              competitionType: true,
              rivalryType: true,
              level: true,
              logoUrl: true,
            },
          },
          awards: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
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

      // ✅ Parse photos JSON
      let imageUrl = null;
      if (participant.photos) {
        try {
          const photosArray = JSON.parse(participant.photos);
          imageUrl = Array.isArray(photosArray) && photosArray.length > 0 ? photosArray[0] : null;
        } catch (error) {
          console.error('Error parsing photos JSON:', error);
        }
      }

      const credential = {
        id: participant.id,
        cosplayTitle: participant.cosplayTitle,
        characterName: participant.characterName,
        seriesName: participant.seriesName,
        description: participant.description,
        position: participant.position || 'PARTICIPANT',
        category: participant.category,
        verified: participant.status === 'APPROVED',
        status: participant.status, // ✅ Include status field
        imageUrl,
        competition: participant.competition,
        awards: participant.awards,
        submittedAt: participant.submittedAt,
        reviewedAt: participant.reviewedAt,
        order: participant.order, // ✅ Include order field
      };

      return NextResponse.json({
        success: true,
        credential,
      });
    }

    // ✅ Fetch all user credentials
    const participants = await prisma.competitionParticipant.findMany({
      where: {
        userId,
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
            competitionType: true,
            rivalryType: true,
            level: true,
            logoUrl: true,
          },
        },
        awards: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
          },
        },
      },
      orderBy: [
        { order: 'asc' },
        { submittedAt: 'desc' },
      ],
    });

    const credentials = participants.map(participant => {
      // ✅ Parse photos JSON for each participant
      let imageUrl = null;
      if (participant.photos) {
        try {
          const photosArray = JSON.parse(participant.photos);
          imageUrl = Array.isArray(photosArray) && photosArray.length > 0 ? photosArray[0] : null;
        } catch (error) {
          console.error('Error parsing photos JSON for participant:', participant.id, error);
        }
      }

      return {
        id: participant.id,
        cosplayTitle: participant.cosplayTitle,
        characterName: participant.characterName,
        seriesName: participant.seriesName,
        description: participant.description,
        position: participant.position || 'PARTICIPANT',
        category: participant.category,
        verified: participant.status === 'APPROVED',
        status: participant.status, // ✅ Include status field
        imageUrl,
        competition: participant.competition,
        awards: participant.awards || [],
        submittedAt: participant.submittedAt,
        reviewedAt: participant.reviewedAt,
        order: participant.order, // ✅ Include order field
      };
    });

    return NextResponse.json({
      success: true,
      credentials,
      count: credentials.length,
    });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credentials' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const credentialId = parseInt(params.id);
    const userId = parseInt(session.user.id);

    if (isNaN(credentialId)) {
      return NextResponse.json(
        { error: 'Invalid credential ID' },
        { status: 400 }
      );
    }

    // Check if credential exists and belongs to user
    const credential = await prisma.competitionParticipant.findUnique({
      where: { id: credentialId },
      select: {
        userId: true,
        status: true,
        competitionId: true,
        photos: true, // ✅ Get photos to clean up from Cloudinary
      },
    });

    if (!credential) {
      return NextResponse.json(
        { error: 'Credential not found' },
        { status: 404 }
      );
    }

    if (credential.userId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this credential' },
        { status: 403 }
      );
    }

    // ✅ Optional: Delete photos from Cloudinary before deleting credential
    if (credential.photos) {
      try {
        const photosArray = JSON.parse(credential.photos);
        if (Array.isArray(photosArray) && photosArray.length > 0) {
          // Import cloudinary utilities
          const { deleteFromCloudinary, extractPublicIdFromUrl } = await import('@/lib/cloudinary');
          
          for (const photoUrl of photosArray) {
            const publicId = extractPublicIdFromUrl(photoUrl);
            if (publicId) {
              await deleteFromCloudinary(publicId);
              console.log('Deleted photo from Cloudinary:', publicId);
            }
          }
        }
      } catch (error) {
        console.error('Error deleting photos from Cloudinary:', error);
        // Continue with deletion even if Cloudinary cleanup fails
      }
    }

    // Delete the credential
    await prisma.competitionParticipant.delete({
      where: { id: credentialId },
    });

    // ✅ Create notification for user
    await prisma.notification.create({
      data: {
        userId,
        type: 'CREDENTIAL_DELETED',
        title: 'Credential Deleted',
        message: `You have deleted a competition credential.`,
        relatedId: credential.competitionId,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Credential deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting credential:', error);
    return NextResponse.json(
      { error: 'Failed to delete credential' },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";