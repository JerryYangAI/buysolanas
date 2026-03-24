import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ALL_DOMAINS, FOR_SALE_DOMAINS } from '@/lib/domain-config';
import DomainCluster from '@/components/DomainCluster';
import DomainInquiryForm from './DomainInquiryForm';
import { ExternalLink, Shield, Zap, Globe } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh-CN';
  return {
    title: isZh ? 'Solana 生态域名包 · 限时出售' : 'Solana Domain Portfolio · For Sale',
    description: isZh
      ? '精选 9 个 Solana 相关优质域名出售，涵盖质押、AI、企业等赛道'
      : '9 premium Solana-related domains for sale covering staking, AI, enterprise, and more',
    alternates: {
      canonical: `${BASE_URL}/${locale}/domains`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/domains`])
      ),
    },
  };
}

export default async function DomainsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('domains');
  const isZh = locale === 'zh-CN';

  return (
    <div>
      <div className="container-custom py-12 md:py-20">
        {/* Hero */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-amber-400">
            {t('badge')}
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight gradient-text sm:text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <p className="text-base text-foreground-secondary sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Value props */}
        <div className="mx-auto mb-16 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: Globe, title: t('valueSeo'), desc: t('valueSeoDesc') },
            { icon: Zap, title: t('valueBrand'), desc: t('valueBrandDesc') },
            { icon: Shield, title: t('valueTrust'), desc: t('valueTrustDesc') },
          ].map((v, i) => (
            <div key={i} className="glass-card p-5 text-center">
              <v.icon size={24} className="mx-auto mb-3 text-amber-400" />
              <h3 className="mb-1 text-sm font-semibold">{v.title}</h3>
              <p className="text-xs text-foreground-secondary">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Domain cards */}
        <div className="mx-auto mb-16 max-w-5xl">
          <h2 className="mb-6 text-xl font-bold">{t('portfolioTitle')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FOR_SALE_DOMAINS.map((d) => (
              <div
                key={d.domain}
                className="group rounded-xl border border-amber-500/15 bg-amber-500/[0.02] p-5 transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/[0.05]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-2xl">{d.icon}</span>
                  <div>
                    <p className="font-mono text-sm font-bold text-amber-200">{d.domain}</p>
                    <p className="text-xs text-foreground-tertiary">
                      .{d.domain.split('.').pop()} {isZh ? '域名' : 'domain'}
                    </p>
                  </div>
                </div>
                <p className="mb-2 text-sm font-medium">{isZh ? d.sloganZh : d.slogan}</p>
                <p className="mb-3 text-xs text-foreground-secondary">
                  {isZh ? d.descriptionZh : d.description}
                </p>
                <a
                  href={`https://${d.domain}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 text-xs text-amber-400 transition-colors hover:text-amber-300"
                >
                  {isZh ? '访问站点' : 'Visit site'} <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bundle offer */}
        <div className="mx-auto mb-16 max-w-2xl rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-8 text-center">
          <h3 className="mb-2 text-lg font-bold text-amber-200">{t('bundleTitle')}</h3>
          <p className="mb-4 text-sm text-foreground-secondary">{t('bundleDesc')}</p>
          <div className="flex justify-center gap-4 text-xs text-foreground-tertiary">
            <span>✓ {t('bundlePerk1')}</span>
            <span>✓ {t('bundlePerk2')}</span>
            <span>✓ {t('bundlePerk3')}</span>
          </div>
        </div>

        {/* Inquiry form */}
        <div className="mx-auto max-w-xl" id="inquire">
          <h2 className="mb-6 text-center text-xl font-bold">{t('inquiryTitle')}</h2>
          <DomainInquiryForm />
        </div>
      </div>

      <DomainCluster locale={locale} />
    </div>
  );
}
