'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FOR_SALE_DOMAINS } from '@/lib/domain-config';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function DomainInquiryForm() {
  const t = useTranslations('domains');
  const [email, setEmail] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  function toggleDomain(domain: string) {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || selectedDomains.length === 0) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/domains/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, domains: selectedDomains, message, budget }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) {
        setEmail('');
        setSelectedDomains([]);
        setMessage('');
        setBudget('');
      }
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-4 py-3 text-sm text-foreground placeholder:text-foreground-tertiary focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-all';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Domain selection */}
      <div>
        <label className="mb-2 block text-sm font-medium">{t('selectDomains')}</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FOR_SALE_DOMAINS.map((d) => (
            <button
              key={d.domain}
              type="button"
              onClick={() => toggleDomain(d.domain)}
              className={`rounded-lg border px-3 py-2 text-left text-xs font-mono transition-all ${
                selectedDomains.includes(d.domain)
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                  : 'border-[var(--color-glass-border)] bg-[var(--color-glass)] text-foreground-secondary hover:border-white/[0.12]'
              }`}
            >
              {d.icon} {d.domain}
            </button>
          ))}
        </div>
        {selectedDomains.length > 1 && (
          <p className="mt-2 text-xs text-amber-400">{t('bundleHint')}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="inquiry-email" className="mb-2 block text-sm font-medium">{t('emailLabel')}</label>
        <input
          id="inquiry-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={t('emailPlaceholder')}
          className={inputClass}
        />
      </div>

      {/* Budget range */}
      <div>
        <label htmlFor="inquiry-budget" className="mb-2 block text-sm font-medium">{t('budgetLabel')}</label>
        <select id="inquiry-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={inputClass}>
          <option value="">{t('budgetPlaceholder')}</option>
          <option value="under-500">{'< $500'}</option>
          <option value="500-2000">$500 – $2,000</option>
          <option value="2000-5000">$2,000 – $5,000</option>
          <option value="5000-10000">$5,000 – $10,000</option>
          <option value="10000+">$10,000+</option>
          <option value="bundle">{t('budgetBundle')}</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="inquiry-msg" className="mb-2 block text-sm font-medium">{t('messageLabel')}</label>
        <textarea
          id="inquiry-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder={t('messagePlaceholder')}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading' || !email || selectedDomains.length === 0}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-6 py-3 text-sm font-medium text-amber-200 transition-all duration-300 hover:border-amber-500/50 hover:bg-amber-500/20 disabled:opacity-50"
      >
        {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {status === 'loading' ? t('submitting') : t('submitInquiry')}
      </button>

      {status === 'success' && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-green/20 bg-accent-green/10 px-4 py-3 text-sm text-accent-green">
          <CheckCircle size={16} /> {t('successMessage')}
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-red/20 bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
          <AlertCircle size={16} /> {t('errorMessage')}
        </div>
      )}
    </form>
  );
}
