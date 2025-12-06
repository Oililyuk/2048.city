'use client';

import { useState } from 'react';
import styles from './HowToPlay.module.css';

export default function HowToPlay() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Site menu links for navigation
  const menuLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog & Guides' },
    { href: '/blog/how-to-win-2048', label: 'How to Win 2048' },
    { href: '/blog/advanced-strategies', label: 'Advanced Strategies' },
    { href: '/blog/ai-vs-human', label: 'AI vs. Human' },
    { href: '/blog/history-of-2048', label: 'History of 2048' },
    { href: '/challenges/daily', label: 'Daily Challenge' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: 'https://www.reddit.com/r/2048city/', label: 'Reddit Community', external: true },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Site Menu Section */}
        <div className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('menu')}
            aria-expanded={expandedSection === 'menu'}
          >
            <h2 className={styles.title}>📚 Site Menu</h2>
            <span className={styles.icon}>{expandedSection === 'menu' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'menu' && (
            <div className={styles.sectionContent}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {menuLinks.map(link => (
                  <li key={link.href} style={{ margin: '0.5rem 0' }}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      style={{ color: '#4fd1c5', fontWeight: 500, textDecoration: 'none', fontSize: 16 }}
                    >
                      {link.label}
                      {link.external && <span style={{ marginLeft: 6, fontSize: 14 }}>↗</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* How to Play Section */}
        <div className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('howto')}
            aria-expanded={expandedSection === 'howto'}
          >
            <h2 className={styles.title}>📖 How to Play 2048</h2>
            <span className={styles.icon}>{expandedSection === 'howto' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'howto' && (
            <div className={styles.sectionContent}>
              <p>
                <strong>2048</strong> is a simple yet addictive puzzle game where you combine numbered tiles 
                to reach the magic number 2048!
              </p>
              
              <h3>Basic Rules</h3>
              <ul>
                <li><strong>Move tiles:</strong> Use arrow keys (↑ ↓ ← →) or swipe on mobile to move all tiles in that direction</li>
                <li><strong>Combine tiles:</strong> When two tiles with the same number touch, they merge into one with double the value</li>
                <li><strong>New tiles:</strong> After each move, a new tile (2 or 4) appears in a random empty spot</li>
                <li><strong>Goal:</strong> Create a tile with the number 2048 to win!</li>
                <li><strong>Game Over:</strong> The game ends when the board is full and no more moves are possible</li>
              </ul>

              <h3>Controls</h3>
              <ul>
                <li><strong>Desktop:</strong> Arrow keys (↑ ↓ ← →) or W, A, S, D keys</li>
                <li><strong>Mobile:</strong> Swipe in any direction</li>
                <li><strong>Undo:</strong> Use the Undo button to reverse your last move (limited uses)</li>
                <li><strong>New Game:</strong> Start fresh anytime with the New Game button</li>
              </ul>
            </div>
          )}
        </div>

        {/* Strategies Section */}
        <div className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('strategy')}
            aria-expanded={expandedSection === 'strategy'}
          >
            <h2 className={styles.title}>🎯 Winning Strategies & Tips</h2>
            <span className={styles.icon}>{expandedSection === 'strategy' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'strategy' && (
            <div className={styles.sectionContent}>
              <h3>Essential Strategy: The Corner Method</h3>
              <p>
                The most effective strategy is to <strong>keep your highest tile in one corner</strong> 
                and build around it. Here's how:
              </p>
              <ul>
                <li><strong>Choose a corner:</strong> Pick one corner (bottom-right is popular) and never move your highest tile away</li>
                <li><strong>Build a chain:</strong> Arrange tiles in descending order from your corner</li>
                <li><strong>Use two directions:</strong> Primarily use only two movement directions that don't move your corner tile</li>
                <li><strong>Fill the bottom row:</strong> Keep your bottom row (or chosen edge) as full as possible</li>
              </ul>

              <h3>Advanced Tips</h3>
              <ul>
                <li>
                  <strong>Plan ahead:</strong> Think 2-3 moves in advance. Consider where new tiles might appear
                </li>
                <li>
                  <strong>Avoid random moves:</strong> Don't swipe up unless absolutely necessary if keeping tiles at the bottom
                </li>
                <li>
                  <strong>Create merge opportunities:</strong> Position tiles so they can combine in your next move
                </li>
                <li>
                  <strong>Manage small tiles:</strong> Combine small tiles quickly to keep the board organized
                </li>
                <li>
                  <strong>Use undo wisely:</strong> Save your undo moves for critical mistakes, not minor setbacks
                </li>
                <li>
                  <strong>Stay calm:</strong> Don't rush. Take time to analyze the board before each move
                </li>
              </ul>

              <h3>Common Mistakes to Avoid</h3>
              <ul>
                <li>❌ Moving your highest tile away from its corner</li>
                <li>❌ Making moves without a plan</li>
                <li>❌ Focusing only on large tiles while ignoring small ones</li>
                <li>❌ Filling the center of the board too quickly</li>
                <li>❌ Using all four directions randomly</li>
              </ul>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('faq')}
            aria-expanded={expandedSection === 'faq'}
          >
            <h2 className={styles.title}>❓ Frequently Asked Questions</h2>
            <span className={styles.icon}>{expandedSection === 'faq' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'faq' && (
            <div className={styles.sectionContent}>
              <h3>What happens after I reach 2048?</h3>
              <p>
                Congratulations! You can choose to continue playing and try to reach even higher tiles 
                like 4096, 8192, or beyond. The game doesn't stop at 2048.
              </p>

              <h3>How many undo moves do I get?</h3>
              <p>
                You start with 3 undo moves. You can earn more by creating tiles with values of 256 or higher. 
                The maximum number of undo moves you can accumulate is 10.
              </p>

              <h3>Is 2048 free to play?</h3>
              <p>
                Yes! 2048.city is completely free to play. No downloads, no subscriptions, no hidden costs. 
                Just pure puzzle fun!
              </p>

              <h3>Can I play 2048 offline?</h3>
              <p>
                Once you've loaded the game, you can play offline. However, features like the leaderboard 
                and score submission require an internet connection.
              </p>

              <h3>How does the leaderboard work?</h3>
              <p>
                Sign in with Google to submit your scores to the global leaderboard. Your best score will 
                be displayed, and you can compete with players worldwide!
              </p>

              <h3>What's the highest possible tile?</h3>
              <p>
                Theoretically, you can keep doubling tiles indefinitely. The most commonly achieved super tiles 
                are 4096, 8192, 16384, and 32768. Reaching 131072 is extremely rare!
              </p>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('about')}
            aria-expanded={expandedSection === 'about'}
          >
            <h2 className={styles.title}>ℹ️ About 2048</h2>
            <span className={styles.icon}>{expandedSection === 'about' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'about' && (
            <div className={styles.sectionContent}>
              <p>
                2048 is a sliding block puzzle game originally created by Gabriele Cirulli in 2014. 
                It quickly became a global phenomenon, captivating millions of players with its simple 
                yet challenging gameplay.
              </p>
              
              <h3>Why Play 2048 at 2048.city?</h3>
              <ul>
                <li>🎨 <strong>Beautiful Design:</strong> Modern glass effect interface inspired by iOS design</li>
                <li>🏆 <strong>Global Leaderboard:</strong> Compete with players worldwide</li>
                <li>💾 <strong>Cloud Saves:</strong> Sign in to save your progress and scores</li>
                <li>📱 <strong>Mobile Optimized:</strong> Smooth gameplay on any device</li>
                <li>⚡ <strong>Fast & Responsive:</strong> No lag, no ads interrupting your game</li>
                <li>🆓 <strong>100% Free:</strong> No paywalls, no premium features</li>
              </ul>

              <h3>Benefits of Playing 2048</h3>
              <ul>
                <li><strong>Brain Training:</strong> Improves strategic thinking and planning skills</li>
                <li><strong>Pattern Recognition:</strong> Enhances spatial awareness and number sense</li>
                <li><strong>Stress Relief:</strong> A perfect way to relax and unwind</li>
                <li><strong>Quick Sessions:</strong> Play for 5 minutes or 5 hours - your choice!</li>
                <li><strong>No Commitment:</strong> Pause and resume anytime</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          © 2024 2048.city | Play 2048 free online - The addictive puzzle game loved by millions | 
          No download required
        </p>
      </footer>
    </div>
  );
}
