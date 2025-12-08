"use client";
import Link from 'next/link';
import styles from './MainMenu.module.css';

const submenuItems = [
  { label: 'Blog', href: '/blog' },
  { label: 'Strategies', href: '/blog/advanced-strategies' },
  { label: 'AI vs Human', href: '/blog/ai-vs-human' },
  { label: 'History', href: '/blog/history-of-2048' },
  { label: 'Daily Challenge', href: '/challenges/daily' },
  { label: 'Leaderboard', href: '/#leaderboard' },
  { label: 'About', href: '/about' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Reddit', href: 'https://www.reddit.com/r/2048city/', external: true },
];

import { useState } from 'react';

export default function MainMenu() {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  return (
    <nav className={styles.menu}>
      <div className={styles.logoSection}>
        <Link href="/" className={styles.logo} aria-label="Home">
          Home
        </Link>
      </div>
      <button className={styles.menuIcon} aria-label="Open menu" onClick={() => setSubmenuOpen(v => !v)}>
        <span className={styles.iconBar}></span>
        <span className={styles.iconBar}></span>
        <span className={styles.iconBar}></span>
      </button>
      <div className={styles.mainButtonWrapper}>
        <button
          className={styles.mainButton}
          onClick={() => setSubmenuOpen(v => !v)}
          aria-haspopup="true"
          aria-expanded={submenuOpen}
        >
          2048
          <span className={styles.arrow}>{submenuOpen ? '▲' : '▼'}</span>
        </button>
        {submenuOpen && (
          <ul className={styles.submenu}>
            {submenuItems.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={styles.menuLink}
                >
                  {item.label}
                  {item.external && <span className={styles.externalIcon}>↗</span>}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
