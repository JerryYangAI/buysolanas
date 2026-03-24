import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Space_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidgetLoader from '@/components/ChatWidgetLoader';
import TickerBar from '@/components/TickerBar';
import { getCurrentDomain, MAIN_DOMAIN } from '@/lib/domain-config';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | BuySolanas',
    default: 'BuySolanas — 从零到 Solana，你的 Web3 第一站',
  },
  description:
    '中文 Solana 教育与信息平台。课程、词汇表、实时行情、社区，一站搞定。',
  openGraph: {
    type: 'website',
    siteName: 'BuySolanas',
    locale: 'en',
    alternateLocale: ['zh-CN'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isSatellite = getCurrentDomain() !== MAIN_DOMAIN;

  return (
    <html lang={locale} className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            {/* Satellite domains render their own header inside page.tsx */}
            {!isSatellite && <Header />}
            {!isSatellite && <TickerBar />}
            <main className="flex-1">{children}</main>
            {!isSatellite && <Footer />}
          </div>
          {!isSatellite && <ChatWidgetLoader />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
