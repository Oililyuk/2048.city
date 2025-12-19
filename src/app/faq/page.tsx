import type { Metadata } from 'next';
import styles from '@/styles/ContentPage.module.css';

export const metadata: Metadata = {
  title: 'FAQ | 2048.city',
  description: 'Frequently Asked Questions about 2048.city, gameplay, accounts, leaderboard, privacy, technology, and community.',
  keywords: '2048 FAQ, 2048 help, 2048.city questions, leaderboard, privacy, account, mobile, puzzle game support',
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
export const themeColor = '#000000';

const faqs = [
  {
    q: 'How do I play 2048?',
    a: 'Use arrow keys (↑↓←→) on desktop or swipe on mobile to move all tiles in that direction. When two tiles with the same number touch, they merge into one tile with their sum. The goal is to create a tile with the number 2048. You can continue playing after reaching 2048 to achieve higher tiles!'
  },
  {
    q: 'What are the basic controls?',
    a: 'Desktop: Use arrow keys to move tiles. Mobile/Tablet: Swipe in any direction. The game also supports touch gestures and keyboard shortcuts. Press U for undo (if available) and N for new game.'
  },
  {
    q: 'Is 2048.city free to play?',
    a: 'Yes! 2048.city is completely free with no ads, no paywalls, and no hidden costs. We believe puzzle games should be accessible to everyone.'
  },
  {
    q: 'Can I play on mobile devices?',
    a: 'Absolutely! The game is fully responsive and optimized for iOS, Android, tablets, and desktops. It works great in any modern web browser without requiring an app download.'
  },
  {
    q: 'Do I need an account to play?',
    a: 'No account is required to play the game. However, creating a free account (via Google sign-in) allows you to submit scores to the leaderboard, track your progress, participate in daily challenges, and compete with other players worldwide.'
  },
  {
    q: 'How do I submit my score to the leaderboard?',
    a: 'First, sign in with your Google account. After finishing a game, click the "Submit Score" button. Your highest score and best tile will be displayed on the global leaderboard. Note: You can only submit completed games (when the board is full and no moves are possible).'
  },
  {
    q: 'How does the leaderboard ranking work?',
    a: 'Scores are ranked first by the highest tile achieved, then by total score. For example, a player with a 4096 tile ranks higher than someone with a 2048 tile, regardless of the total score. Daily challenges have separate leaderboards that reset every 24 hours.'
  },
  {
    q: 'What is the highest possible tile?',
    a: 'Theoretically, there is no limit! However, most players aim for 2048 (beginner goal), 4096 (intermediate), 8192 (advanced), or even 16384 (expert). The current world record by AI is over 131072! The practical limit depends on strategy and luck.'
  },
  {
    q: 'Can I undo moves?',
    a: 'Yes! Click the "Undo" button or press U to reverse your last move. This feature helps you recover from mistakes and learn better strategies. Note: Undoing affects your final score submission eligibility in some competitive modes.'
  },
  {
    q: 'What happens after I reach 2048?',
    a: 'Congratulations! After reaching 2048, you can choose to continue playing to achieve even higher tiles like 4096, 8192, or beyond. The game never truly ends until the board is completely full with no possible moves remaining.'
  },
  {
    q: 'How do daily challenges work?',
    a: 'Daily challenges provide a unique starting board configuration each day. All players worldwide play the same challenge, allowing for fair competition. Results are posted to a separate daily leaderboard. Challenges reset at midnight UTC.'
  },
  {
    q: 'What are the best strategies to win?',
    a: 'Key strategies include: (1) Keep your highest tile in a corner, (2) Build tiles in descending order toward that corner, (3) Avoid random moves, (4) Plan 2-3 moves ahead, (5) Keep the board organized. Check our "How to Win 2048" guide for detailed strategies!'
  },
  {
    q: 'Why did I lose? How can I improve?',
    a: 'Common mistakes include moving your highest tile away from its corner, filling the board with small scattered tiles, and making moves without planning ahead. Review our Advanced Strategies guide and practice maintaining a consistent pattern. Every loss is a learning opportunity!'
  },
  {
    q: 'Does the game work offline?',
    a: 'The game requires an initial internet connection to load, but once loaded, you can play offline. However, submitting scores to the leaderboard requires an active internet connection.'
  },
  {
    q: 'How do I report a bug or give feedback?',
    a: 'Visit our Feedback page to submit bug reports, feature requests, or general comments. You can also email us directly at hello@2048.city. We actively read and respond to all feedback to improve the game experience.'
  },
  {
    q: 'Who created 2048.city?',
    a: "2048.city is developed and maintained by the 2048.city team (Yidong Zhang & Oililyuk), inspired by Gabriele Cirulli's original 2048 game from 2014. We aim to provide the best online 2048 experience with modern design and community features."
  },
  {
    q: 'Is my personal data safe and private?',
    a: 'Yes! We take privacy seriously. We only collect minimal data necessary for game functionality (scores, account info if you sign in). No personal data is shared with third parties or sold. We use secure authentication via Google OAuth. See our Privacy Policy for full details.'
  },
  {
    q: 'What technology powers 2048.city?',
    a: 'The site is built with Next.js 15 (App Router), React 18, TypeScript, Prisma ORM, PostgreSQL database, and deployed on Vercel edge network for maximum performance and reliability worldwide.'
  },
  {
    q: 'How can I join the community?',
    a: 'Join our Reddit community at r/2048city for strategy discussions, tips, and game updates. Follow us on Twitter @2048city for announcements. You can also contribute to our open-source code on GitHub!'
  },
  {
    q: 'Can I contribute to 2048.city development?',
    a: 'Absolutely! We welcome open-source contributions. Visit our GitHub repository to submit pull requests, report issues, or suggest features. Whether you\'re a developer, designer, or enthusiast, there\'s a way to contribute!'
  },
  {
    q: 'Are there any ads or in-app purchases?',
    a: 'No! 2048.city is 100% free with no advertisements, no in-app purchases, and no premium features. We believe in keeping puzzle games pure, accessible, and enjoyable for everyone.'
  },
  {
    q: 'Can I embed or share the game?',
    a: 'Yes! You can share the game URL (https://2048.city) with anyone. For embedding on your website or blog, please contact us at hello@2048.city for permission and proper attribution guidelines.'
  }
];

export default function FAQPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Frequently Asked Questions</h1>
      <p>Find answers to common questions about 2048.city, gameplay, accounts, and more.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {faqs.map((faq, idx) => (
          <li key={idx} style={{ marginBottom: '1.5rem' }}>
            <details>
              <summary style={{ fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', color: '#4fd1c5' }}>{faq.q}</summary>
              <div style={{ marginTop: 8, color: '#222', fontSize: '1rem' }}>{faq.a}</div>
            </details>
          </li>
        ))}
      </ul>
    </main>
  );
}
