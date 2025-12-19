import type { Metadata } from 'next';
import styles from '@/styles/ContentPage.module.css';

export const metadata: Metadata = {
  title: 'About Us | 2048.city',
  description: 'Learn about the 2048.city team, our mission, technology stack, and how to join our community. Discover our vision for the future of online puzzle games.',
  keywords: 'about 2048, 2048.city team, puzzle game creators, online game community, technology stack, join us',
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
export const themeColor = '#000000';

export default function AboutPage() {
  return (
    <main className={styles.contentPage}>
      <h1>About 2048.city</h1>
      <p>Welcome to <b>2048.city</b>! We are passionate about creating the best online 2048 experience, blending beautiful design, fair competition, and a friendly global community.</p>
      <h2>Our Mission & Vision</h2>
      <p>We believe puzzle games should be accessible, fun, and inspiring. Our mission is to make 2048 more than just a game—it's a place to learn, compete, and connect. We envision a future where players share strategies, challenge each other, and grow together.</p>
      <h2>Meet the Team</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li><b>Yidong Zhang</b> — Lead Developer & Designer</li>
        <li><b>Oililyuk</b> — Community & Operations</li>
        <li>Inspired by <b>Gabriele Cirulli</b>, creator of the original 2048</li>
      </ul>
      <p>Want to join us? <a href="mailto:hello@2048.city">Contact us</a> or contribute on <a href="https://github.com/Oililyuk/2048.city" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
      <h2>Technology Stack</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li>Next.js 16 (App Router, SSR/SSG)</li>
        <li>TypeScript, React 18</li>
        <li>Prisma, Vercel, CSS Modules</li>
        <li>Modern glassmorphism UI</li>
      </ul>
      <h2>Community</h2>
      <p>Join our <a href="https://www.reddit.com/r/2048city/" target="_blank" rel="noopener noreferrer">Reddit</a> or follow us on <a href="https://twitter.com/2048city" target="_blank" rel="noopener noreferrer">Twitter</a> for updates, tips, and events.</p>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:hello@2048.city">hello@2048.city</a></p>
      <p>Or use our <a href="/contact">contact form</a>.</p>
    </main>
  );
}