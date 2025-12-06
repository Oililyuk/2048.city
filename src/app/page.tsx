import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import GameBoard from '@/components/Game/GameBoard';
import LoginButton from '@/components/Auth/LoginButton';
import CookieConsent from '@/components/CookieConsent/CookieConsent';
import Leaderboard from '@/components/Leaderboard/Leaderboard';

export const metadata: Metadata = {
  title: 'Free 2048 Game Online | 2048.city - Play Now',
  description: 'Play free 2048 game at 2048.city with stunning iOS glass effects. The best free 2048 puzzle game online. No download required, play instantly!',
  keywords: 'free 2048, 2048.city, free 2048 game, 2048 online free, play 2048 free, free puzzle game, 2048 game online, best free 2048',
  authors: [{ name: '2048.city Team' }],
  openGraph: {
    type: 'website',
    url: 'https://2048.city',
    title: 'Free 2048 Game Online | 2048.city',
    description: 'Play free 2048 game at 2048.city - The best free 2048 puzzle game online with iOS glass effects',
    siteName: '2048.city',
    images: [{
      url: 'https://2048.city/og-image.png',
      width: 1200,
      height: 630,
      alt: '2048.city - Free 2048 Game'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2048.city - Free 2048 Game Online',
    description: 'Play free 2048 game with iOS glass effects',
    images: ['https://2048.city/og-image.png'],
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
