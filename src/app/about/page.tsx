import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | 2048.city',
  description: 'Learn about the 2048.city team, our mission, and how to contact us.',
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>About 2048.city</h1>
      <p>Welcome to <b>2048.city</b>! We are passionate about creating the best online 2048 experience, with a focus on beautiful design, fair competition, and a friendly community.</p>
      <h2>Our Mission</h2>
      <p>Our goal is to make 2048 more than just a game. We want to build a place where players can learn, compete, and share strategies together.</p>
      <h2>Team</h2>
      <p>Team information and photos coming soon.</p>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:hello@2048.city">hello@2048.city</a></p>
      <p>Or use our <a href="/contact">contact form</a>.</p>
    </main>
  );
}