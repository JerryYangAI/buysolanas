import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Zap, BookOpen, TrendingUp } from 'lucide-react';
import DomainShowcase from '@/components/DomainShowcase';
import DomainCluster from '@/components/DomainCluster';
import { getCurrentDomain, getDomainConfig, MAIN_DOMAIN, ALL_DOMAINS, type DomainConfig } from '@/lib/domain-config';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string }>;
};

function isSatellite(): boolean {
  return getCurrentDomain() !== MAIN_DOMAIN;
}

function getSatelliteConfig(): DomainConfig {
  const domain = getCurrentDomain();
  return getDomainConfig(domain) ?? getDomainConfig('buysolana.ai')!;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (isSatellite()) {
    const config = getSatelliteConfig();
    return {
      title: `${config.name} — ${config.slogan}`,
      description: config.description,
    };
  }

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

/* ============================================================
   卫星域名 Landing Page — 当 NEXT_PUBLIC_SITE_DOMAIN 不是主站时显示
   ============================================================ */
function SatelliteLanding() {
  const config = getSatelliteConfig();
  const mainSiteUrl = `https://${MAIN_DOMAIN}`;

  return (
    <div>
      {/* Override header with satellite nav */}
      <div className="fixed inset-x-0 top-0 z-[60] border-b border-[var(--color-glass-border)] bg-background/80 backdrop-blur-xl">
        <div className="container-custom flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <span className="text-lg font-bold">{config.name}</span>
          </div>
          <a
            href={mainSiteUrl}
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            访问主站 →
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pb-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full blur-[120px]" style={{ background: `${config.accentColor}10` }} />
          <div className="absolute right-1/4 top-32 h-[400px] w-[400px] rounded-full bg-accent-purple/[0.05] blur-[120px]" />
        </div>

        <div className="container-custom relative mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-in-up mb-6 text-4xl font-bold tracking-tight gradient-text sm:text-5xl lg:text-6xl">
            {config.sloganZh}
          </h1>
          <p className="animate-fade-in-up-delay-1 mb-4 text-lg text-foreground-secondary">{config.slogan}</p>
          <p className="animate-fade-in-up-delay-1 mx-auto mb-10 max-w-lg text-base text-foreground-secondary">{config.descriptionZh}</p>

          <div className="animate-fade-in-up-delay-2 flex flex-wrap justify-center gap-3">
            <a
              href={mainSiteUrl}
              className="inline-block rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent-blue/20 transition-all duration-300 hover:shadow-xl hover:brightness-110"
            >
              访问 BuySolanas 主站 →
            </a>
            <a
              href={`${mainSiteUrl}/zh-CN/domains#inquire`}
              className="rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-6 py-3 text-sm font-medium text-foreground-secondary transition-all hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-foreground"
            >
              获取域名报价
            </a>
          </div>
        </div>
      </section>

      {/* For Sale Banner */}
      {config.forSale && (
        <section className="border-y border-amber-500/20 bg-amber-500/[0.03] py-8">
          <div className="container-custom mx-auto max-w-3xl text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-amber-400">域名出售中</p>
            <h2 className="mb-2 text-xl font-bold">
              <span className="font-mono text-amber-200">{config.domain}</span> 正在出售
            </h2>
            <p className="mb-4 text-sm text-foreground-secondary">
              此域名是 Solana 生态域名包的一部分，可单独购买或与其他域名打包优惠购买。
            </p>
            <a
              href={`${mainSiteUrl}/zh-CN/domains#inquire`}
              className="inline-block rounded-lg border border-amber-500/30 bg-amber-500/10 px-6 py-2.5 text-sm font-medium text-amber-200 transition-all hover:border-amber-500/50 hover:bg-amber-500/20"
            >
              立即询价 →
            </a>
          </div>
        </section>
      )}

      {/* Features */}
      {config.features.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <h2 className="mb-8 text-center text-2xl font-bold">潜在用途</h2>
            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
              {config.features.map((f, i) => (
                <div key={i} className="glass-card p-6 transition-all duration-300 hover:bg-white/[0.06]">
                  <span className="mb-3 block text-2xl">{f.icon}</span>
                  <h3 className="mb-2 text-base font-semibold">{f.titleZh}</h3>
                  <p className="text-sm text-foreground-secondary">{f.descZh}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Domain Cluster */}
      <DomainCluster locale="zh-CN" />

      {/* Footer */}
      <footer className="border-t border-[var(--color-glass-border)] bg-background-secondary py-8">
        <div className="container-custom text-center">
          <p className="mb-2 text-sm text-foreground-secondary">
            Powered by{' '}
            <a href={mainSiteUrl} className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-white">
              BuySolanas.com
            </a>
          </p>
          <p className="text-xs text-foreground-tertiary">
            © 2025 BuySolanas.com · 仅供教育目的，不构成投资建议
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {ALL_DOMAINS.map((d) => (
              <a
                key={d.domain}
                href={`https://${d.domain}`}
                className="text-xs text-foreground-tertiary transition-colors hover:text-foreground-secondary"
                {...(d.domain !== config.domain ? { target: '_blank', rel: 'noopener' } : {})}
              >
                {d.domain}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   主站首页 — buysolanas.com
   ============================================================ */
function MainHomePage() {
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

      {/* Domain Portfolio Showcase */}
      <DomainShowcase locale="en" />

      {/* Domain Cluster Cross-links */}
      <DomainCluster locale="en" />
    </div>
  );
}

/* ============================================================
   路由分发：根据当前域名决定显示主站首页还是卫星 Landing
   ============================================================ */
export default function HomePage() {
  if (isSatellite()) {
    return <SatelliteLanding />;
  }
  return <MainHomePage />;
}
