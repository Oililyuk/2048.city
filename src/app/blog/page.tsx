import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/styles/ContentPage.module.css';

export const metadata: Metadata = {
  title: '2048 Strategy Blog | 2048.city',
  description: 'Read the latest 2048 strategies, guides, news, and AI insights from the 2048.city team. Learn how to win, advanced tactics, and the history of 2048.',
  keywords: '2048 strategy, 2048 guide, how to win 2048, advanced 2048, 2048 AI, 2048 history, puzzle game blog, 2048 tips',
};

export const themeColor = '#000000';

const posts = [
  {
    slug: 'how-to-win-2048',
    title: 'How to Win 2048: Complete Guide',
    summary: 'Step-by-step strategies and tips to help you reach 2048 and beyond.',
    date: '2025-12-06',
  },
  {
    slug: 'advanced-strategies',
    title: 'Advanced 2048 Strategies: Win Consistently',
    summary: 'Discover advanced tactics, tile management, and expert tips to reach 4096 and beyond.',
    date: '2025-12-06',
  },
  {
    slug: 'ai-vs-human',
    title: 'AI vs. Human: Who Plays 2048 Better?',
    summary: 'Explore the differences between AI and human strategies in 2048. See how algorithms solve the puzzle and what humans can learn from them.',
    date: '2025-12-06',
  },
  {
    slug: 'history-of-2048',
    title: 'The History of 2048: From Viral Hit to Classic',
    summary: 'Discover the origins and evolution of 2048. Learn how the game became a global phenomenon and inspired countless variations.',
    date: '2025-12-06',
  },
];

export default function BlogPage() {
  return (
    <main className={styles.contentPage}>
      <h1>2048 Blog & Guides</h1>
      <p>
        Welcome to the official <b>2048.city Blog</b>! Here you’ll find expert strategies, in-depth guides, AI insights, and the latest news about 2048. Whether you’re a beginner or a puzzle master, our articles will help you improve your skills and enjoy the game even more.
      </p>
      <section>
        <h2>Featured Articles</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map(post => (
            <li key={post.slug} style={{ margin: '2rem 0', paddingBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{post.date}</div>
              <p style={{ margin: '0.5rem 0 0 0' }}>{post.summary}</p>
              <Link href={`/blog/${post.slug}`}>Read More →</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Categories</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <li><Link href="/blog/how-to-win-2048">How to Win</Link></li>
          <li><Link href="/blog/advanced-strategies">Advanced Strategies</Link></li>
          <li><Link href="/blog/ai-vs-human">AI vs Human</Link></li>
          <li><Link href="/blog/history-of-2048">History</Link></li>
        </ul>
      </section>
      <section style={{ margin: '2rem 0' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#4fd1c5', marginBottom: 8 }}>Share & Discuss</h2>
        <p>Join our <a href="https://www.reddit.com/r/2048city/" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>Reddit</a> for strategy discussions, or follow us on <a href="https://twitter.com/2048city" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>Twitter</a> for updates.</p>
      </section>
    </main>
  );
}