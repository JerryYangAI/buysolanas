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
    'w-full rounded-sm border border-foreground-tertiary/30 bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-foreground-tertiary focus:border-foreground-tertiary focus:outline-none transition-colors';

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
        className="inline-flex items-center justify-center gap-2 rounded-sm bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground-secondary disabled:opacity-50"
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
        <div className="flex items-center gap-2 rounded-sm bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle size={16} />
          {t('successMessage')}
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-sm bg-red-400/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} />
          {t('errorMessage')}
        </div>
      )}
      {status === 'rate_limited' && (
        <div className="flex items-center gap-2 rounded-sm bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          <AlertCircle size={16} />
          {t('rateLimited')}
        </div>
      )}
    </form>
  );
}
