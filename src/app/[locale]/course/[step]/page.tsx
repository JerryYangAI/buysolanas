import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getContentItem, getAllSlugs, extractToc } from '@/lib/mdx';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import MdxContent from '@/components/mdx/MdxContent';
import Toc from '@/components/mdx/Toc';
import Disclaimer from '@/components/mdx/Disclaimer';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string; step: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllSlugs('course', 'en');
  return slugs.map((step) => ({ step }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, step } = await params;
  const item = getContentItem('course', locale, step);
  if (!item) return { title: 'Not Found' };
  return {
    title: item.meta.title,
    description: item.meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/course/${step}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/course/${step}`])
      ),
    },
    openGraph: {
      title: item.meta.title,
      description: item.meta.description,
      url: `${BASE_URL}/${locale}/course/${step}`,
      type: 'article',
    },
  };
}

function generateJsonLd(
  item: { meta: { title: string; description: string; order?: number } },
  locale: string,
  step: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: item.meta.title,
    description: item.meta.description,
    provider: {
      '@type': 'Organization',
      name: 'Buysolanas',
      url: BASE_URL,
    },
    url: `${BASE_URL}/${locale}/course/${step}`,
    inLanguage: locale,
    isAccessibleForFree: true,
    courseCode: step,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT10M',
    },
  };
}

export default async function CourseStepPage({ params }: Props) {
  const { locale, step } = await params;
  const t = await getTranslations('course');
  const item = getContentItem('course', locale, step);

  if (!item) notFound();

  const toc = extractToc(item.content);
  const nextSlug = item.meta.next;
  const nextItem = nextSlug
    ? getContentItem('course', locale, nextSlug)
    : null;

  const jsonLd = generateJsonLd(item, locale, step);

  return (
    <div className="container-custom py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <Link
          href="/course"
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
            {item.meta.order && (
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent-blue">
                {t('lessonLabel', { order: String(item.meta.order) })}
              </p>
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

          {/* Next lesson link */}
          {nextItem && (
            <div className="mt-12 border-t border-foreground-tertiary/20 pt-6">
              <Link
                href={`/course/${nextSlug}`}
                className="group flex items-center justify-between rounded-sm border border-foreground-tertiary/20 bg-background-secondary p-5 transition-colors hover:border-foreground-tertiary/40"
              >
                <div>
                  <p className="mb-1 text-xs text-foreground-tertiary">
                    {t('nextLesson')}
                  </p>
                  <p className="font-medium group-hover:text-foreground">
                    {nextItem.meta.title}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-foreground-tertiary group-hover:text-foreground-secondary"
                />
              </Link>
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
