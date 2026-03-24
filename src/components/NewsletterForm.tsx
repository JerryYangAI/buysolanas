'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm({ variant = 'inline' }: { variant?: 'inline' | 'card' }) {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: variant }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (variant === 'card') {
    return (
      <div className="glass-card p-6 text-center">
        <Mail size={24} className="mx-auto mb-3 text-sol-purple" />
        <h3 className="mb-2 text-lg font-semibold">{t('cardTitle')}</h3>
        <p className="mb-4 text-sm text-foreground-secondary">{t('cardDesc')}</p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-sol-green/10 py-3 text-sm text-sol-green">
            <CheckCircle size={16} />
            {t('success')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholder')}
              required
              className="flex-1 rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-4 py-2.5 text-sm placeholder:text-foreground-tertiary focus:border-sol-purple/40 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 rounded-lg bg-sol-purple px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : t('subscribe')}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-accent-red">
            <AlertCircle size={12} /> {t('error')}
          </p>
        )}
      </div>
    );
  }

  // Inline variant (for footer)
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-foreground-secondary">{t('footerTitle')}</p>
      <p className="mb-3 text-xs text-foreground-tertiary">{t('footerDesc')}</p>

      {status === 'success' ? (
        <p className="flex items-center gap-1.5 text-xs text-sol-green">
          <CheckCircle size={12} /> {t('success')}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            required
            className="flex-1 rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-3 py-2 text-xs placeholder:text-foreground-tertiary focus:border-sol-purple/40 focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 rounded-lg bg-sol-purple px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {status === 'loading' ? '...' : t('subscribe')}
          </button>
        </form>
      )}
    </div>
  );
}
