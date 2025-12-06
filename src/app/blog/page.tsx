import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '2048 Strategy Blog | 2048.city',
  description: 'Read the latest 2048 strategies, guides, and news from the 2048.city team.'
};

const posts = [
  {
    slug: 'how-to-win-2048',
    title: 'How to Win 2048: Complete Guide',
    summary: 'Step-by-step strategies and tips to help you reach 2048 and beyond.',
    date: '2025-12-06',
  },
  // 未来可添加更多文章
];

export default function BlogPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>2048 Blog & Guides</h1>
      <p>Explore expert strategies, in-depth guides, and the latest news about 2048.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map(post => (
          <li key={post.slug} style={{ margin: '2rem 0', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <div style={{ color: '#888', fontSize: 14 }}>{post.date}</div>
            <p style={{ margin: '0.5rem 0 0 0' }}>{post.summary}</p>
            <Link href={`/blog/${post.slug}`} style={{ color: '#0070f3', fontWeight: 500 }}>Read More →</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}