"use client";
import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';
export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

export default function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void; }) {
  useEffect(() => {
    toasts.forEach((t) => {
      if (!t.duration) return;
      const timer = setTimeout(() => onRemove(t.id), t.duration);
      return () => clearTimeout(timer);
    });
  }, [toasts, onRemove]);

  return (
    <div className={styles.toastRoot} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles.show} ${t.type === 'error' ? styles.error : t.type === 'success' ? styles.success : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className={styles.message}>{t.message}</div>
            <button aria-label="Close" className={styles.closeBtn} onClick={() => onRemove(t.id)}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
}
