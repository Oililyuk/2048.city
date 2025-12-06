import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'all' or 'today'
    const limit = parseInt(searchParams.get('limit') || '100');

    const where = period === 'today' 
      ? { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
      : {};

    const scores = await prisma.score.findMany({
      where,
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        } 
      },
      orderBy: { score: 'desc' },
      take: Math.min(limit, 100),
      distinct: ['userId'], // Only get best score per user
    });

    // Add rank to each entry
    const leaderboard = scores.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user.id,
      userName: entry.user.name,
      userAvatar: entry.user.avatarUrl,
      score: entry.score,
      maxTile: entry.maxTile,
      createdAt: entry.createdAt,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
