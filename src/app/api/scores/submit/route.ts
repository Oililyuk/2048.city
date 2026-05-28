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

    const { 
      score, 
      maxTile, 
      moves = 0, 
      gameDuration = 0,
      mode = 'classic',
      undoUsed = 0,
      seed,
    } = await request.json();

    if (!score || !maxTile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if ((mode !== 'classic' && mode !== 'daily') || undoUsed > 0) {
      return NextResponse.json({
        success: false,
        message: 'Only Classic or Daily runs without undo are eligible for the leaderboards.',
        leaderboardEligible: false,
      }, { status: 200 });
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
        moves: Number.isFinite(Number(moves)) ? Math.max(0, Math.floor(Number(moves))) : 0,
        gameDuration: Number.isFinite(Number(gameDuration)) ? Math.max(0, Math.floor(Number(gameDuration))) : 0,
        mode: mode || 'classic',
        seed: seed ? String(seed) : null,
        undoUsed: Number(undoUsed) || 0,
      },
    });

    // 限制每个用户只保留最近50局记录
    const MAX_HISTORY_PER_USER = 50;
    const userScores = await prisma.score.findMany({
      where: { userId: session.user.id, mode: mode || 'classic' },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    if (userScores.length > MAX_HISTORY_PER_USER) {
      const scoresToDelete = userScores.slice(MAX_HISTORY_PER_USER);
      await prisma.score.deleteMany({
        where: {
          id: { in: scoresToDelete.map((s: { id: string }) => s.id) }
        }
      });
    }

    // Check if it's a personal best for this mode
    const previousBest = await prisma.score.findFirst({
      where: { 
        userId: session.user.id,
        mode: mode || 'classic',
        id: { not: newScore.id }
      },
      orderBy: { score: 'desc' },
    });

    // Send email if it's a new personal record in classic mode
    if ((!previousBest || score > previousBest.score) && mode === 'classic') {
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
