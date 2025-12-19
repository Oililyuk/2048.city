import type { Metadata } from 'next';
import styles from '@/styles/ContentPage.module.css';

export const metadata: Metadata = {
  title: 'Contact Us | 2048.city',
  description: 'Contact the 2048.city team for feedback, support, partnership, or media inquiries.',
  keywords: 'contact 2048, 2048.city support, feedback, partnership, media',
};

export const themeColor = '#000000';

export default function ContactPage() {
  return (
    <main className={styles.contentPage}>
      <h1>Contact Us</h1>
      <p>We value your feedback and are happy to answer any questions. You can email us at <a href="mailto:hello@2048.city">hello@2048.city</a>.</p>
      <p>For quick support, please visit our <a href="/feedback">Feedback page</a> or email us directly.</p>
      
      <section>
        <h2>Frequently Asked Contact Questions</h2>
        <ul>
          <li>For technical support, see our <a href="/faq">FAQ</a> or email us.</li>
          <li>For partnership or media, email <a href="mailto:hello@2048.city">hello@2048.city</a> with subject "Partnership" or "Media".</li>
          <li>For bug reports, use the <a href="/feedback">Feedback</a> page.</li>
        </ul>
      </section>
      
      <section>
        <h2>Meet the Team</h2>
        <ul>
          <li><b>Yidong Zhang</b> — Lead Developer & Designer</li>
          <li><b>Oililyuk</b> — Community & Operations</li>
        </ul>
      </section>
      
      <section>
        <h2>Connect with Us</h2>
        <ul>
          <li>Reddit: <a href="https://www.reddit.com/r/2048city/" target="_blank" rel="noopener noreferrer">r/2048city</a></li>
          <li>Twitter: <a href="https://twitter.com/2048city" target="_blank" rel="noopener noreferrer">@2048city</a></li>
          <li>GitHub: <a href="https://github.com/Oililyuk/2048.city" target="_blank" rel="noopener noreferrer">2048.city repo</a></li>
        </ul>
      </section>
      
      <section>
        <h2>Partnership & Media</h2>
        <p>We welcome partnership, sponsorship, and media inquiries. Please email us with details and we'll respond promptly.</p>
      </section>
    </main>
  );
}
