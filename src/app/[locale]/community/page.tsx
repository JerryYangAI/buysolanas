import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Question } from '@/lib/supabase';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { MessageSquare, Wallet, Target, HelpCircle, Plus } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('community');
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/community`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/community`])
      ),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}/${locale}/community`,
    },
  };
}

async function getQuestions(): Promise<Question[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }

  return (data as Question[]) ?? [];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function CommunityPage() {
  const t = await getTranslations('community');
  const questions = await getQuestions();

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t('title')}
            </h1>
            <p className="text-foreground-secondary">{t('description')}</p>
          </div>
          <Link
            href="/ask"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground-secondary"
          >
            <Plus size={16} />
            {t('askButton')}
          </Link>
        </div>

        {/* Empty state */}
        {questions.length === 0 && (
          <div className="rounded-sm border border-foreground-tertiary/20 bg-background-secondary px-6 py-12 text-center">
            <MessageSquare
              size={32}
              className="mx-auto mb-4 text-foreground-tertiary"
            />
            <p className="mb-2 text-foreground-secondary">{t('empty')}</p>
            <Link
              href="/ask"
              className="text-sm text-accent-blue underline underline-offset-4"
            >
              {t('beFirst')}
            </Link>
          </div>
        )}

        {/* Question cards */}
        <div className="flex flex-col gap-4">
          {questions.map((q) => (
            <article
              key={q.id}
              className="rounded-sm border border-foreground-tertiary/20 bg-background-secondary p-5 transition-colors hover:border-foreground-tertiary/40"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-background-tertiary px-2 py-1 text-xs text-foreground-secondary">
                  <Wallet size={12} />
                  {q.wallet_type}
                </div>
                <span className="text-xs text-foreground-tertiary">
                  {timeAgo(q.created_at)}
                </span>
              </div>

              <div className="mb-2 flex items-start gap-2">
                <Target
                  size={14}
                  className="mt-0.5 shrink-0 text-foreground-tertiary"
                />
                <p className="text-sm">
                  <span className="text-foreground-tertiary">
                    {t('goalLabel')}:{' '}
                  </span>
                  {q.goal}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <HelpCircle
                  size={14}
                  className="mt-0.5 shrink-0 text-foreground-tertiary"
                />
                <p className="text-sm text-foreground-secondary">
                  {q.stuck_point}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
