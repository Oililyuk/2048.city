'use client';

import { useState, useEffect } from 'react';
import styles from './Leaderboard.module.css';

interface LeaderboardEntry {
  id: string;
  userName: string;
  score: number;
  maxTile: number;
  createdAt: string;
}

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scores/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  return (
    <>
      {/* 排行榜按钮 */}
      <button
        className={styles.leaderboardButton}
        onClick={() => setIsOpen(true)}
        aria-label="View Leaderboard"
      >
        <span className={styles.buttonIcon}>🏆</span>
        <span className={styles.buttonText}>Leaderboard</span>
      </button>

      {/* 排行榜弹窗 */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2>🏆 Leaderboard</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className={styles.content}>
              {loading ? (
                <div className={styles.loading}>Loading...</div>
              ) : leaderboard.length === 0 ? (
                <div className={styles.empty}>No data yet</div>
              ) : (
                <div className={styles.list}>
                  {leaderboard.map((entry, index) => (
                    <div key={entry.id} className={styles.entry}>
                      <div className={styles.rank}>
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `${index + 1}`}
                      </div>
                      <div className={styles.info}>
                        <div className={styles.userName}>{entry.userName}</div>
                        <div className={styles.stats}>
                          <span className={styles.score}>{entry.score} pts</span>
                          <span className={styles.maxTile}>Max: {entry.maxTile}</span>
                        </div>
                      </div>
                      <div className={styles.date}>
                        {new Date(entry.createdAt).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
