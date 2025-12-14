"use client";
import Link from 'next/link';
import styles from './MainMenu.module.css';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import LoginButton from '@/components/Auth/LoginButton';

const menuItems = [
  { label: 'Blog', href: '/blog' },
  { label: 'How to Play', href: '/how-to-play' },
  { label: 'Daily Challenge', href: '/challenges/daily' },
  { label: 'Leaderboard', href: '/#leaderboard' },
  { label: 'About', href: '/about' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Community', href: 'https://www.reddit.com/r/2048city/', external: true },
];

export default function MainMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // refs for accordion content elements to measure their scrollHeight
  const groupRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

  // when openIndex changes, set the maxHeight on the actual DOM nodes for smooth transition
  useLayoutEffect(() => {
    groupRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (openIndex === idx) {
        el.style.maxHeight = el.scrollHeight + 'px';
        el.style.opacity = '1';
      } else {
        el.style.maxHeight = '0px';
        el.style.opacity = '0';
      }
    });
  }, [openIndex]);

  // lock background scroll when mobile drawer open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return;
  }, [mobileOpen]);

  // focus trap and Escape-to-close while mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;

    prevActiveRef.current = document.activeElement as HTMLElement | null;

    // focus first focusable element inside the mobile menu
    const focusFirst = () => {
      const el = mobileMenuRef.current;
      if (!el) return;
      const selector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(selector)).filter(n => !n.hasAttribute('disabled'));
      if (nodes.length) nodes[0].focus();
      else el.focus();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        const el = mobileMenuRef.current;
        if (!el) return;
        const selector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
        const nodes = Array.from(el.querySelectorAll<HTMLElement>(selector)).filter(n => !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length));
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || active === el) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    const timeout = setTimeout(focusFirst, 50);
    document.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('keydown', handleKey);
      // restore previous focus
      try { prevActiveRef.current?.focus(); } catch (e) {}
      setOpenIndex(null);
    };
  }, [mobileOpen]);

  function newGame() {
    if ((window as any).game?.restart) (window as any).game.restart();
    setMobileOpen(false);
  }

  function doUndo() {
    if ((window as any).game?.undo) (window as any).game.undo();
  }

  const undoLabel = undoCountDisplay !== null ? `Undo (${undoCountDisplay})` : 'Undo';

  const mobileGroups = [
    {
      title: 'Menu',
      items: menuItems.map(mi => ({ label: mi.label, href: mi.href, external: mi.external || false }))
    },
    {
      title: 'Game',
      items: [
        { label: 'New Game', action: newGame },
        { label: undoLabel, action: doUndo },
        { label: `Best: ${bestScore}`, href: '#' }
      ]
    }
  ];

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
          <div className={styles.mobileMenu} ref={mobileMenuRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileHeader}>
              <Link href="/" className={styles.mobileLogo}>2048.city</Link>
              <button aria-label="Close menu" className={styles.closeButton} onClick={() => setMobileOpen(false)}>✕</button>
            </div>

            <nav className={styles.accordion} aria-label="Mobile navigation">
              {/* Home as its own simple item */}
              <div className={styles.item}>
                <Link href="/" className={styles.menuLink}>Home</Link>
              </div>

              {/* Build accordion groups: Menu and Game actions */}
              {mobileGroups.map((group, idx) => (
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
                    ref={(el) => { groupRefs.current[idx] = el; }}
                    style={{ maxHeight: '0px', opacity: 0 }}
                  >
                    {group.items.map((it, i) => (
                      <div className={styles.contentItem} key={i}>
                        {it.href ? (
                          it.href.startsWith('http') ? (
                            <a href={it.href} className={styles.menuLink} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>{it.label}</a>
                          ) : (
                            <Link href={it.href} className={styles.menuLink} onClick={() => setMobileOpen(false)}>{it.label}</Link>
                          )
                        ) : ('action' in it && it.action) ? (
                          <button className={styles.menuLink} onClick={() => { (it as any).action(); setMobileOpen(false); }}>{it.label}</button>
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

