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

  export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  export const themeColor = '#000000';

export default async function Home() {
  const session = await auth();

  return (
    <>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        {/* header area removed — login is handled in the main menu */}
        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0', padding: '0' }}>
          <GameBoard session={session} />
        </div>
        <div className="visually-hidden" style={{ textAlign: 'center', margin: '32px 0 0 0', color: '#4fd1c5', fontWeight: 500, fontSize: 18 }}>
          <span>2048.city — Play the classic puzzle game online, free and beautiful.</span>
        </div>
        <div className="visually-hidden" style={{ textAlign: 'center', margin: '18px 0 0 0', color: '#fff', fontSize: 15 }}>
          <span>Want more strategies and guides? Visit our <a href="/blog" style={{ color: '#4fd1c5', textDecoration: 'underline' }}>Blog</a> or <a href="/faq" style={{ color: '#4fd1c5', textDecoration: 'underline' }}>FAQ</a>.</span>
        </div>
        <CookieConsent />
      </div>
    </>
  );
}
