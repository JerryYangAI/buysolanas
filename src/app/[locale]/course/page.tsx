import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllContentMeta } from '@/lib/mdx';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { BookOpen, Lock } from 'lucide-react';

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
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/course`])),
    },
    openGraph: { title: t('title'), description: t('description'), url: `${BASE_URL}/${locale}/course` },
  };
}

const levelConfig = [
  {
    key: 'level1',
    level: 1,
    color: 'bg-sol-green/10 text-sol-green border-sol-green/20',
    numColor: 'from-sol-green/80 to-sol-green',
    icon: '🌱',
  },
  {
    key: 'level2',
    level: 2,
    color: 'bg-sol-blue/10 text-sol-blue border-sol-blue/20',
    numColor: 'from-sol-blue/80 to-sol-blue',
    icon: '🚀',
  },
  {
    key: 'level3',
    level: 3,
    color: 'bg-sol-purple/10 text-[#B87FFF] border-sol-purple/20',
    numColor: 'from-sol-purple/80 to-sol-purple',
    icon: '⚡',
  },
];

export default async function CoursePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('course');
  const lessons = getAllContentMeta('course', locale);

  // Group lessons by level (from frontmatter level field, default to 1)
  const grouped = levelConfig.map((lc) => ({
    ...lc,
    lessons: lessons.filter((l) => {
      // Try to determine level from slug pattern or order
      const order = l.order ?? 99;
      if (lc.level === 1) return order <= 6;
      if (lc.level === 2) return order >= 7 && order <= 12;
      return order >= 13;
    }),
  }));

  return (
    <div className="container-custom py-12 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-sol-purple">{t('label')}</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight gradient-text-subtle sm:text-4xl">
          {t('title')}
        </h1>
        <p className="max-w-xl text-foreground-secondary">{t('description')}</p>
      </div>

      {/* Course stats */}
      <div className="mb-10 flex flex-wrap gap-6">
        <div className="glass-card flex items-center gap-3 px-4 py-3">
          <span className="text-lg">📚</span>
          <div>
            <p className="text-sm font-semibold">{lessons.length}</p>
            <p className="text-xs text-foreground-secondary">{t('totalLessons')}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 px-4 py-3">
          <span className="text-lg">⏱</span>
          <div>
            <p className="text-sm font-semibold">{t('estimatedTime')}</p>
            <p className="text-xs text-foreground-secondary">{t('readingTime')}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 px-4 py-3">
          <span className="text-lg">🎯</span>
          <div>
            <p className="text-sm font-semibold">3</p>
            <p className="text-xs text-foreground-secondary">{t('levels')}</p>
          </div>
        </div>
      </div>

      {/* Level sections */}
      <div className="space-y-12">
        {grouped.map((group) => (
          <section key={group.key}>
            {/* Level header */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-2xl">{group.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{t(`${group.key}Title`)}</h2>
                <p className="text-sm text-foreground-secondary">{t(`${group.key}Desc`)}</p>
              </div>
              <span className={`ml-auto rounded-lg border px-3 py-1 text-xs font-medium ${group.color}`}>
                {t(`${group.key}Tag`)}
              </span>
            </div>

            {/* Lesson cards */}
            {group.lessons.length > 0 ? (
              <div className="flex flex-col gap-3 max-w-3xl">
                {group.lessons.map((lesson, i) => (
                  <Link
                    key={lesson.slug}
                    href={`/course/${lesson.slug}`}
                    className="group flex items-start gap-4 glass-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sol-purple/30"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${group.numColor} text-sm font-bold text-white`}>
                      {lesson.order ?? i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-medium transition-colors group-hover:text-white">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary line-clamp-1">
                        {lesson.description}
                      </p>
                    </div>
                    <BookOpen size={18} className="mt-1 shrink-0 text-foreground-tertiary transition-colors group-hover:text-sol-purple" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-card flex items-center gap-3 p-5 opacity-60 max-w-3xl">
                <Lock size={16} className="text-foreground-tertiary" />
                <p className="text-sm text-foreground-secondary">{t('comingSoon')}</p>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
