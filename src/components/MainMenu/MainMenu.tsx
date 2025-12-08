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
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className={styles.menu} role="navigation" aria-label="Main menu">
      <div className={styles.logoSection}>
        <Link href="/" className={styles.logo} aria-label="Home">2048.city</Link>
      </div>

      <div className={styles.controls}>
        {/* Plain text Home link (not button-like) */}
        <Link href="/" className={styles.controlLink} aria-current={pathname === '/' ? 'page' : undefined}>Home</Link>

        {/* Dropdown that opens on hover (desktop). Arrow on left of the label. */}
        <div className={styles.dropdownWrapper}>
          <div className={styles.menuLabel} tabIndex={0} aria-haspopup="true">
            <span className={styles.leftCaret}>▾</span>
            <span>Menu</span>
          </div>

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
        </div>

        {/* Login button placed to the right of Menu */}
        <Link href="/api/auth/signin" className={styles.loginButton}>Log in</Link>

        {/* Mobile hamburger (only visible on small screens) */}
        <button
          className={styles.menuIcon}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
        >
          <span className={styles.iconBar}></span>
          <span className={styles.iconBar}></span>
          <span className={styles.iconBar}></span>
        </button>
      </div>

      {/* Mobile overlay / left drawer */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <ul>
              <li><Link href="/" className={styles.menuLink}>Home</Link></li>
              {menuItems.map(item => (
                <li key={item.href}>
                  {item.external ? (
                    <a href={item.href} className={styles.menuLink} target="_blank" rel="noopener noreferrer">{item.label}</a>
                  ) : (
                    <Link href={item.href} className={styles.menuLink}>{item.label}</Link>
                  )}
                </li>
              ))}
              <li style={{ marginTop: 12 }}><Link href="/api/auth/signin" className={styles.menuLink}>Log in</Link></li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

