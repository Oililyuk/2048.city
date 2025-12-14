'use client';

import MainMenu from '@/components/MainMenu/MainMenu';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <MainMenu />
    </header>
  );
}
