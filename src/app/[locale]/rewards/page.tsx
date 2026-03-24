import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Star, BookOpen, CheckCircle, Mail, Users, Trophy, Gift, Zap } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('rewards');
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/rewards`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/rewards`])),
    },
  };
}

const earnItems = [
  { icon: Star, points: 5, key: 'dailyLogin' },
  { icon: BookOpen, points: 20, key: 'completeLesson' },
  { icon: CheckCircle, points: 15, key: 'passQuiz' },
  { icon: Trophy, points: 100, key: 'completeLevel' },
  { icon: Mail, points: 30, key: 'subscribe' },
  { icon: Users, points: 50, key: 'referFriend' },
];

const redeemItems = [
  { points: 500, key: 'nftBadge', icon: '🏅' },
  { points: 1000, key: 'stickerPack', icon: '🎁' },
  { points: 2000, key: 'feeDiscount', icon: '💰' },
  { points: 5000, key: 'earlyAccess', icon: '🔑' },
];

export default async function RewardsPage() {
  const t = await getTranslations('rewards');

  return (
    <div className="container-custom py-12 md:py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-sol-purple">{t('label')}</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight gradient-text-subtle sm:text-4xl">{t('title')}</h1>
        <p className="mx-auto max-w-lg text-foreground-secondary">{t('description')}</p>
      </div>

      {/* Points overview card */}
      <div className="mx-auto mb-12 max-w-md">
        <div className="glass-card overflow-hidden">
          <div className="bg-gradient-to-r from-sol-purple/20 to-sol-green/20 p-6 text-center">
            <Zap size={32} className="mx-auto mb-2 text-sol-purple" />
            <p className="text-4xl font-bold">0</p>
            <p className="text-sm text-foreground-secondary">{t('totalPoints')}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-foreground-tertiary">{t('loginToTrack')}</p>
            <p className="mt-1 text-xs text-sol-purple">{t('comingSoonAuth')}</p>
          </div>
        </div>
      </div>

      {/* How to earn */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-bold">{t('earnTitle')}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {earnItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="glass-card flex items-center gap-4 p-5 transition-all hover:border-sol-purple/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sol-purple/10">
                  <Icon size={20} className="text-sol-purple" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t(`earn_${item.key}`)}</p>
                </div>
                <span className="shrink-0 rounded-full bg-sol-green/10 px-3 py-1 text-xs font-bold text-sol-green">
                  +{item.points}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rewards to redeem */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-bold">{t('redeemTitle')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {redeemItems.map((item) => (
            <div key={item.key} className="glass-card p-6 transition-all hover:border-sol-purple/30">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                <span className="rounded-full bg-sol-purple/10 px-3 py-1 text-xs font-bold text-sol-purple">
                  {item.points.toLocaleString()} pts
                </span>
              </div>
              <h3 className="mb-1 font-semibold">{t(`redeem_${item.key}`)}</h3>
              <p className="text-xs text-foreground-secondary">{t(`redeem_${item.key}_desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/start"
          className="inline-block rounded-lg bg-gradient-to-br from-sol-purple to-[#6E2FCC] px-8 py-3.5 font-medium text-white shadow-[0_4px_24px_rgba(153,69,255,0.3)] transition-all hover:-translate-y-0.5"
        >
          {t('startEarning')}
        </Link>
      </div>
    </div>
  );
}
