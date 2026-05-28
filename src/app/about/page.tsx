import type { Metadata } from 'next';
import { Target, Code, Users, Mail, Github, Globe, Layers, Server, MessageSquare } from 'lucide-react';
import styles from '@/styles/AboutPage.module.css';

export const metadata: Metadata = {
  title: 'About Us | 2048.city',
  description: 'Learn about the 2048.city creators, our mission, technology stack, and how to join our open-source puzzle community.',
  keywords: 'about 2048, 2048.city team, puzzle game creators, online game community, technology stack, join us',
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>About 2048.city</h1>
        <p>
          We are passionate about creating the absolute best online 2048 puzzle experience—blending gorgeous modern design, responsive fluid dynamics, and a competitive global community.
        </p>
      </header>

      {/* Spotlight Card: Mission & Vision */}
      <section className={styles.spotlightCard}>
        <div className={styles.spotlightHeader}>
          <Target size={24} />
          <h2>Our Mission & Vision</h2>
        </div>
        <p>
          We believe puzzle games should be accessible, visually stunning, and mentally inspiring. Our mission is to make 2048 more than just a quick session—it is a place to learn, solve, compete, and connect. We build interfaces that feel premium and alive, elevating classical math blocks into a tactile art piece.
        </p>
      </section>

      {/* Meet the Team Grid */}
      <section style={{ marginBottom: 56 }}>
        <h2 className={styles.sectionTitle}>Meet the Team</h2>
        <div className={styles.teamGrid}>
          <div className={styles.teamCard}>
            <div className={styles.avatarPlaceholder}>
              <Code size={32} />
            </div>
            <h3 className={styles.teamName}>Yidong Zhang</h3>
            <span className={styles.teamRole}>Lead Creator & UI Designer</span>
            <p className={styles.teamBio}>
              Architect of the Obsidian Velvet design language. Passionate about frontend aesthetics, user micro-interactions, and visual layouts.
            </p>
            <a href="mailto:hello@2048.city" className={styles.teamLink}>
              <Mail size={14} /> hello@2048.city
            </a>
          </div>

          <div className={styles.teamCard}>
            <div className={styles.avatarPlaceholder}>
              <Users size={32} />
            </div>
            <h3 className={styles.teamName}>Oililyuk</h3>
            <span className={styles.teamRole}>Community & Operations Manager</span>
            <p className={styles.teamBio}>
              Oversees project strategy, moderation rules, and coordinates local game builds, maintaining our open-source GitHub workspace.
            </p>
            <a href="https://github.com/Oililyuk" target="_blank" rel="noopener noreferrer" className={styles.teamLink}>
              <Github size={14} /> @Oililyuk on GitHub
            </a>
          </div>

          <div className={styles.teamCard}>
            <div className={styles.avatarPlaceholder}>
              <Target size={32} />
            </div>
            <h3 className={styles.teamName}>Gabriele Cirulli</h3>
            <span className={styles.teamRole}>Inspirational Originator</span>
            <p className={styles.teamBio}>
              Creator of the legendary original open-source 2048 game in 2014, whose foundational math rules continue to inspire puzzle lovers everywhere.
            </p>
            <a href="https://github.com/gabrielecirulli/2048" target="_blank" rel="noopener noreferrer" className={styles.teamLink}>
              <Globe size={14} /> Original Original 2048
            </a>
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section style={{ marginBottom: 56 }}>
        <h2 className={styles.sectionTitle}>Technology Stack</h2>
        <div className={styles.techGrid}>
          <div className={styles.techCard}>
            <div className={styles.techIcon}>
              <Globe size={24} />
            </div>
            <div className={styles.techInfo}>
              <h4>Next.js 16 (App Router)</h4>
              <p>Powers our server-side rendering, routing logic, and edge-compiled endpoints.</p>
            </div>
          </div>

          <div className={styles.techCard}>
            <div className={styles.techIcon}>
              <Layers size={24} />
            </div>
            <div className={styles.techInfo}>
              <h4>React 19 & TypeScript</h4>
              <p>Provides robust dynamic render cycles, strict type-checking, and interactive modules.</p>
            </div>
          </div>

          <div className={styles.techCard}>
            <div className={styles.techIcon}>
              <Server size={24} />
            </div>
            <div className={styles.techInfo}>
              <h4>Prisma ORM & Postgres</h4>
              <p>Handles structured data modeling, synchronizing high scores, and persistent leaderboard saves.</p>
            </div>
          </div>

          <div className={styles.techCard}>
            <div className={styles.techIcon}>
              <Code size={24} />
            </div>
            <div className={styles.techInfo}>
              <h4>Aura Glass design CSS</h4>
              <p>Tailored HSL theme, fine high-blur backgrounds, and custom responsive CSS modules.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className={styles.ctaPanel}>
        <h3>Join Our Open Community</h3>
        <p>
          We are committed to maintaining a free, open-source experience. Explore our code repository on GitHub, or discuss competitive strategies with players from all across the globe.
        </p>
        <div className={styles.ctaButtons}>
          <a
            href="https://github.com/Oililyuk/2048.city"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
          >
            <Github size={16} /> Explore GitHub Repository
          </a>
          <a
            href="https://www.reddit.com/r/2048city/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            <MessageSquare size={16} /> Reddit Community
          </a>
          <a
            href="/contact"
            className={styles.ctaButton}
          >
            <Mail size={16} /> Contact Support Form
          </a>
        </div>
      </section>
    </div>
  );
}