'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited';

export default function AskForm() {
  const t = useTranslations('ask');
  const params = useParams();
  const locale = params.locale as string;

  const [walletType, setWalletType] = useState('');
  const [goal, setGoal] = useState('');
  const [stuckPoint, setStuckPoint] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_type: walletType,
          goal,
          stuck_point: stuckPoint,
          locale,
        }),
      });

      if (res.status === 429) {
        setStatus('rate_limited');
        return;
      }

      if (!res.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      setWalletType('');
      setGoal('');
      setStuckPoint('');
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-4 py-3 text-sm text-foreground placeholder:text-foreground-tertiary focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 focus:outline-none transition-all backdrop-blur-sm';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Wallet type */}
      <div>
        <label htmlFor="wallet" className="mb-2 block text-sm font-medium">
          {t('walletLabel')}
        </label>
        <select
          id="wallet"
          value={walletType}
          onChange={(e) => setWalletType(e.target.value)}
          required
          className={inputClass}
        >
          <option value="">{t('walletPlaceholder')}</option>
          <option value="phantom">Phantom</option>
          <option value="solflare">Solflare</option>
          <option value="backpack">Backpack</option>
          <option value="other">{t('walletOther')}</option>
          <option value="none">{t('walletNone')}</option>
        </select>
      </div>

      {/* Learning goal */}
      <div>
        <label htmlFor="goal" className="mb-2 block text-sm font-medium">
          {t('goalLabel')}
        </label>
        <input
          id="goal"
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
          maxLength={200}
          placeholder={t('goalPlaceholder')}
          className={inputClass}
        />
      </div>

      {/* Stuck point */}
      <div>
        <label htmlFor="stuck" className="mb-2 block text-sm font-medium">
          {t('stuckLabel')}
        </label>
        <textarea
          id="stuck"
          value={stuckPoint}
          onChange={(e) => setStuckPoint(e.target.value)}
          required
          maxLength={1000}
          rows={4}
          placeholder={t('stuckPlaceholder')}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent-blue/20 transition-all duration-300 hover:shadow-xl hover:shadow-accent-blue/30 hover:brightness-110 disabled:opacity-50 disabled:hover:shadow-lg"
      >
        {status === 'loading' ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        {status === 'loading' ? t('submitting') : t('submit')}
      </button>

      {/* Status messages */}
      {status === 'success' && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-green/20 bg-accent-green/10 px-4 py-3 text-sm text-accent-green">
          <CheckCircle size={16} />
          {t('successMessage')}
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-red/20 bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
          <AlertCircle size={16} />
          {t('errorMessage')}
        </div>
      )}
      {status === 'rate_limited' && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          <AlertCircle size={16} />
          {t('rateLimited')}
        </div>
      )}
    </form>
  );
}
