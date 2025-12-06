import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Challenge | 2048.city',
  description: 'Try the 2048 daily challenge! Compete with players worldwide and see if you can reach the top of the leaderboard.'
};

export default function DailyChallengePage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>2048 Daily Challenge</h1>
      <p>Every day, a new 2048 puzzle awaits! Compete with players around the world and see who can get the highest score today.</p>
      <p>Coming soon: unique daily boards, special rules, and exclusive rewards for top players.</p>
      <p>Check back tomorrow for a new challenge, or <a href="/blog">read our latest strategy guides</a> to improve your skills!</p>
    </main>
  );
}