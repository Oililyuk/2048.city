'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './LoginButton.module.css';

export default function LoginButton() {
  const { data: session, status } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'google' | 'guest'>('guest');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close modal on escape key
  useEffect(() => {
    if (!modalOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // Focus input when tab switches to guest
  useEffect(() => {
    if (modalOpen && activeTab === 'guest') {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [modalOpen, activeTab]);

  if (status === 'loading') {
    return <div className={styles.button}>Loading...</div>;
  }

  if (session) {
    return (
      <div className={styles.userInfo}>
        <img 
          src={session.user?.image || '/default-avatar.png'} 
          alt={session.user?.name || 'User'} 
          className={styles.avatar}
        />
        <span className={styles.name}>{session.user?.name}</span>
        <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.button}>
          Sign Out
        </button>
      </div>
    );
  }

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedNickname = nickname.trim();
    if (trimmedNickname.length < 2 || trimmedNickname.length > 15) {
      setError('Nickname must be between 2 and 15 characters.');
      return;
    }
    
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(trimmedNickname)) {
      setError('Only letters, numbers, Chinese characters, and underscores allowed.');
      return;
    }
    
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        username: trimmedNickname,
        redirect: false,
      });

      if (result?.error) {
        setError('Login failed. Please try a different nickname.');
      } else {
        setModalOpen(false);
        // Refresh page to populate session states cleanly
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)} className={styles.button}>
        Sign In
      </button>

      {modalOpen && (
        <div 
          className={styles.modalOverlay} 
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className={styles.modal} 
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <div className={styles.modalHeader}>
              <h3 id="modal-title">Join 2048.city</h3>
              <button 
                className={styles.closeButton} 
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className={styles.tabs} role="tablist">
              <button
                className={`${styles.tab} ${activeTab === 'guest' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('guest')}
                role="tab"
                aria-selected={activeTab === 'guest'}
              >
                🎮 Guest Play
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'google' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('google')}
                role="tab"
                aria-selected={activeTab === 'google'}
              >
                🔑 Google OAuth
              </button>
            </div>

            <div className={styles.modalBody}>
              {activeTab === 'google' ? (
                <div className={styles.googleContainer}>
                  <button 
                    onClick={() => signIn('google')} 
                    className={styles.googleBtn}
                  >
                    <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                  
                  <div className={styles.devBadge}>
                    💡 <strong>Developer / Local Note:</strong> If Google sign-in is unconfigured locally, please use the <strong>Guest Play</strong> tab to log in instantly.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleGuestSubmit} className={styles.modalBody}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nickname">Pick a Nickname</label>
                    <input
                      ref={inputRef}
                      type="text"
                      id="nickname"
                      className={styles.input}
                      placeholder="e.g. TileMaster99"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      maxLength={15}
                      required
                      disabled={loading}
                    />
                    {error && <p className={styles.errorText}>{error}</p>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? 'Creating session...' : 'Play as Guest'}
                  </button>
                  
                  <p className={styles.guestTip}>
                    Guest logins persist on this browser so you can save high scores, compete globally, and climb the rankings!
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
