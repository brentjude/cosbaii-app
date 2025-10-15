import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const reorderSchema = z.object({
  credentials: z.array(
    z.object({
      id: z.number().int().positive(),
      order: z.number().int().min(0),
    })
  ),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();

    const validationResult = reorderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { credentials: credentialOrders } = validationResult.data;

    // Verify all credentials belong to the user
    const credentialIds = credentialOrders.map((c) => c.id);
    const userCredentials = await prisma.competitionParticipant.findMany({
      where: {
        id: { in: credentialIds },
        userId,
      },
      select: { id: true },
    });

    if (userCredentials.length !== credentialIds.length) {
      return NextResponse.json(
        { error: 'One or more credentials do not belong to you' },
        { status: 403 }
      );
    }

    // ✅ Update order using the 'order' field in a transaction
    await prisma.$transaction(
      credentialOrders.map((credential) =>
        prisma.competitionParticipant.update({
          where: { id: credential.id },
          data: {
            order: credential.order, // ✅ Use the order field directly
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: 'Credential order updated successfully',
    });
  } catch (error) {
    console.error('Error reordering credentials:', error);
    return NextResponse.json(
      { error: 'Failed to reorder credentials' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';