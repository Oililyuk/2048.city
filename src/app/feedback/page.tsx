import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback | 2048.city',
  description: 'Send us your feedback, suggestions, bug reports, or feature requests. Help us improve 2048.city for everyone! Your input is valued and kept private.',
  keywords: 'feedback 2048, bug report, feature request, suggestion, privacy, 2048.city team',
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
export const themeColor = '#000000';

export default function FeedbackPage() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Feedback</h1>
      <p>We value your feedback! Please let us know your suggestions, bug reports, feature requests, or anything you want to share. Your input helps us make 2048.city better for everyone.</p>
      <form action="/api/feedback" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <label>
          Name (optional)
          <input type="text" name="name" style={{ width: '100%', padding: '0.5rem', marginTop: 4 }} />
        </label>
        <label>
          Email (optional)
          <input type="email" name="email" style={{ width: '100%', padding: '0.5rem', marginTop: 4 }} />
        </label>
        <label>
          Feedback (required)
          <textarea name="message" rows={5} required style={{ width: '100%', padding: '0.5rem', marginTop: 4 }} />
        </label>
        <button type="submit" style={{ padding: '0.75rem 2rem', background: '#4fd1c5', color: '#222', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Send Feedback</button>
      </form>
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.1rem', color: '#4fd1c5' }}>What Can I Submit?</h2>
        <ul style={{ paddingLeft: 18, color: '#444', fontSize: '1rem' }}>
          <li>Bug reports (gameplay, UI, login, etc.)</li>
          <li>Feature requests (new modes, UI ideas, etc.)</li>
          <li>General suggestions or feedback</li>
        </ul>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.1rem', color: '#4fd1c5' }}>Privacy Promise</h2>
        <p style={{ color: '#444', fontSize: '1rem' }}>Your feedback is kept private and only used to improve the site. No personal data is shared or sold.</p>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.1rem', color: '#4fd1c5' }}>Meet the Team</h2>
        <ul style={{ paddingLeft: 18, color: '#444', fontSize: '1rem' }}>
          <li><b>Yidong Zhang</b> — Lead Developer & Designer</li>
          <li><b>Oililyuk</b> — Community & Operations</li>
        </ul>
      </section>
    </main>
  );
}
