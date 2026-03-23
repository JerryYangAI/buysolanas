import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  const t = useTranslations('disclaimer');

  return (
    <aside className="mt-12 rounded-sm border border-foreground-tertiary/20 bg-background-secondary px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
        <div className="text-sm text-foreground-secondary">
          <p className="mb-1 font-medium text-foreground">{t('title')}</p>
          <p>{t('body')}</p>
        </div>
      </div>
    </aside>
  );
}
