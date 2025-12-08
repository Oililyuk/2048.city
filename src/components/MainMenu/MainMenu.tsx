"use client";
import Link from 'next/link';
import styles from './MainMenu.module.css';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Play', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'How to Play', href: '/how-to-play' },
  { label: 'Daily', href: '/challenges/daily' },
  { label: 'Leaderboard', href: '/#leaderboard' },
  { label: 'About', href: '/about' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Community', href: 'https://www.reddit.com/r/2048city/', external: true },
];

export default function MainMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const pathname = usePathname();

  function Icon({ name }: { name: string }) {
    switch (name) {
      case 'Play':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
          </svg>
        );
      case 'Blog':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M8 10h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        );
      case 'How to Play':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M5 7h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );
      case 'Daily':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
            <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        );
      case 'Leaderboard':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 20v-8h4v8H4zM10 20V8h4v12h-4zM16 20v-4h4v4h-4z" fill="currentColor" />
          </svg>
        );
      case 'About':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="8" r="2" fill="currentColor" />
            <path d="M11 11h2v6h-2z" fill="currentColor" />
          </svg>
        );
      case 'Feedback':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        );
      case 'Community':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        );
      default:
        return null;
    }
  }

  return (
    <nav className={styles.menu} role="navigation" aria-label="Main menu">
      <div className={styles.logoSection}>
        <Link href="/" className={styles.logo} aria-label="Home">
          2048.city
        </Link>
      </div>

      {/* Desktop / wide screen links */}
      <ul className={styles.menuList} data-open={mobileOpen ? 'true' : 'false'}>
        {menuItems.map(item => {
          const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href.replace('/#', '/'));
          const linkClass = `${styles.menuLink} ${isActive ? styles.active : ''}`;
          return (
            <li key={item.href}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass} aria-current={isActive ? 'page' : undefined}>
                  <span className={styles.icon}><Icon name={item.label} /></span>
                  <span className={styles.label}>{item.label}</span>
                </a>
              ) : (
                <Link href={item.href} className={linkClass} aria-current={isActive ? 'page' : undefined}>
                  <span className={styles.icon}><Icon name={item.label} /></span>
                  <span className={styles.label}>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* Mobile icon */}
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

      {/* Compact main button + submenu for extras */}
      <div className={styles.mainButtonWrapper}>
        <button
          "use client";
          import Link from 'next/link';
          import styles from './MainMenu.module.css';

          import { useState } from 'react';

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

            return (
              <nav className={styles.menu} role="navigation" aria-label="Main menu">
                <div className={styles.logoSection}>
                  <Link href="/" className={styles.logo} aria-label="Home">2048.city</Link>
                </div>

                <div className={styles.controls}>
                  <Link href="/" className={styles.controlButton} aria-label="Home">Home</Link>

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
