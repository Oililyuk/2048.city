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
      isPersonalBest: !previousBest || score > previousBest.score
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
