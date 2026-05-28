'use client';

import { useState } from 'react';
import { Gamepad2, Trophy, Brain, Users, ChevronDown } from 'lucide-react';
import styles from '@/styles/FAQPage.module.css';

type TabCategory = 'gameplay' | 'leaderboards' | 'strategy' | 'community';

interface FAQItem {
  q: string;
  a: string;
  category: TabCategory;
}

const faqs: FAQItem[] = [
  // Gameplay & Controls
  {
    q: 'How do I play 2048?',
    a: 'Use arrow keys (↑↓←→) on desktop or swipe on mobile to move all tiles in that direction. When two tiles with the same number touch, they merge into one tile with their sum. The goal is to create a tile with the number 2048. You can continue playing after reaching 2048 to achieve higher tiles!',
    category: 'gameplay'
  },
  {
    q: 'What are the basic controls?',
    a: 'Desktop: Use arrow keys to move tiles. Mobile/Tablet: Swipe in any direction. The game also supports touch gestures and keyboard shortcuts. Press U for undo (if available) and N for new game.',
    category: 'gameplay'
  },
  {
    q: 'Can I undo moves?',
    a: 'Yes! Click the "Undo" button or press U to reverse your last move. This feature helps you recover from mistakes and learn better strategies. Note: Undoing affects your final score submission eligibility in competitive modes.',
    category: 'gameplay'
  },
  {
    q: 'What happens after I reach 2048?',
    a: 'Congratulations! After reaching 2048, you can choose to continue playing to achieve even higher tiles like 4096, 8192, or beyond. The game never truly ends until the board is completely full with no possible moves remaining.',
    category: 'gameplay'
  },
  {
    q: 'What is the highest possible tile?',
    a: 'Theoretically, there is no limit! However, most players aim for 2048 (beginner goal), 4096 (intermediate), 8192 (advanced), or even 16384 (expert). The current world record by AI is over 131,072! The practical limit depends on strategy and luck.',
    category: 'gameplay'
  },
  {
    q: 'Does the game work offline?',
    a: 'The game requires an initial internet connection to load, but once loaded, you can play offline. However, submitting scores to the leaderboard requires an active internet connection.',
    category: 'gameplay'
  },

  // Accounts & Rankings
  {
    q: 'Do I need an account to play?',
    a: 'No account is required to play! However, creating a free session (via Google sign-in or by typing a Guest Nickname) allows you to save and submit scores to the global leaderboards, track personal stats, and participate in challenges.',
    category: 'leaderboards'
  },
  {
    q: 'How do I submit my score to the leaderboard?',
    a: 'First, sign in using either Google OAuth or a Guest Nickname. Play a Classic or Daily challenge run without using the undo action. Eligible completed runs are automatically submitted when the board runs out of legal moves.',
    category: 'leaderboards'
  },
  {
    q: 'How does the leaderboard ranking work?',
    a: 'Scores are ranked first by the highest tile achieved, then by total score. For example, a player with a 4096 tile ranks higher than someone with a 2048 tile. Practice runs stay local and do not get uploaded.',
    category: 'leaderboards'
  },
  {
    q: 'How do daily challenges work?',
    a: 'Daily challenges use the same deterministic seed for every player each UTC day. Everyone starts with the exact same sequence of tiles. We rank today\'s daily scores on our dedicated Daily Challenge leaderboard!',
    category: 'leaderboards'
  },
  {
    q: 'Is my personal data safe and private?',
    a: 'Yes! We only collect minimal data necessary for game functionality (nickname/avatar and game scores). No personal data is shared with third parties or sold. We use secure authentication via Google OAuth and guest credentials.',
    category: 'leaderboards'
  },

  // Strategies & Tips
  {
    q: 'What are the best strategies to win?',
    a: 'Key strategies include: (1) Keep your highest tile in a corner, (2) Build tiles in descending order toward that corner, (3) Avoid random moves, (4) Plan 2-3 moves ahead, (5) Keep the board organized. Check our "How to Win 2048" guide for detailed strategies!',
    category: 'strategy'
  },
  {
    q: 'Why did I lose? How can I improve?',
    a: 'Common mistakes include moving your highest tile away from its corner, filling the board with small scattered tiles, and making moves without planning ahead. Review our Advanced Strategies guide and practice maintaining a consistent pattern. Every loss is a learning opportunity!',
    category: 'strategy'
  },

  // Community & Project
  {
    q: 'Is 2048.city free to play?',
    a: 'Yes! 2048.city is completely free with no ads, no paywalls, and no hidden costs. We believe classic puzzle games should be clean, focused, and accessible to everyone.',
    category: 'community'
  },
  {
    q: 'Can I play on mobile devices?',
    a: 'Absolutely! The game is fully responsive and optimized for iOS, Android, tablets, and desktops. It works great in any modern web browser without requiring any App Store download.',
    category: 'community'
  },
  {
    q: 'Who created 2048.city?',
    a: '2048.city is designed and developed by Yidong Zhang & Oililyuk, inspired by Gabriele Cirulli\'s original 2048 open-source game. We built this edition to deliver a premium, visual-heavy hub for puzzle enthusiasts.',
    category: 'community'
  },
  {
    q: 'How do I report a bug or give feedback?',
    a: 'Visit our Feedback page to submit bug reports, feature requests, or general comments. You can also email us directly at hello@2048.city. We actively read and respond to all feedback to improve the game experience.',
    category: 'community'
  },
  {
    q: 'How can I join the community?',
    a: 'Join our Reddit community at r/2048city for strategy discussions, score updates, and community challenges. Follow us on Twitter @2048city for announcements!',
    category: 'community'
  },
  {
    q: 'Can I contribute to 2048.city development?',
    a: 'Absolutely! We welcome open-source contributions. Visit our GitHub repository to submit pull requests, report issues, or suggest features. Whether you\'re a developer, designer, or enthusiast, there\'s a way to contribute!',
    category: 'community'
  },
  {
    q: 'Are there any ads or in-app purchases?',
    a: 'No! 2048.city is 100% free with no advertisements, no in-app purchases, and no premium features. We believe in keeping puzzle games pure, accessible, and enjoyable for everyone.',
    category: 'community'
  },
  {
    q: 'Can I embed or share the game?',
    a: 'Yes! You can share the game URL (https://2048.city) with anyone. For embedding on your website or blog, please contact us at hello@2048.city for permission and proper attribution guidelines.',
    category: 'community'
  }
];

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<TabCategory>('gameplay');
  const [openIndexes, setOpenIndexes] = useState<Record<string, boolean>>({});

  const toggleIndex = (question: string) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  const filteredFaqs = faqs.filter((item) => item.category === activeTab);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about 2048.city, gameplay modes, leaderboards, and more.</p>
      </header>

      {/* Modern Tabs */}
      <nav className={styles.tabs} role="tablist" aria-label="FAQ Categories">
        <button
          className={`${styles.tabButton} ${activeTab === 'gameplay' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('gameplay')}
          role="tab"
          aria-selected={activeTab === 'gameplay'}
        >
          <Gamepad2 size={16} /> 🎮 Gameplay & Controls
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'leaderboards' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('leaderboards')}
          role="tab"
          aria-selected={activeTab === 'leaderboards'}
        >
          <Trophy size={16} /> 🏆 Leaderboards & Progress
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'strategy' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('strategy')}
          role="tab"
          aria-selected={activeTab === 'strategy'}
        >
          <Brain size={16} /> 🧠 Strategies & Winning
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'community' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('community')}
          role="tab"
          aria-selected={activeTab === 'community'}
        >
          <Users size={16} /> 💻 Project & Community
        </button>
      </nav>

      {/* Accordion List */}
      <div className={styles.accordionList}>
        {filteredFaqs.map((faq) => {
          const isOpen = !!openIndexes[faq.q];
          return (
            <div
              key={faq.q}
              className={`${styles.item} ${isOpen ? styles.itemActive : ''}`}
            >
              <button
                type="button"
                className={styles.trigger}
                onClick={() => toggleIndex(faq.q)}
                aria-expanded={isOpen}
              >
                <span className={styles.triggerText}>{faq.q}</span>
                <span className={styles.icon}>
                  <ChevronDown size={16} />
                </span>
              </button>
              <div className={`${styles.content} ${isOpen ? styles.contentOpen : ''}`}>
                <div className={styles.answer}>
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
