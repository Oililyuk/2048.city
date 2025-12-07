import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The History of 2048: From Viral Hit to Classic | 2048.city',
  description: 'Discover the origins and evolution of 2048. Learn how the game became a global phenomenon and inspired countless variations.'
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
export const themeColor = '#000000';

export default function HistoryOf2048Page() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>The History of 2048: From Viral Hit to Classic</h1>
      <p><b>Last updated: December 6, 2025</b></p>
      <h2>Introduction</h2>
      <p>2048 was created in March 2014 by Gabriele Cirulli, a 19-year-old developer from Italy. The game quickly went viral, inspiring millions of players and countless clones and variations.</p>
      <h2>1. The Birth of 2048</h2>
      <p>Inspired by games like Threes and 1024, Cirulli built 2048 as a weekend project. Its simple rules and addictive gameplay made it an instant hit.</p>
      <h2>2. Viral Growth</h2>
      <ul>
        <li>2048 spread rapidly on social media and tech forums.</li>
        <li>It was featured on major news sites and app stores worldwide.</li>
        <li>Open-source code allowed for endless remixes and new versions.</li>
      </ul>
      <h2>3. The Legacy</h2>
      <ul>
        <li>2048 inspired new genres of puzzle games.</li>
        <li>It remains a favorite for casual and competitive players alike.</li>
        <li>Communities like <a href="https://www.reddit.com/r/2048city/" target="_blank" rel="noopener noreferrer">r/2048city</a> keep the spirit alive.</li>
      </ul>
      <h2>FAQ</h2>
      <h3>Who created 2048?</h3>
      <p>Gabriele Cirulli, an Italian developer, in 2014.</p>
      <h3>Why is 2048 so popular?</h3>
      <p>Its simplicity, challenge, and open-source nature made it easy to play and remix.</p>
      <h3>What are some famous 2048 variants?</h3>
      <p>Threes, 1024, 2048 Hex, 2048 Tetris, and many more.</p>
      <h2>More Guides</h2>
      <ul>
        <li><a href="/blog/how-to-win-2048">How to Win 2048</a></li>
        <li><a href="/blog/advanced-strategies">Advanced 2048 Strategies</a></li>
        <li><a href="/blog">All 2048 Guides</a></li>
      </ul>
      <p style={{ marginTop: 40, color: '#888', fontSize: 14 }}>For more info, join our <a href="https://www.reddit.com/r/2048city/" target="_blank" rel="noopener noreferrer">Reddit community</a> or contact us at <a href="mailto:hello@2048.city">hello@2048.city</a>.</p>
    </main>
  );
}