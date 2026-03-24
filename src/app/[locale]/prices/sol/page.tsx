import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import SolDetailClient from './SolDetailClient';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('solDetail');
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/prices/sol`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/prices/sol`])),
    },
  };
}

export default async function SolDetailPage() {
  const t = await getTranslations('solDetail');

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-sol-purple">{t('label')}</p>
        <h1 className="mb-2 text-2xl font-bold tracking-tight gradient-text-subtle sm:text-3xl">{t('title')}</h1>
        <p className="text-sm text-foreground-secondary">{t('description')}</p>
      </div>
      <SolDetailClient />
    </div>
  );
}
