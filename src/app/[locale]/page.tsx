import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

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

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="container-custom py-16 md:py-24">
      {/* Hero Section */}
      <section className="mx-auto mb-24 max-w-4xl text-center">
        <div className="pb-16">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' } as React.CSSProperties}>
            {t('heroTitle')}
          </h1>
          <p className="mb-8 text-lg text-foreground-secondary sm:text-xl"
             style={{ textWrap: 'balance' } as React.CSSProperties}>
            {t('heroSubtitle')}
          </p>
          <Link
            href="/start"
            className="inline-block rounded-sm bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-foreground-secondary"
          >
            {t('heroCta')}
          </Link>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        <div className="rounded-sm border border-foreground-tertiary/20 bg-background-secondary p-6 transition-colors hover:border-foreground-tertiary/40">
          <h3 className="mb-3 text-xl font-semibold">{t('quickStartTitle')}</h3>
          <p className="mb-4 text-foreground-secondary">{t('quickStartDesc')}</p>
          <Link
            href="/start"
            className="text-foreground underline decoration-foreground-tertiary underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {t('quickStartLink')} &rarr;
          </Link>
        </div>
        <div className="rounded-sm border border-foreground-tertiary/20 bg-background-secondary p-6 transition-colors hover:border-foreground-tertiary/40">
          <h3 className="mb-3 text-xl font-semibold">{t('courseTitle')}</h3>
          <p className="mb-4 text-foreground-secondary">{t('courseDesc')}</p>
          <Link
            href="/course"
            className="text-foreground underline decoration-foreground-tertiary underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {t('courseLink')} &rarr;
          </Link>
        </div>
        <div className="rounded-sm border border-foreground-tertiary/20 bg-background-secondary p-6 transition-colors hover:border-foreground-tertiary/40">
          <h3 className="mb-3 text-xl font-semibold">{t('pricesTitle')}</h3>
          <p className="mb-4 text-foreground-secondary">{t('pricesDesc')}</p>
          <Link
            href="/prices"
            className="text-foreground underline decoration-foreground-tertiary underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {t('pricesLink')} &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
