import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mt-auto">
      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-blue/20 to-transparent" />
      <div className="border-t border-[var(--color-glass-border)]">
        <div className="container-custom py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground-secondary">Buysolanas</span>
              <span className="text-xs text-foreground-tertiary">{t('copyright')}</span>
            </div>
            <p className="text-center text-xs text-foreground-tertiary md:text-right">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
