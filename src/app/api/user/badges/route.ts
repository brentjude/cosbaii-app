// Create: src/app/api/user/badges/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserBadges, getBadgeProgress } from '@/lib/badges';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const includeProgress = searchParams.get('progress') === 'true';

    console.log('Fetching badges for user:', userId, 'includeProgress:', includeProgress);

    if (includeProgress) {
      const progress = await getBadgeProgress(userId);
      console.log('Badge progress fetched:', progress.length, 'items');
      
      return NextResponse.json({
        success: true,
        progress,
      });
    } else {
      const badges = await getUserBadges(userId);
      console.log('User badges fetched:', badges.length, 'badges');
      
      return NextResponse.json({
        success: true,
        badges,
      });
    }

  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}