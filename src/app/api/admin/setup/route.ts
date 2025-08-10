// Create: src/app/api/admin/setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { initializeBadges } from '@/lib/badges';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can initialize badges
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Initializing badges...');
    await initializeBadges();

    return NextResponse.json({
      success: true,
      message: 'Badges initialized successfully'
    });

  } catch (error) {
    console.error('Error initializing badges:', error);
    return NextResponse.json(
      { error: 'Failed to initialize badges', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}