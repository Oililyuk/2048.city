import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userScores = await prisma.score.findMany({
      where: { userId: session.user.id },
      orderBy: { score: 'desc' },
      take: 10,
    });

    const bestScore = userScores[0];
    const totalGames = await prisma.score.count({
      where: { userId: session.user.id }
    });

    // Get user's rank
    let rank = 0;
    if (bestScore) {
      // Count users with better scores by finding distinct user IDs
      const betterScores = await prisma.score.findMany({
        where: {
          score: { gt: bestScore.score }
        },
        distinct: ['userId'],
        select: { userId: true }
      });
      rank = betterScores.length + 1;
    }

    return NextResponse.json({
      bestScore: bestScore?.score || 0,
      maxTile: bestScore?.maxTile || 0,
      totalGames,
      rank,
      recentScores: userScores,
    });
  } catch (error) {
    console.error('Error fetching user scores:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
