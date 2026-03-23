import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getContentItem, getAllSlugs, extractToc } from '@/lib/mdx';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import MdxContent from '@/components/mdx/MdxContent';
import Toc from '@/components/mdx/Toc';
import Disclaimer from '@/components/mdx/Disclaimer';
import { ArrowLeft } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string; term: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllSlugs('glossary', 'en');
  return slugs.map((term) => ({ term }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, term } = await params;
  const item = getContentItem('glossary', locale, term);
  if (!item) return { title: 'Not Found' };
  return {
    title: item.meta.title,
    description: item.meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/glossary/${term}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/glossary/${term}`])
      ),
    },
    openGraph: {
      title: item.meta.title,
      description: item.meta.description,
      url: `${BASE_URL}/${locale}/glossary/${term}`,
      type: 'article',
    },
  };
}

function generateJsonLd(
  item: { meta: { title: string; description: string } },
  locale: string,
  term: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: item.meta.title,
    description: item.meta.description,
    url: `${BASE_URL}/${locale}/glossary/${term}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Solana Glossary',
      url: `${BASE_URL}/${locale}/glossary`,
    },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { locale, term } = await params;
  const t = await getTranslations('glossary');
  const item = getContentItem('glossary', locale, term);

  if (!item) notFound();

  const toc = extractToc(item.content);
  const jsonLd = generateJsonLd(item, locale, term);

  return (
    <div className="container-custom py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <Link
          href="/glossary"
          className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          {t('backToList')}
        </Link>
      </div>

      <div className="flex gap-12">
        {/* Main content */}
        <article className="min-w-0 flex-1">
          <header className="mb-8">
            {item.meta.category && (
              <span className="mb-2 inline-block rounded bg-background-tertiary px-2 py-0.5 text-xs text-foreground-tertiary">
                {item.meta.category}
              </span>
            )}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {item.meta.title}
            </h1>
            {item.meta.description && (
              <p className="mt-3 text-foreground-secondary">
                {item.meta.description}
              </p>
            )}
          </header>

          <MdxContent source={item.content} />

          {/* Related terms */}
          {item.meta.related && item.meta.related.length > 0 && (
            <div className="mt-10 border-t border-foreground-tertiary/20 pt-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
                {t('relatedTerms')}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.meta.related.map((slug) => (
                  <Link
                    key={slug}
                    href={`/glossary/${slug}`}
                    className="rounded-sm border border-foreground-tertiary/20 px-3 py-1.5 text-sm text-foreground-secondary transition-colors hover:border-foreground-tertiary/40 hover:text-foreground"
                  >
                    {slug}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Disclaimer />
        </article>

        {/* Sidebar TOC — desktop only */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <Toc items={toc} label={t('toc')} />
        </aside>
      </div>
    </div>
  );
}
