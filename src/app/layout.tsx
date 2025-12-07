import type { Metadata } from 'next';
import { SessionProvider } from '@/components/SessionProvider';
import './globals.css';

import MainMenu from '@/components/MainMenu/MainMenu';
import { ToastProvider } from '@/components/Toast/ToastProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://2048.city'),
  title: {
    default: '2048.city - Free 2048 Game Online',
    template: '%s | 2048.city'
  },
  description: 'Play free 2048 game with iOS frosted glass effects',
  keywords: 'free 2048, 2048 game, 2048.city, iOS glass effect, puzzle game',
  authors: [{ name: '2048.city Team' }],
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
export const themeColor = '#000000';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta httpEquiv="Content-Language" content="en" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://2048.city" />
      </head>
      <body>
        <ToastProvider>
          <SessionProvider>
            <MainMenu />
            {children}
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
