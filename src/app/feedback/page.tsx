'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useToast } from '@/components/Toast/ToastProvider';
import { MessageSquare, Send, User } from 'lucide-react';
import styles from '@/styles/AboutPage.module.css';

interface Comment {
  id: string;
  content: string;
  user: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState({ content: '' });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function fetchComments() {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {
      console.error('Failed to fetch comments', e);
    }
  }

  useEffect(() => {
    fetchComments();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ content: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: form.content }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        addToast('Failed to submit: ' + (err.error || res.statusText), 'error');
      } else {
        const created = await res.json();
        setComments(prev => [created, ...prev]);
        setForm({ content: '' });
        addToast('Feedback submitted — thank you!', 'success');
      }
    } catch (error) {
      console.error('Submit error', error);
      addToast('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
    fetchComments();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Feedback & Discussions</h1>
        <p>
          Help us build the absolute best home for 2048 puzzle enthusiasts. Share your bug reports, feature suggestions, or general comments.
        </p>
      </header>

      {/* Comment Form Section */}
      <section className={styles.spotlightCard} style={{ marginBottom: 40 }}>
        <div className={styles.spotlightHeader}>
          <MessageSquare size={20} />
          <h2>Submit a Comment</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          <div>
            <label htmlFor="content-textarea">Comment Content (required)</label>
            <textarea
              id="content-textarea"
              name="content"
              rows={4}
              required
              placeholder="What can we improve? E.g., tiles colors, strategic overlays, replay log validations..."
              value={form.content}
              onChange={handleChange}
              style={{ minHeight: '100px', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className={styles.ctaButton}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              disabled={loading}
            >
              <Send size={14} /> {loading ? 'Submitting...' : 'Submit Comment'}
            </button>
          </div>
        </form>
      </section>

      {/* Community Comments Feed */}
      <section>
        <h2 className={styles.sectionTitle} style={{ marginBottom: 24 }}>Recent Discussions</h2>
        {comments.length === 0 ? (
          <div className={styles.teamCard} style={{ padding: '40px 20px', color: 'var(--color-text-tertiary)' }}>
            <p>No discussions posted yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {comments.map((c) => (
              <article key={c.id} className={styles.techCard} style={{ display: 'block', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid var(--color-border-secondary)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--color-accent)', display: 'flex' }}><User size={14} /></span>
                    {c.user}
                  </div>
                  <time style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                    {new Date(c.createdAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                  </time>
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-secondary)', wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {c.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
