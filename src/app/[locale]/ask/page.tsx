import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import AskForm from './AskForm';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('ask');
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/ask`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/ask`])
      ),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}/${locale}/ask`,
    },
  };
}

export default async function AskPage() {
  const t = await getTranslations('ask');

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h1>
          <p className="text-foreground-secondary">{t('description')}</p>
        </div>
        <AskForm />
      </div>
    </div>
  );
}
