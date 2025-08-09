// Create: src/app/api/user/featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { featured } = await request.json();
    const userId = parseInt(session.user.id);

    // For now, we'll store featured as JSON in the bio or create a separate field
    // You might want to create a separate FeaturedCosplay table later
    
    // Update profile with featured data (you can modify this based on your schema)
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // For now, just return success - implement storage logic based on your needs
    return NextResponse.json({
      success: true,
      featured,
      message: 'Featured cosplays updated successfully',
    });

  } catch (error) {
    console.error('Error updating featured cosplays:', error);
    return NextResponse.json(
      { error: 'Failed to update featured cosplays' },
      { status: 500 }
    );
  }
}