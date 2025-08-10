// Update: src/app/api/user/competitions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createCompetitionSubmittedNotification } from '@/lib/notification';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const competitionData = await request.json();

    console.log('Competition submission data:', competitionData);
    console.log('User ID:', userId);

    // Extract required fields
    const {
      name,
      eventDate,
      competitionType,
      rivalryType,
      level,
      // Optional fields
      description,
      location,
      organizer,
      logoUrl,
      eventUrl,
      facebookUrl,
      instagramUrl,
      referenceLinks,
    } = competitionData;

    // ✅ Only validate essential required fields
    if (!name || !eventDate || !competitionType || !rivalryType || !level) {
      return NextResponse.json(
        { error: 'Missing required fields: name, eventDate, competitionType, rivalryType, and level are required' },
        { status: 400 }
      );
    }

    // ✅ Validate enum values
    const validCompetitionTypes = ['GENERAL', 'ARMOR', 'CLOTH', 'SINGING'];
    const validRivalryTypes = ['SOLO', 'DUO', 'GROUP'];
    const validLevels = ['BARANGAY', 'LOCAL', 'REGIONAL', 'NATIONAL', 'WORLDWIDE'];

    if (!validCompetitionTypes.includes(competitionType)) {
      return NextResponse.json(
        { error: `Invalid competition type. Must be one of: ${validCompetitionTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validRivalryTypes.includes(rivalryType)) {
      return NextResponse.json(
        { error: `Invalid rivalry type. Must be one of: ${validRivalryTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: `Invalid level. Must be one of: ${validLevels.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('Creating competition...');

    // ✅ Create the competition with proper handling of optional fields
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

    console.log('Competition created successfully:', competition.id, competition.name);

    // ✅ Create notification - Make this more robust
    let notificationCreated = false;
    try {
      console.log('Creating notification for user:', userId, 'competition:', competition.name);
      
      const notification = await createCompetitionSubmittedNotification(
        userId,
        competition.name,
        competition.id
      );
      
      console.log('Notification created successfully:', notification);
      notificationCreated = true;
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      
      // ✅ Try manual notification creation as fallback
      try {
        console.log('Attempting manual notification creation...');
        const manualNotification = await prisma.notification.create({
          data: {
            userId,
            type: 'COMPETITION_SUBMITTED',
            title: 'Competition Submitted',
            message: `Your competition "${competition.name}" has been submitted for admin review.`,
            relatedId: competition.id,
            isRead: false,
          },
        });
        console.log('Manual notification created:', manualNotification);
        notificationCreated = true;
      } catch (manualError) {
        console.error('Manual notification creation also failed:', manualError);
      }
    }

    return NextResponse.json({
      success: true,
      competition,
      notificationCreated, // ✅ Include this in response for debugging
      message: 'Competition submitted successfully and is pending admin review',
    });

  } catch (error) {
    console.error('Error submitting competition:', error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      console.error('Prisma error code:', prismaError.code);
      console.error('Prisma error meta:', prismaError.meta);
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'A competition with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Detailed error:', errorMessage);
    
    return NextResponse.json(
      { error: 'Failed to submit competition', details: errorMessage },
      { status: 500 }
    );
  }
}