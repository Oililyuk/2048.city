import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json(feedbacks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await auth();
  const user = session?.user?.name || 'unregistered';
  const content = body.content?.trim();
  if (!content) {
    return NextResponse.json({ error: 'Content required' }, { status: 400 });
  }
  const feedback = await prisma.feedback.create({
    data: {
      content,
      user,
    },
  });
  return NextResponse.json(feedback);
}
