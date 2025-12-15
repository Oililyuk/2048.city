import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendRecordEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { score, maxTile, moves = 0, gameDuration = 0 } = await request.json();

    if (!score || !maxTile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 设定提交阈值：至少达到512 tile 或 2000分
    const MIN_TILE = 512;
    const MIN_SCORE = 2000;
    
    if (maxTile < MIN_TILE && score < MIN_SCORE) {
      return NextResponse.json({ 
        success: false, 
        message: `Score not submitted. Reach ${MIN_TILE} tile or ${MIN_SCORE} points to qualify for leaderboard.`,
        threshold: { minTile: MIN_TILE, minScore: MIN_SCORE },
        belowThreshold: true
      }, { status: 200 });
    }

    // Save score to database
    const newScore = await prisma.score.create({
      data: {
        userId: session.user.id,
        score,
        maxTile,
        moves,
        gameDuration,
      },
    });

    // 限制每个用户只保留最近50局记录
    const MAX_HISTORY_PER_USER = 50;
    const userScores = await prisma.score.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    if (userScores.length > MAX_HISTORY_PER_USER) {
      const scoresToDelete = userScores.slice(MAX_HISTORY_PER_USER);
      await prisma.score.deleteMany({
        where: {
          id: { in: scoresToDelete.map(s => s.id) }
        }
      });
    }

    // Check if it's a personal best
    const previousBest = await prisma.score.findFirst({
      where: { 
        userId: session.user.id,
        id: { not: newScore.id }
      },
      orderBy: { score: 'desc' },
    });

    // Send email if it's a new personal record
    if (!previousBest || score > previousBest.score) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      });
      
      if (user?.email) {
        await sendRecordEmail(user.email, user.name, score).catch(err => {
          console.error('Failed to send email:', err);
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      scoreId: newScore.id,
      isPersonalBest: !previousBest || score > previousBest.score,
      message: !previousBest || score > previousBest.score 
        ? '🎉 New personal best! Score submitted to leaderboard.' 
        : '✅ Score submitted to leaderboard.',
      score,
      maxTile,
      belowThreshold: false
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
