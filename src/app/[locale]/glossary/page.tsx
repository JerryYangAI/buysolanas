import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllContentMeta } from '@/lib/mdx';
import { routing } from '@/i18n/routing';
import GlossaryClient from './GlossaryClient';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('glossary');
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/glossary`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/glossary`])
      ),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}/${locale}/glossary`,
    },
  };
}

export default async function GlossaryPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('glossary');
  const terms = getAllContentMeta('glossary', locale);

  // Extract all unique categories
  const categories = Array.from(
    new Set(terms.map((t) => t.category).filter(Boolean))
  ).sort() as string[];

  // Extract first letters for A-Z nav
  const letters = Array.from(
    new Set(terms.map((t) => t.title[0].toUpperCase()))
  ).sort();

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-sol-purple">{t('label')}</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight gradient-text-subtle sm:text-4xl">
          {t('title')}
        </h1>
        <p className="text-foreground-secondary">{t('description')}</p>
      </div>

      <GlossaryClient
        terms={terms}
        categories={categories}
        letters={letters}
        translations={{
          searchPlaceholder: t('searchPlaceholder'),
          allCategories: t('allCategories'),
          noResults: t('noResults'),
          solanaTag: t('solanaTag'),
        }}
      />
    </div>
  );
}
