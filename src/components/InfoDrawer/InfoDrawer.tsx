"use client";
import { useState } from 'react';
import styles from './InfoDrawer.module.css';
import Link from 'next/link';

const sections = [
  {
    key: 'howto',
    title: 'How to Play',
    content: (
      <div>
        <h2>How to Play 2048</h2>
        <ul>
          <li>Use arrow keys or swipe to move tiles.</li>
          <li>When two tiles with the same number touch, they merge into one.</li>
          <li>The goal is to create a tile with the number 2048.</li>
        </ul>
      </div>
    ),
  },
  {
    key: 'faq',
    title: 'FAQ',
    content: (
      <div>
        <h2>Frequently Asked Questions</h2>
        <h3>Is 2048 free?</h3>
        <p>Yes! 2048.city is completely free to play.</p>
        <h3>Can I play on mobile?</h3>
        <p>Yes, fully optimized for mobile devices.</p>
        <h3>How does the leaderboard work?</h3>
        <p>Sign in with Google to submit your scores and compete globally.</p>
      </div>
    ),
  },
  {
    key: 'about',
    title: 'About',
    content: (
      <div>
        <h2>About 2048.city</h2>
        <p>2048.city is dedicated to providing the best online 2048 experience. For team info, see <Link href="/about">About Us</Link>.</p>
      </div>
    ),
  },
  {
    key: 'menu',
    title: 'Site Menu',
    content: (
      <div>
        <h2>Site Menu</h2>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/blog">Blog & Guides</Link></li>
          <li><Link href="/blog/how-to-win-2048">How to Win 2048</Link></li>
          <li><Link href="/blog/advanced-strategies">Advanced Strategies</Link></li>
          <li><Link href="/blog/ai-vs-human">AI vs Human</Link></li>
          <li><Link href="/blog/history-of-2048">History of 2048</Link></li>
          <li><Link href="/challenges/daily">Daily Challenge</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/feedback">Feedback</Link></li>
          <li><a href="https://www.reddit.com/r/2048city/" target="_blank" rel="noopener noreferrer">Reddit Community ↗</a></li>
        </ul>
      </div>
    ),
  },
];

export default function InfoDrawer() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('howto');

  return (
    <>
      <button className={styles.fab} onClick={() => setOpen(true)} aria-label="Open Info Drawer">
        ℹ️
      </button>
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}
      <aside className={open ? styles.drawerOpen : styles.drawerClosed} aria-hidden={!open}>
        <div className={styles.header}>
          <span className={styles.title}>Info & Help</span>
          <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close Info Drawer">×</button>
        </div>
        <nav className={styles.sectionNav}>
          {sections.map(sec => (
            <button
              key={sec.key}
              className={active === sec.key ? styles.activeTab : styles.tab}
              onClick={() => setActive(sec.key)}
            >
              {sec.title}
            </button>
          ))}
        </nav>
        <div className={styles.sectionContent}>
          {sections.find(sec => sec.key === active)?.content}
        </div>
      </aside>
    </>
  );
}
