import { FOR_SALE_DOMAINS } from '@/lib/domain-config';
import { Link } from '@/i18n/navigation';
import { ExternalLink } from 'lucide-react';

export default function DomainShowcase({ locale = 'en' }: { locale?: string }) {
  const isZh = locale === 'zh-CN';

  return (
    <section className="relative overflow-hidden py-16">
      {/* Amber glow background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-[120px]" />
      </div>

      <div className="container-custom relative">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-amber-400">
            {isZh ? '限时出售' : 'Available Now'}
          </p>
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            {isZh ? 'Solana 生态域名包' : 'Solana Domain Portfolio'}
          </h2>
          <p className="mx-auto max-w-lg text-sm text-foreground-secondary">
            {isZh
              ? '精选 9 个 Solana 相关优质域名，涵盖质押、AI、企业服务等热门赛道。支持单独购买或打包优惠。'
              : '9 premium Solana-related domains covering staking, AI, enterprise, and more. Available individually or as a bundle.'}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FOR_SALE_DOMAINS.map((d) => (
            <a
              key={d.domain}
              href={`https://${d.domain}`}
              target="_blank"
              rel="noopener"
              className="group rounded-xl border border-amber-500/15 bg-amber-500/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/30 hover:bg-amber-500/[0.06] hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-lg">{d.icon}</span>
                <ExternalLink size={14} className="text-foreground-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mb-1 font-mono text-sm font-semibold text-amber-200">{d.domain}</p>
              <p className="text-xs text-foreground-secondary">{isZh ? d.sloganZh : d.slogan}</p>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/domains"
            className="inline-block rounded-lg border border-amber-500/30 bg-amber-500/10 px-6 py-3 text-sm font-medium text-amber-200 transition-all duration-300 hover:border-amber-500/50 hover:bg-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10"
          >
            {isZh ? '查看完整域名包 · 获取报价' : 'View Full Portfolio · Get Quote'}
          </Link>
        </div>
      </div>
    </section>
  );
}
