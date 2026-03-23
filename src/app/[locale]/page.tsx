import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Zap, BookOpen, TrendingUp } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('home');
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle'),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
    openGraph: {
      title: t('heroTitle'),
      description: t('heroSubtitle'),
      url: `${BASE_URL}/${locale}`,
    },
  };
}

const cardIcons = [Zap, BookOpen, TrendingUp];

export default function HomePage() {
  const t = useTranslations('home');

  const cards = [
    { title: t('quickStartTitle'), desc: t('quickStartDesc'), link: t('quickStartLink'), href: '/start' },
    { title: t('courseTitle'), desc: t('courseDesc'), link: t('courseLink'), href: '/course' },
    { title: t('pricesTitle'), desc: t('pricesDesc'), link: t('pricesLink'), href: '/prices' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-accent-blue/[0.07] blur-[120px]" />
        <div className="absolute right-1/4 top-32 h-[500px] w-[500px] rounded-full bg-accent-purple/[0.05] blur-[120px]" />
      </div>

      <div className="container-custom relative py-20 md:py-32">
        {/* Hero Section */}
        <section className="mx-auto mb-28 max-w-3xl text-center">
          <div className="pb-8">
            <h1
              className="animate-fade-in-up mb-6 text-4xl font-bold tracking-tight gradient-text sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {t('heroTitle')}
            </h1>
            <p
              className="animate-fade-in-up-delay-1 mb-10 text-lg text-foreground-secondary sm:text-xl"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {t('heroSubtitle')}
            </p>
            <div className="animate-fade-in-up-delay-2">
              <Link
                href="/start"
                className="inline-block rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-3.5 font-medium text-white shadow-lg shadow-accent-blue/20 transition-all duration-300 hover:shadow-xl hover:shadow-accent-blue/30 hover:brightness-110"
              >
                {t('heroCta')}
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = cardIcons[i];
            return (
              <div
                key={card.href}
                className={`animate-fade-in-up-delay-${i + 1} glass-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20`}
              >
                <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 p-2.5">
                  <Icon size={20} className="text-accent-blue" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                <p className="mb-4 text-sm text-foreground-secondary">{card.desc}</p>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1 text-sm text-accent-blue transition-colors hover:text-white"
                >
                  {card.link} <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
                </Link>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
