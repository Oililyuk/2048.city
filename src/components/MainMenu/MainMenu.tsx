import Link from 'next/link';
import styles from './MainMenu.module.css';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Strategies', href: '/blog/advanced-strategies' },
  { label: 'AI vs Human', href: '/blog/ai-vs-human' },
  { label: 'History', href: '/blog/history-of-2048' },
  { label: 'Daily Challenge', href: '/challenges/daily' },
  { label: 'About', href: '/about' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Reddit', href: 'https://www.reddit.com/r/2048city/', external: true },
];

export default function MainMenu() {
  return (
    <nav className={styles.menu}>
      <div className={styles.logoSection}>
        {/* TODO: Replace with togetherlogo SVG/image */}
        <Link href="/" className={styles.logo} aria-label="2048 Home">
          <span>2048.city</span>
        </Link>
      </div>
      <input type="checkbox" id="menu-toggle" className={styles.menuToggle} />
      <label htmlFor="menu-toggle" className={styles.menuIcon}>
        <span className={styles.iconBar}></span>
        <span className={styles.iconBar}></span>
        <span className={styles.iconBar}></span>
      </label>
      <ul className={styles.menuList}>
        {menuItems.map(item => (
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
    </nav>
  );
}
