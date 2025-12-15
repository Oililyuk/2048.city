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

    // Get all scores first
    const allScores = await prisma.score.findMany({
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
      orderBy: [
        { maxTile: 'desc' },  // First by highest tile
        { score: 'desc' }     // Then by score
      ],
    });

    // Get best score per user (by maxTile first, then score)
    const userBestScores = new Map();
    for (const entry of allScores) {
      const existing = userBestScores.get(entry.userId);
      if (!existing || 
          entry.maxTile > existing.maxTile || 
          (entry.maxTile === existing.maxTile && entry.score > existing.score)) {
        userBestScores.set(entry.userId, entry);
      }
    }

    // Convert to array and sort again
    const scores = Array.from(userBestScores.values())
      .sort((a, b) => {
        if (b.maxTile !== a.maxTile) return b.maxTile - a.maxTile;
        return b.score - a.score;
      })
      .slice(0, Math.min(limit, 100));

    // Add rank to each entry, highlight top 3
    const leaderboard = scores.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user.id,
      userName: entry.user.name,
      userAvatar: entry.user.avatarUrl,
      score: entry.score,
      maxTile: entry.maxTile,
      createdAt: entry.createdAt,
      isTopThree: index < 3,  // Highlight top 3 players
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
