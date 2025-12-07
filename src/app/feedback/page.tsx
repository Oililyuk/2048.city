"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

const glass = {
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(12px) saturate(180%)',
  WebkitBackdropFilter: 'blur(12px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 12,
  boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
};

export default function FeedbackPage() {
  const [comments, setComments] = useState<Array<{id: string; content: string; user: string; createdAt: string}>>([]);
  const [form, setForm] = useState({ content: '' });
  const [loading, setLoading] = useState(false);

  async function fetchComments() {
    const res = await fetch('/api/feedback');
    const data = await res.json();
    setComments(data);
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
        alert('Failed to submit: ' + (err.error || res.statusText));
      } else {
        // optimistic fetch update
        const created = await res.json();
        setComments(prev => [created, ...prev]);
        setForm({ content: '' });
      }
    } catch (error) {
      console.error('Submit error', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
    // ensure list refreshed from server
    fetchComments();
  };

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)', marginBottom: 8 }}>Feedback</h1>
      <p style={{ color: '#fff', fontSize: 16, marginBottom: 18 }}>Share your thoughts, suggestions, or bug reports. Comments are public and support discussion!</p>
      <form onSubmit={handleSubmit} style={{ ...glass, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', padding: '1.2rem' }}>
        <label style={{ color: '#fff', fontWeight: 500 }}>
          Comment (required)
          <textarea name="content" rows={4} required value={form.content} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginTop: 4, ...glass, color: '#fff', fontSize: 15, resize: 'vertical', minHeight: 60, outline: 'none' }} />
        </label>
        <button type="submit" style={{ ...glass, padding: '0.75rem 2rem', fontWeight: 600, color: '#fff', fontSize: 16, cursor: 'pointer', border: 'none', transition: 'background 0.2s, box-shadow 0.2s' }} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.1rem', color: '#4fd1c5', marginBottom: 12 }}>Comments</h2>
        {comments.length === 0 ? (
          <p style={{ color: '#ccc' }}>No comments yet. Be the first to share!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {comments.map((c) => (
              <li key={c.id} style={{ ...glass, marginBottom: 16, padding: '1em', color: '#fff', position: 'relative' }}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: '#fff' }}>{c.user} <span style={{ fontWeight: 400, fontSize: 12, color: '#aaa' }}>{new Date(c.createdAt).toLocaleString()}</span></div>
                <div style={{ color: '#fff', fontSize: 15, wordBreak: 'break-word' }}>{c.content}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
