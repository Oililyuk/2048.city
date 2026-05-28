import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import GameBoard from '@/components/Game/GameBoard';
import CookieConsent from '@/components/CookieConsent/CookieConsent';

export const metadata: Metadata = {
  title: 'Daily 2048 Challenge | 2048.city',
  description: 'Play the same deterministic 2048 board as everyone else today on 2048.city.'
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
export const themeColor = '#000000';

export default async function DailyChallengePage() {
  const session = await auth();

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 0, minHeight: '100vh' }}>
      <GameBoard session={session} initialMode="daily" />
      <CookieConsent />
    </div>
  );
}
