import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | 2048.city',
  description: 'Contact the 2048.city team for feedback, support, partnership, or media inquiries. Find answers to common questions and connect with us on social media.',
  keywords: 'contact 2048, 2048.city support, feedback, partnership, media, team, social media',
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
export const themeColor = '#000000';

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Contact Us</h1>
      <p>We value your feedback and are happy to answer any questions. You can email us at <a href="mailto:hello@2048.city">hello@2048.city</a> or use the form below:</p>
      <form action="https://novas.live/contact.html" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <label>
          Name
          <input type="text" name="name" required style={{ width: '100%', padding: '0.5rem', marginTop: 4 }} />
        </label>
        <label>
          Email
          <input type="email" name="email" required style={{ width: '100%', padding: '0.5rem', marginTop: 4 }} />
        </label>
        <label>
          Message
          <textarea name="message" rows={5} required style={{ width: '100%', padding: '0.5rem', marginTop: 4 }} />
        </label>
        <button type="submit" style={{ padding: '0.75rem 2rem', background: '#222', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Send</button>
      </form>
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.1rem', color: '#4fd1c5' }}>Frequently Asked Contact Questions</h2>
        <ul style={{ paddingLeft: 18, color: '#444', fontSize: '1rem' }}>
          <li>For technical support, see our <a href="/faq" style={{ color: '#0070f3' }}>FAQ</a> or email us.</li>
          <li>For partnership or media, email <a href="mailto:hello@2048.city">hello@2048.city</a> with subject “Partnership” or “Media”.</li>
          <li>For bug reports, use the <a href="/feedback" style={{ color: '#0070f3' }}>Feedback</a> page.</li>
        </ul>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.1rem', color: '#4fd1c5' }}>Meet the Team</h2>
        <ul style={{ paddingLeft: 18, color: '#444', fontSize: '1rem' }}>
          <li><b>Yidong Zhang</b> — Lead Developer & Designer</li>
          <li><b>Oililyuk</b> — Community & Operations</li>
        </ul>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.1rem', color: '#4fd1c5' }}>Connect with Us</h2>
        <ul style={{ paddingLeft: 18, color: '#444', fontSize: '1rem' }}>
          <li>Reddit: <a href="https://www.reddit.com/r/2048city/" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>r/2048city</a></li>
          <li>Twitter: <a href="https://twitter.com/2048city" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>@2048city</a></li>
          <li>GitHub: <a href="https://github.com/Oililyuk/2048.city" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>2048.city repo</a></li>
        </ul>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.1rem', color: '#4fd1c5' }}>Partnership & Media</h2>
        <p style={{ color: '#444', fontSize: '1rem' }}>We welcome partnership, sponsorship, and media inquiries. Please email us with details and we’ll respond promptly.</p>
      </section>
    </main>
  );
}