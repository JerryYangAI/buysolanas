import { getCurrentDomain, getDomainConfig, MAIN_DOMAIN, ALL_DOMAINS, type DomainConfig } from '@/lib/domain-config';
import DomainCluster from '@/components/DomainCluster';
import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';

function getConfig(): DomainConfig {
  const domain = getCurrentDomain();
  return getDomainConfig(domain) ?? getDomainConfig('buysolana.ai')!;
}

export function generateMetadata(): Metadata {
  const config = getConfig();
  return {
    title: `${config.name} — ${config.slogan}`,
    description: config.description,
  };
}

export default function LandingPage() {
  const config = getConfig();
  const mainSiteUrl = `https://${MAIN_DOMAIN}`;

  return (
    <div className="-mt-20 pt-20">
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
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full blur-[120px]" style={{ background: `${config.accentColor}10` }} />
          <div className="absolute right-1/4 top-32 h-[400px] w-[400px] rounded-full bg-accent-purple/[0.05] blur-[120px]" />
        </div>

        <div className="container-custom relative mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight gradient-text sm:text-5xl lg:text-6xl">
            {config.sloganZh}
          </h1>
          <p className="mb-4 text-lg text-foreground-secondary">{config.slogan}</p>
          <p className="mx-auto mb-10 max-w-lg text-base text-foreground-secondary">{config.descriptionZh}</p>

          <div className="flex flex-wrap justify-center gap-3">
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
