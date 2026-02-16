import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllContentMeta } from '@/lib/mdx';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { BookMarked } from 'lucide-react';

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

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </h1>
        <p className="text-foreground-secondary">{t('description')}</p>
      </div>

      <div className="grid gap-4 max-w-2xl">
        {terms.map((term) => (
          <Link
            key={term.slug}
            href={`/glossary/${term.slug}`}
            className="group flex items-start gap-4 rounded-sm border border-foreground-tertiary/20 bg-background-secondary p-5 transition-colors hover:border-foreground-tertiary/40"
          >
            <BookMarked
              size={18}
              className="mt-0.5 shrink-0 text-foreground-tertiary group-hover:text-foreground-secondary"
            />
            <div>
              <h2 className="mb-1 font-medium group-hover:text-foreground">
                {term.title}
              </h2>
              <p className="text-sm text-foreground-secondary">
                {term.description}
              </p>
              {term.category && (
                <span className="mt-2 inline-block rounded bg-background-tertiary px-2 py-0.5 text-xs text-foreground-tertiary">
                  {term.category}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
