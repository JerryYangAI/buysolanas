import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { BookOpen, Shield, Rocket, Check } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('start');
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/start`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/start`])
      ),
    },
  };
}

const stepIcons = [BookOpen, Shield, Rocket];

export default function StartPage() {
  const t = useTranslations('start');

  const prerequisites = [
    t('prereq1'),
    t('prereq2'),
    t('prereq3'),
  ];

  const steps = [
    { title: t('step1Title'), desc: t('step1Desc'), href: '/course/lesson-1' },
    { title: t('step2Title'), desc: t('step2Desc'), href: '/glossary' },
    { title: t('step3Title'), desc: t('step3Desc'), href: '/course' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/3 top-0 h-[500px] w-[500px] rounded-full bg-accent-blue/[0.06] blur-[120px]" />
        <div className="absolute right-1/3 top-48 h-[400px] w-[400px] rounded-full bg-accent-purple/[0.04] blur-[120px]" />
      </div>

      <div className="container-custom relative py-16 md:py-24">
        {/* Hero */}
        <section className="mx-auto mb-16 max-w-2xl text-center">
          <h1 className="animate-fade-in-up mb-4 text-3xl font-bold tracking-tight gradient-text sm:text-4xl lg:text-5xl">
            {t('heroTitle')}
          </h1>
          <p className="animate-fade-in-up-delay-1 text-base text-foreground-secondary sm:text-lg" style={{ textWrap: 'balance' } as React.CSSProperties}>
            {t('heroSubtitle')}
          </p>
        </section>

        {/* Prerequisites */}
        <section className="animate-fade-in-up-delay-1 mx-auto mb-16 max-w-xl">
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-semibold">{t('prerequisitesTitle')}</h2>
            <ul className="space-y-3">
              {prerequisites.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground-secondary">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-green/20">
                    <Check size={12} className="text-accent-green" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Learning Path Steps */}
        <section className="mx-auto mb-16 max-w-4xl">
          <h2 className="animate-fade-in-up mb-8 text-center text-xl font-semibold">{t('stepsTitle')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <Link
                  key={i}
                  href={step.href}
                  className={`animate-fade-in-up-delay-${i + 1} glass-card group block p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <Icon size={18} className="text-foreground-tertiary transition-colors group-hover:text-accent-blue" />
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-sm text-foreground-secondary">{step.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="animate-fade-in-up-delay-3 text-center">
          <Link
            href="/course/lesson-1"
            className="inline-block rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-3.5 font-medium text-white shadow-lg shadow-accent-blue/20 transition-all duration-300 hover:shadow-xl hover:shadow-accent-blue/30 hover:brightness-110"
          >
            {t('ctaButton')}
          </Link>
        </section>
      </div>
    </div>
  );
}
