import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | 2048.city',
  description: 'Contact the 2048.city team. Send us your feedback, suggestions, or partnership inquiries.'
};

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
    </main>
  );
}