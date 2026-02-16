import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mt-auto border-t border-foreground-tertiary/20">
      <div className="container-custom py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-foreground-secondary">{t('copyright')}</p>
          <p className="text-center text-xs text-foreground-tertiary md:text-right">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
