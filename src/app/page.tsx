import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import GameBoard from '@/components/Game/GameBoard';
import LoginButton from '@/components/Auth/LoginButton';
import CookieConsent from '@/components/CookieConsent/CookieConsent';
import Leaderboard from '@/components/Leaderboard/Leaderboard';

export const metadata: Metadata = {
  title: '2048 • Play Free Online | 2048.city',
  description: 'Join the numbers and reach 2048! Play the addictive puzzle game with beautiful glass design. Free online, no download needed. Can you master the challenge and reach 2048?',
  keywords: '2048, game, puzzle, free, online, numbers, tiles, strategy, brain teaser, addictive, play 2048, 2048 online, puzzle game, math game',
  authors: [{ name: '2048.city Team' }],
  creator: '2048.city',
  alternates: {
    canonical: 'https://2048.city',
  },
  openGraph: {
    type: 'website',
    url: 'https://2048.city',
    title: '2048 • Play Free Online',
    description: 'Join the numbers and reach 2048! Play the addictive puzzle game free online. Compete on the leaderboard!',
    siteName: '2048.city',
    locale: 'en_US',
    images: [{
      url: 'https://2048.city/og-image.png',
      width: 1200,
      height: 630,
      alt: '2048.city - Free 2048 Game'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2048 • Play Free Online',
    description: 'Join the numbers and reach 2048! Play the addictive puzzle game free online.',
    images: ['https://2048.city/og-image.png'],
  },
  other: {
    'pinterest-rich-pin': 'true',
  },
};

export default async function Home() {
  const session = await auth();

  return (
    <>
      {/* 排行榜按钮 - 左上角 */}
      <Leaderboard />
      
      {/* 登录按钮 - 右下角 */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <LoginButton />
      </div>
      
      <GameBoard session={session} />
      
      <CookieConsent />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: '2048.city - Free 2048 Game',
            description: 'Play free 2048 game online at 2048.city. The best free 2048 puzzle game with beautiful iOS glass effects. No download, play instantly!',
            url: 'https://2048.city',
            applicationCategory: 'Game',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            }
          })
        }}
      />
    </>
  );
}
