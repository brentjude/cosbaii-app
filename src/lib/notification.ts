// Update: src/lib/notification.ts
import prisma from '@/lib/prisma';

// ✅ Add interface for Prisma error
interface PrismaError {
  code: string;
  meta?: Record<string, unknown>;
  message: string;
}

export async function createNotification(
  userId: number,
  type: string,
  title: string,
  message: string,
  relatedId?: number
) {
  try {
    console.log('Creating notification with data:', {
      userId,
      type,
      title,
      message,
      relatedId
    });

    // ✅ Validate inputs
    if (!userId || !type || !title || !message) {
      throw new Error('Missing required notification fields');
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId: relatedId || null,
        isRead: false,
      },
    });

    console.log('Notification created successfully:', notification);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);

    // ✅ Fixed: Use proper type instead of 'any'
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as PrismaError;
      console.error('Prisma error details:', {
        code: prismaError.code,
        meta: prismaError.meta,
        message: prismaError.message
      });
    }
    
    throw error;
  }
}

// Helper functions for specific notification types
export async function createCompetitionSubmittedNotification(
  userId: number,
  competitionName: string,
  competitionId: number
) {
  try {
    console.log('Creating competition submitted notification:', {
      userId,
      competitionName,
      competitionId
    });

    return await createNotification(
      userId,
      'COMPETITION_SUBMITTED',
      'Competition Submitted',
      `Your competition "${competitionName}" has been submitted for admin review.`,
      competitionId
    );
  } catch (error) {
    console.error('Error creating competition submitted notification:', error);
    throw new Error(`Failed to create competition submitted notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createCompetitionApprovedNotification(
  userId: number,
  competitionName: string,
  competitionId: number
) {
  try {
    return await createNotification(
      userId,
      'COMPETITION_APPROVED',
      'Competition Approved',
      `"${competitionName}" has been approved and is now ready to accept participants!`,
      competitionId
    );
  } catch (error) {
    console.error('Error creating competition approved notification:', error);
    throw new Error(`Failed to create competition approved notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createCompetitionRejectedNotification(
  userId: number,
  competitionName: string,
  competitionId: number,
  reason?: string
) {
  try {
    const message = reason 
      ? `"${competitionName}" was rejected. Reason: ${reason}`
      : `"${competitionName}" was rejected by admin review.`;

    return await createNotification(
      userId,
      'COMPETITION_REJECTED',
      'Competition Rejected',
      message,
      competitionId
    );
  } catch (error) {
    console.error('Error creating competition rejected notification:', error);
    throw new Error(`Failed to create competition rejected notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}