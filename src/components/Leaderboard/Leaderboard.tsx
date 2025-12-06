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
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>🎮</div>
                  <h3>No Scores Yet</h3>
                  <p>Be the first to claim your spot on the leaderboard!</p>
                </div>
              ) : (
                <>
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
                            <span className={styles.score}>{entry.score.toLocaleString()} pts</span>
                            <span className={styles.maxTile}>Max: {entry.maxTile}</span>
                          </div>
                        </div>
                        <div className={styles.date}>
                          {new Date(entry.createdAt).toLocaleDateString('en-US')}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {/* 激励说明和社区链接 */}
              <div className={styles.footer}>
                <div className={styles.callToAction}>
                  <div className={styles.ctaIcon}>🌟</div>
                  <div className={styles.ctaContent}>
                    <h4>Compete with Players Worldwide!</h4>
                    <p>
                      Sign in with Google to save your scores and climb the leaderboard. 
                      Your best score is automatically submitted when you finish a game.
                    </p>
                  </div>
                </div>
                
                <div className={styles.community}>
                  <p className={styles.communityTitle}>Join Our Community</p>
                  <a 
                    href="https://www.reddit.com/r/2048city/comments/1pepcdo/my2048city/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.redditLink}
                  >
                    <span className={styles.redditIcon}>🎯</span>
                    <span>Discuss strategies on Reddit</span>
                    <span className={styles.externalIcon}>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
