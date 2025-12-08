"use client";
import Link from 'next/link';
import styles from './MainMenu.module.css';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LoginButton from '@/components/Auth/LoginButton';

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
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number>(0);
  const [undoCountDisplay, setUndoCountDisplay] = useState<number | null>(null);
  const pathname = usePathname();

  // read best score from localStorage and poll game undo count
  useEffect(() => {
    try {
      const b = parseInt(localStorage.getItem('bestScore') || '0', 10);
      setBestScore(Number.isFinite(b) ? b : 0);
    } catch (e) {
      setBestScore(0);
    }

    const id = setInterval(() => {
      const u = (window as any).game?.undoCount;
      if (typeof u === 'number') setUndoCountDisplay(u);
    }, 500);

    return () => clearInterval(id);
  }, []);

  function newGame() {
    if ((window as any).game?.restart) (window as any).game.restart();
    setMobileOpen(false);
  }

  function doUndo() {
    if ((window as any).game?.undo) (window as any).game.undo();
  }

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

        {/* Login component placed to the right of Menu */}
        <div className={styles.loginWrap}><LoginButton /></div>

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
            <div className={styles.mobileHeader}>
              <Link href="/" className={styles.mobileLogo}>2048.city</Link>
            </div>

            <nav className={styles.accordion} aria-label="Mobile navigation">
              {/* Home as its own simple item */}
              <div className={styles.item}>
                <Link href="/" className={styles.menuLink}>Home</Link>
              </div>

              {/* Build accordion groups: Menu and Game actions */}
              {[
                {
                  title: 'Menu',
                  items: menuItems.map(mi => ({
                    label: mi.label,
                    href: mi.href,
                    external: mi.external || false
                  }))
                },
                {
                  title: 'Game',
                  items: [
                    { label: 'New Game', action: newGame },
                    { label: `Undo ${undoCountDisplay !== null ? `(${undoCountDisplay})` : ''}`, action: doUndo },
                    { label: 'Leaderboard', href: '/#leaderboard' },
                    { label: `Best: ${bestScore}`, href: '#' }
                  ]
                }
              ].map((group, idx) => (
                <div className={styles.item} key={group.title}>
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className={styles.title}
                    aria-expanded={openIndex === idx}
                  >
                    <span className={styles.leftCaret}>▾</span>
                    {group.title}
                  </button>

                  <div
                    className={styles.content}
                    style={{ maxHeight: openIndex === idx ? `${group.items.length * 48}px` : '0px' }}
                  >
                    {group.items.map((it, i) => (
                      <div className={styles.contentItem} key={i}>
                        {it.href ? (
                          it.href.startsWith('http') ? (
                            <a href={it.href} className={styles.menuLink} target="_blank" rel="noopener noreferrer">{it.label}</a>
                          ) : (
                            <Link href={it.href} className={styles.menuLink}>{it.label}</Link>
                          )
                        ) : ('action' in it && it.action) ? (
                          <button className={styles.menuLink} onClick={() => { (it as any).action(); }}>{it.label}</button>
                        ) : (
                          <span className={styles.menuLink}>{it.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className={styles.item}>
                <div style={{ padding: '12px 16px' }}><LoginButton /></div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}

