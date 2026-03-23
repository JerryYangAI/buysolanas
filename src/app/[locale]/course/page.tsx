import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllContentMeta } from '@/lib/mdx';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { BookOpen } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('course');
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/course`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/course`])
      ),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}/${locale}/course`,
    },
  };
}

export default async function CoursePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('course');
  const lessons = getAllContentMeta('course', locale);

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold tracking-tight gradient-text sm:text-4xl">
          {t('title')}
        </h1>
        <p className="text-foreground-secondary">{t('description')}</p>
      </div>

      <div className="flex flex-col gap-4 max-w-2xl">
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.slug}
            href={`/course/${lesson.slug}`}
            className="group flex items-start gap-4 glass-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple text-sm font-bold text-white">
              {i + 1}
            </div>
            <div>
              <h2 className="mb-1 font-medium transition-colors group-hover:text-white">
                {lesson.title}
              </h2>
              <p className="text-sm text-foreground-secondary">
                {lesson.description}
              </p>
            </div>
            <BookOpen
              size={18}
              className="ml-auto mt-1 shrink-0 text-foreground-tertiary transition-colors group-hover:text-accent-blue"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
