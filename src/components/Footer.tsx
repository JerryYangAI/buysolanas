import { useTranslations } from 'next-intl';
import { ALL_DOMAINS } from '@/lib/domain-config';
import NewsletterForm from '@/components/NewsletterForm';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-[var(--color-glass-border)] bg-background-secondary">
      <div className="container-custom py-12">
        {/* Multi-column grid */}
        <div className="mb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="mb-3 gradient-text text-xl font-bold">BuySolanas</p>
            <p className="text-[13px] leading-relaxed text-foreground-secondary">
              {t('brandDesc')}
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-foreground-secondary">{t('colLearn')}</h4>
            <ul className="space-y-2.5">
              {['start', 'course', 'glossary'].map((k) => (
                <li key={k}>
                  <a href={`/en/${k}`} className="text-[13px] text-foreground-secondary transition-colors hover:text-foreground">
                    {t(`link_${k}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-foreground-secondary">{t('colEco')}</h4>
            <ul className="space-y-2.5">
              {['prices', 'community', 'domains'].map((k) => (
                <li key={k}>
                  <a href={`/en/${k}`} className="text-[13px] text-foreground-secondary transition-colors hover:text-foreground">
                    {t(`link_${k}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + About */}
          <div>
            <NewsletterForm variant="inline" />
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-foreground-secondary">{t('colAbout')}</h4>
              <ul className="space-y-2">
                <li><span className="text-[13px] text-foreground-secondary">{t('linkDisclaimer')}</span></li>
                <li><span className="text-[13px] text-foreground-secondary">{t('linkPrivacy')}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Domain cluster links */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {ALL_DOMAINS.map((d) => (
            <a
              key={d.domain}
              href={`https://${d.domain}`}
              className="text-xs text-foreground-tertiary transition-colors hover:text-foreground-secondary"
              target="_blank"
              rel="noopener"
            >
              {d.domain}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--color-glass-border)] pt-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-foreground-tertiary">{t('copyright')}</p>
            <p className="text-xs text-foreground-tertiary">{t('disclaimer')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
