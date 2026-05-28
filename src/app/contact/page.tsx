import type { Metadata } from 'next';
import { Mail, MessageSquare, Handshake, Github, HelpCircle } from 'lucide-react';
import styles from '@/styles/AboutPage.module.css';

export const metadata: Metadata = {
  title: 'Contact Us | 2048.city',
  description: 'Reach out to the 2048.city team for technical support, partnership inquiries, media requests, or game feedback.',
  keywords: 'contact 2048, 2048.city support, feedback, partnership, media',
};

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Contact Us</h1>
        <p>
          We value your feedback and are happy to connect. Whether you have strategic gameplay questions, technical support issues, or partnership proposals, we are here to help.
        </p>
      </header>

      {/* Main Support Spotlight Card */}
      <section className={styles.spotlightCard}>
        <div className={styles.spotlightHeader}>
          <HelpCircle size={24} />
          <h2>Looking for Fast Answers?</h2>
        </div>
        <p>
          Before reaching out, check out our newly redesigned, interactive <a href="/faq" style={{ color: '#4fd1c5', textDecoration: 'underline' }}>FAQ Page</a>. It covers comprehensive guides on gameplay controls, Google session persistence, leaderboard rules, scoring algorithms, and offline performance optimization.
        </p>
      </section>

      {/* Contact Grid Card Channels */}
      <section style={{ marginBottom: 56 }}>
        <h2 className={styles.sectionTitle}>Get In Touch</h2>
        <div className={styles.teamGrid}>
          {/* Channel 1: Technical & General Support */}
          <div className={styles.teamCard}>
            <div className={styles.avatarPlaceholder}>
              <Mail size={32} />
            </div>
            <h3 className={styles.teamName}>Direct Support</h3>
            <span className={styles.teamRole}>General & Technical Issues</span>
            <p className={styles.teamBio}>
              Spotted a rendering glitch or had an issue submitting your high score? Send our developer support inbox a line.
            </p>
            <a href="mailto:hello@2048.city" className={styles.teamLink}>
              hello@2048.city
            </a>
          </div>

          {/* Channel 2: Community Support Forum */}
          <div className={styles.teamCard}>
            <div className={styles.avatarPlaceholder}>
              <MessageSquare size={32} />
            </div>
            <h3 className={styles.teamName}>Feedback Forum</h3>
            <span className={styles.teamRole}>Feature Requests & Discussion</span>
            <p className={styles.teamBio}>
              Want to propose new game modes, check keycap color themes, or chat with other players? Post on our public discussion page.
            </p>
            <a href="/feedback" className={styles.teamLink}>
              Visit Feedback Board
            </a>
          </div>

          {/* Channel 3: Partnerships & Media */}
          <div className={styles.teamCard}>
            <div className={styles.avatarPlaceholder}>
              <Handshake size={32} />
            </div>
            <h3 className={styles.teamName}>Partnerships</h3>
            <span className={styles.teamRole}>Collaborations & Sponsors</span>
            <p className={styles.teamBio}>
              Interested in featuring your brand on our obsidian panels, embedding our engine, or scheduling tournaments? Reach out today.
            </p>
            <a href="mailto:hello@2048.city?subject=Partnership Inquiry" className={styles.teamLink}>
              hello@2048.city
            </a>
          </div>
        </div>
      </section>

      {/* Connect section */}
      <section className={styles.ctaPanel}>
        <h3>Connect With Our Developer Team</h3>
        <p>
          We build in public! Follow our open commits, check version tags, or connect with the creators on standard social networks.
        </p>
        <div className={styles.ctaButtons}>
          <a
            href="https://github.com/Oililyuk/2048.city"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
          >
            <Github size={16} /> 2048.city on GitHub
          </a>
          <a
            href="https://www.reddit.com/r/2048city/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            <MessageSquare size={16} /> Reddit Community
          </a>
        </div>
      </section>
    </div>
  );
}
