"use client";
import Link from 'next/link';
import styles from './MainMenu.module.css';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Blog', href: '/blog' },
  { label: 'How to Play', href: '/how-to-play' },
  { label: 'Daily', href: '/challenges/daily' },
  { label: 'Leaderboard', href: '/#leaderboard' },
  { label: 'About', href: '/about' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Community', href: 'https://www.reddit.com/r/2048city/', external: true },
];

export default function MainMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className={styles.menu} role="navigation" aria-label="Main menu">
      <div className={styles.logoSection}>
        <Link href="/" className={styles.logo} aria-label="Home">2048.city</Link>
      </div>

      <div className={styles.controls}>
        <Link href="/" className={styles.controlButton} aria-current={pathname === '/' ? 'page' : undefined}>Home</Link>

        <div className={styles.dropdownWrapper}>
          <button
            className={styles.controlButton}
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            Menu <span className={styles.caret}>{open ? '▲' : '▼'}</span>
          </button>

          {open && (
            <ul className={styles.submenu} role="menu">
              {menuItems.map(item => (
                <li key={item.href}>
                  {item.external ? (
                    <a href={item.href} className={styles.menuLink} target="_blank" rel="noopener noreferrer" role="menuitem">{item.label}</a>
                  ) : (
                    <Link href={item.href} className={styles.menuLink} role="menuitem">{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

