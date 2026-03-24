import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import SolPriceCard from '@/components/SolPriceCard';
import DomainShowcase from '@/components/DomainShowcase';
import DomainCluster from '@/components/DomainCluster';
import { getCurrentDomain, getDomainConfig, MAIN_DOMAIN, ALL_DOMAINS, type DomainConfig } from '@/lib/domain-config';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = { params: Promise<{ locale: string }> };

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
    return { title: `${config.name} — ${config.slogan}`, description: config.description };
  }
  const t = await getTranslations('home');
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle'),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}`])),
    },
    openGraph: { title: t('heroTitle'), description: t('heroSubtitle'), url: `${BASE_URL}/${locale}` },
  };
}

/* ============================================================
   卫星域名 Landing Page
   ============================================================ */
function SatelliteLanding() {
  const config = getSatelliteConfig();
  const mainSiteUrl = `https://${MAIN_DOMAIN}`;

  return (
    <div>
      <div className="fixed inset-x-0 top-0 z-[60] border-b border-[var(--color-glass-border)] bg-[rgba(10,10,15,0.85)] backdrop-blur-xl">
        <div className="container-custom flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <span className="text-lg font-bold">{config.name}</span>
          </div>
          <a href={mainSiteUrl} className="rounded-lg px-4 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-white/[0.06] hover:text-foreground">
            访问主站 →
          </a>
        </div>
      </div>

      <section className="relative overflow-hidden pt-32 pb-20 md:pb-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full blur-[120px]" style={{ background: `${config.accentColor}10` }} />
          <div className="absolute right-1/4 top-32 h-[400px] w-[400px] rounded-full bg-sol-green/[0.05] blur-[120px]" />
        </div>
        <div className="container-custom relative mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-in-up mb-6 text-4xl font-bold tracking-tight gradient-text-subtle sm:text-5xl lg:text-6xl">{config.sloganZh}</h1>
          <p className="animate-fade-in-up-delay-1 mb-4 text-lg text-foreground-secondary">{config.slogan}</p>
          <p className="animate-fade-in-up-delay-1 mx-auto mb-10 max-w-lg text-base text-foreground-secondary">{config.descriptionZh}</p>
          <div className="animate-fade-in-up-delay-2 flex flex-wrap justify-center gap-3">
            <a href={mainSiteUrl} className="inline-block rounded-lg bg-gradient-to-br from-sol-purple to-[#6E2FCC] px-6 py-3 text-sm font-medium text-white shadow-[0_4px_24px_rgba(153,69,255,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(153,69,255,0.4)]">
              访问 BuySolanas 主站 →
            </a>
            <a href={`${mainSiteUrl}/zh-CN/domains#inquire`} className="rounded-lg border border-[var(--color-glass-border)] bg-transparent px-6 py-3 text-sm text-foreground transition-all hover:border-white/20 hover:bg-white/[0.04]">
              获取域名报价
            </a>
          </div>
        </div>
      </section>

      {config.forSale && (
        <section className="border-y border-amber-500/20 bg-amber-500/[0.03] py-8">
          <div className="container-custom mx-auto max-w-3xl text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-amber-400">域名出售中</p>
            <h2 className="mb-2 text-xl font-bold"><span className="font-mono text-amber-200">{config.domain}</span> 正在出售</h2>
            <p className="mb-4 text-sm text-foreground-secondary">此域名是 Solana 生态域名包的一部分，可单独购买或打包优惠。</p>
            <a href={`${mainSiteUrl}/zh-CN/domains#inquire`} className="inline-block rounded-lg border border-amber-500/30 bg-amber-500/10 px-6 py-2.5 text-sm font-medium text-amber-200 transition-all hover:border-amber-500/50 hover:bg-amber-500/20">
              立即询价 →
            </a>
          </div>
        </section>
      )}

      {config.features.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <h2 className="mb-8 text-center text-2xl font-bold">潜在用途</h2>
            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
              {config.features.map((f, i) => (
                <div key={i} className="glass-card p-6 transition-all duration-300 hover:border-sol-purple/30 hover:-translate-y-0.5">
                  <span className="mb-3 block text-2xl">{f.icon}</span>
                  <h3 className="mb-2 text-base font-semibold">{f.titleZh}</h3>
                  <p className="text-sm text-foreground-secondary">{f.descZh}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <DomainCluster locale="zh-CN" />

      <footer className="border-t border-[var(--color-glass-border)] bg-background-secondary py-8">
        <div className="container-custom text-center">
          <p className="mb-2 text-sm text-foreground-secondary">
            Powered by{' '}
            <a href={mainSiteUrl} className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-white">BuySolanas.com</a>
          </p>
          <p className="text-xs text-foreground-tertiary">© 2025 BuySolanas.com · 仅供教育目的，不构成投资建议</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {ALL_DOMAINS.map((d) => (
              <a key={d.domain} href={`https://${d.domain}`} className="text-xs text-foreground-tertiary transition-colors hover:text-foreground-secondary" {...(d.domain !== config.domain ? { target: '_blank', rel: 'noopener' } : {})}>
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
   V2 主站首页
   ============================================================ */
function MainHomePage() {
  const t = useTranslations('home');

  const features = [
    { icon: '📈', title: t('feat1Title'), desc: t('feat1Desc'), color: 'bg-sol-green/10' },
    { icon: '🎓', title: t('feat2Title'), desc: t('feat2Desc'), color: 'bg-sol-purple/10', badge: t('featBadge') },
    { icon: '📖', title: t('feat3Title'), desc: t('feat3Desc'), color: 'bg-sol-blue/10', badge: t('featBadge') },
    { icon: '📰', title: t('feat4Title'), desc: t('feat4Desc'), color: 'bg-amber-500/10' },
    { icon: '👥', title: t('feat5Title'), desc: t('feat5Desc'), color: 'bg-sol-green/10', badge: t('featBadge') },
    { icon: '🔧', title: t('feat6Title'), desc: t('feat6Desc'), color: 'bg-sol-purple/10' },
  ];

  const levels = [
    { num: '01', title: t('level1Title'), desc: t('level1Desc'), tag: t('level1Tag'), tagClass: 'bg-sol-green/10 text-sol-green' },
    { num: '02', title: t('level2Title'), desc: t('level2Desc'), tag: t('level2Tag'), tagClass: 'bg-sol-blue/10 text-sol-blue' },
    { num: '03', title: t('level3Title'), desc: t('level3Desc'), tag: t('level3Tag'), tagClass: 'bg-sol-purple/10 text-[#B87FFF]' },
  ];

  const glossaryPreview = [
    { term: 'Proof-of-History (PoH)', def: t('gp1') },
    { term: 'DeFi', def: t('gp2') },
    { term: 'HODL', def: t('gp3') },
    { term: 'Staking', def: t('gp4') },
    { term: 'Gas Fee', def: t('gp5') },
    { term: 'NFT', def: t('gp6') },
  ];

  const news = [
    { tag: t('newsTag1'), title: t('news1'), meta: t('newsMeta1') },
    { tag: t('newsTag2'), title: t('news2'), meta: t('newsMeta2') },
    { tag: t('newsTag3'), title: t('news3'), meta: t('newsMeta3') },
  ];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] overflow-hidden px-[5%] py-20 md:flex md:items-center md:py-16">
        {/* Background gradients */}
        <div className="pointer-events-none absolute -left-[100px] -top-[200px] h-[700px] w-[700px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(153,69,255,0.12) 0%, transparent 65%)' }} />
        <div className="pointer-events-none absolute -bottom-[100px] right-[5%] h-[500px] w-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(20,241,149,0.08) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-[620px]">
          {/* Eyebrow */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-sol-purple/25 bg-sol-purple/10 px-3 py-1 text-xs font-medium text-[#B87FFF]">
            <span className="h-1.5 w-1.5 rounded-full bg-sol-green" style={{ animation: 'pulse-dot 2s infinite' }} />
            {t('eyebrow')}
          </div>

          <h1 className="animate-fade-in-up mb-5 text-[clamp(36px,5vw,60px)] font-bold leading-[1.15] tracking-tight">
            {t('heroLine1')} <span className="gradient-text">{t('heroHighlight')}</span>
            <br />
            {t('heroLine2')}
          </h1>

          <p className="animate-fade-in-up-delay-1 mb-9 max-w-[500px] text-[17px] font-light leading-[1.7] text-foreground-secondary">
            {t('heroSubtitle')}
          </p>

          <div className="animate-fade-in-up-delay-2 flex flex-wrap gap-3">
            <Link
              href="/start"
              className="rounded-[10px] bg-gradient-to-br from-sol-purple to-[#6E2FCC] px-7 py-3.5 text-[15px] font-medium text-white shadow-[0_4px_24px_rgba(153,69,255,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(153,69,255,0.4)]"
            >
              {t('heroCta1')}
            </Link>
            <Link
              href="/glossary"
              className="rounded-[10px] border border-[var(--color-glass-border)] px-7 py-3.5 text-[15px] transition-all hover:border-white/20 hover:bg-white/[0.04]"
            >
              {t('heroCta2')}
            </Link>
          </div>

          {/* Hero stats */}
          <div className="animate-fade-in-up-delay-3 mt-12 flex gap-9 border-t border-[var(--color-glass-border)] pt-8">
            {[
              { val: '50+', label: t('statCourses') },
              { val: '200+', label: t('statTerms') },
              { val: t('statFreeVal'), label: t('statFreeLabel') },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-bold">{s.val}</p>
                <p className="mt-0.5 text-xs text-foreground-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SOL Price Card — desktop only */}
        <div className="absolute right-[5%] top-1/2 z-10 hidden w-[340px] -translate-y-1/2 lg:block">
          <SolPriceCard />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-[5%] py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-sol-purple">{t('featLabel')}</p>
        <h2 className="mb-3 text-[clamp(26px,3vw,38px)] font-bold tracking-tight">{t('featTitle')}</h2>
        <p className="mb-12 max-w-[500px] text-base text-foreground-secondary">{t('featSub')}</p>

        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card p-6 transition-all duration-200 hover:border-sol-purple/30 hover:-translate-y-0.5">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${f.color}`}>{f.icon}</div>
              <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
              <p className="text-[13px] leading-relaxed text-foreground-secondary">{f.desc}</p>
              {f.badge && (
                <span className="mt-3 inline-block rounded border border-sol-purple/20 bg-sol-purple/10 px-2 py-0.5 text-[11px] text-sol-purple">
                  {f.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== LEARNING PATH ===== */}
      <section className="border-y border-[var(--color-glass-border)] bg-background-secondary">
        <div className="px-[5%] py-14">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-sol-purple">{t('pathLabel')}</p>
          <h2 className="mb-3 text-[clamp(26px,3vw,38px)] font-bold tracking-tight">{t('pathTitle')}</h2>
          <p className="mb-0 max-w-[500px] text-base text-foreground-secondary">{t('pathSub')}</p>
        </div>
        <div className="grid md:grid-cols-3">
          {levels.map((lv, i) => (
            <div key={i} className={`px-8 py-10 ${i < 2 ? 'border-b border-[var(--color-glass-border)] md:border-b-0 md:border-r' : ''}`}>
              <p className="mb-4 text-5xl font-bold leading-none text-foreground-tertiary">{lv.num}</p>
              <h3 className="mb-2 text-lg font-semibold">{lv.title}</h3>
              <p className="text-[13px] leading-relaxed text-foreground-secondary">{lv.desc}</p>
              <span className={`mt-4 inline-block rounded px-2.5 py-0.5 text-[11px] ${lv.tagClass}`}>{lv.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== GLOSSARY PREVIEW ===== */}
      <section className="px-[5%] py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-sol-purple">{t('glossLabel')}</p>
        <h2 className="mb-3 text-[clamp(26px,3vw,38px)] font-bold tracking-tight">{t('glossTitle')}</h2>
        <p className="mb-12 max-w-[500px] text-base text-foreground-secondary">{t('glossSub')}</p>

        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {glossaryPreview.map((g, i) => (
            <div key={i} className="glass-card cursor-pointer p-4 transition-all hover:border-sol-purple/30">
              <p className="mb-1.5 text-sm font-semibold">{g.term}</p>
              <p className="text-xs leading-relaxed text-foreground-secondary">{g.def}</p>
            </div>
          ))}
        </div>
        <Link href="/glossary" className="mt-6 block text-center text-sm text-sol-purple transition-colors hover:text-foreground">
          {t('glossMore')}
        </Link>
      </section>

      {/* ===== NEWS ===== */}
      <section className="border-t border-[var(--color-glass-border)] bg-background-secondary px-[5%] py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-sol-purple">{t('newsLabel')}</p>
        <h2 className="mb-3 text-[clamp(26px,3vw,38px)] font-bold tracking-tight">{t('newsTitle')}</h2>
        <p className="mb-12 max-w-[500px] text-base text-foreground-secondary">{t('newsSub')}</p>

        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {news.map((n, i) => (
            <div key={i} className="glass-card flex flex-col gap-2.5 p-5">
              <span className="self-start rounded bg-sol-purple/10 px-2 py-0.5 text-[11px] font-medium text-[#B87FFF]">{n.tag}</span>
              <p className="text-sm font-medium leading-relaxed">{n.title}</p>
              <p className="text-xs text-foreground-tertiary">{n.meta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== COMMUNITY CTA ===== */}
      <section className="relative overflow-hidden px-[5%] py-20 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(153,69,255,0.15) 0%, transparent 70%)' }} />
        <p className="relative mb-3 text-xs font-medium uppercase tracking-[0.1em] text-sol-purple">{t('commLabel')}</p>
        <h2 className="relative mb-4 text-[clamp(26px,3vw,38px)] font-bold tracking-tight">{t('commTitle')}</h2>
        <p className="relative mx-auto mb-9 max-w-[480px] text-base text-foreground-secondary">{t('commSub')}</p>
        <div className="relative flex flex-wrap justify-center gap-3">
          {[
            { emoji: '💬', label: t('commDiscord') },
            { emoji: '📱', label: t('commWechat') },
            { emoji: '🐦', label: t('commTwitter') },
            { emoji: '📧', label: t('commNewsletter') },
          ].map((c, i) => (
            <button key={i} className="glass-card flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all hover:border-sol-purple/40">
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Domain Portfolio Showcase */}
      <DomainShowcase locale="en" />

      {/* Domain Cluster Cross-links */}
      <DomainCluster locale="en" />
    </div>
  );
}

/* ============================================================
   路由分发
   ============================================================ */
export default function HomePage() {
  if (isSatellite()) {
    return <SatelliteLanding />;
  }
  return <MainHomePage />;
}
