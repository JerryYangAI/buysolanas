import { getCurrentDomain, getDomainConfig, MAIN_DOMAIN, ALL_DOMAINS, type DomainConfig } from '@/lib/domain-config';
import DomainCluster from '@/components/DomainCluster';
import { ExternalLink } from 'lucide-react';

export const runtime = 'edge';

function getConfig(): DomainConfig {
  const domain = getCurrentDomain();
  return getDomainConfig(domain) ?? getDomainConfig('buysolana.ai')!;
}

export function generateMetadata() {
  const config = getConfig();
  return {
    title: `${config.name} — ${config.slogan}`,
    description: config.description,
    openGraph: {
      title: `${config.name} — ${config.slogan}`,
      description: config.description,
      url: `https://${config.domain}`,
    },
  };
}

export default function LandingPage() {
  const config = getConfig();
  const mainSiteUrl = `https://${MAIN_DOMAIN}`;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F8]" style={{ fontFamily: "'Inter', 'Noto Sans SC', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0A0F]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <span className="text-lg font-bold">{config.name}</span>
          </div>
          <a
            href={mainSiteUrl}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            访问主站 →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full blur-[120px]" style={{ background: `${config.accentColor}10` }} />
          <div className="absolute right-1/4 top-32 h-[400px] w-[400px] rounded-full bg-purple-500/[0.05] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {config.sloganZh}
          </h1>
          <p className="mb-4 text-lg text-[#8888AA]">{config.slogan}</p>
          <p className="mx-auto mb-10 max-w-lg text-base text-[#8888AA]">{config.descriptionZh}</p>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={mainSiteUrl}
              className="rounded-lg px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:brightness-110"
              style={{ background: `linear-gradient(135deg, ${config.accentColor}, #6E2FCC)`, boxShadow: `0 4px 24px ${config.accentColor}30` }}
            >
              访问 BuySolanas 主站 →
            </a>
            <a
              href={`${mainSiteUrl}/zh-CN/domains#inquire`}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/80 transition-all hover:border-white/[0.16] hover:bg-white/[0.08]"
            >
              获取域名报价
            </a>
          </div>
        </div>
      </section>

      {/* For Sale Banner */}
      {config.forSale && (
        <section className="border-y border-amber-500/20 bg-amber-500/[0.03] py-8">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-amber-400">域名出售中</p>
            <h2 className="mb-2 text-xl font-bold">
              <span className="font-mono text-amber-200">{config.domain}</span> 正在出售
            </h2>
            <p className="mb-4 text-sm text-[#8888AA]">
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
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="mb-8 text-center text-2xl font-bold">潜在用途</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {config.features.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.08] bg-[#111118] p-6 transition-all duration-300 hover:border-white/[0.12]"
                >
                  <span className="mb-3 block text-2xl">{f.icon}</span>
                  <h3 className="mb-2 text-base font-semibold">{f.titleZh}</h3>
                  <p className="text-sm text-[#8888AA]">{f.descZh}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Domain Cluster */}
      <DomainCluster locale="zh-CN" />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#111118] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="mb-2 text-sm text-[#8888AA]">
            Powered by{' '}
            <a href={mainSiteUrl} className="font-medium text-white/80 underline underline-offset-2 transition-colors hover:text-white">
              BuySolanas.com
            </a>
          </p>
          <p className="text-xs text-[#44445A]">
            © 2025 BuySolanas.com · 仅供教育目的，不构成投资建议
          </p>
          {/* Full domain links for SEO */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {ALL_DOMAINS.map((d) => (
              <a
                key={d.domain}
                href={`https://${d.domain}`}
                className="text-xs text-[#44445A] transition-colors hover:text-[#8888AA]"
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
