import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | 2048.city',
  description: 'Frequently Asked Questions about 2048.city, gameplay, accounts, leaderboard, privacy, technology, and community.',
  keywords: '2048 FAQ, 2048 help, 2048.city questions, leaderboard, privacy, account, mobile, puzzle game support',
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
export const themeColor = '#000000';

const faqs = [
  {
    q: 'How do I play 2048?',
    a: 'Use arrow keys or swipe to move tiles. When two tiles with the same number touch, they merge into one. The goal is to reach the 2048 tile.'
  },
  {
    q: 'Is 2048.city free to play?',
    a: 'Yes! 2048.city is completely free and always will be.'
  },
  {
    q: 'Can I play on mobile devices?',
    a: 'Absolutely. The site is fully responsive and optimized for mobile, tablet, and desktop.'
  },
  {
    q: 'Do I need an account to play?',
    a: 'No account is needed to play. However, logging in lets you submit scores, track progress, and join the leaderboard.'
  },
  {
    q: 'How do I submit my score?',
    a: 'After you finish a game, you can submit your score to the leaderboard if you are logged in.'
  },
  {
    q: 'How does the leaderboard work?',
    a: 'Scores are ranked by highest tile and total score. Only logged-in users can submit scores. Daily challenges have their own leaderboard.'
  },
  {
    q: 'How do I report a bug or give feedback?',
    a: 'Use the Feedback page or contact us at hello@2048.city. We welcome suggestions and bug reports!'
  },
  {
    q: 'Who created 2048.city?',
    a: "The site is built by the 2048.city team, inspired by Gabriele Cirulli's original 2048."
  },
  {
    q: 'Is my data safe?',
    a: 'We value your privacy. No personal data is shared or sold. See our Privacy Policy for details.'
  },
  {
    q: 'What technology powers 2048.city?',
    a: '2048.city uses Next.js, React, TypeScript, Prisma, and Vercel for fast, secure, and modern gameplay.'
  },
  {
    q: 'How can I join the community?',
    a: 'Join our Reddit or follow us on Twitter for tips, events, and updates. See the About page for links.'
  },
  {
    q: 'Can I contribute to 2048.city?',
    a: 'Yes! We welcome open-source contributions. Visit our GitHub or contact us for details.'
  }
];

export default function FAQPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Frequently Asked Questions</h1>
      <p>Find answers to common questions about 2048.city, gameplay, accounts, and more.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {faqs.map((faq, idx) => (
          <li key={idx} style={{ marginBottom: '1.5rem' }}>
            <details>
              <summary style={{ fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', color: '#4fd1c5' }}>{faq.q}</summary>
              <div style={{ marginTop: 8, color: '#222', fontSize: '1rem' }}>{faq.a}</div>
            </details>
          </li>
        ))}
      </ul>
    </main>
  );
}
