import { ALL_DOMAINS, getCurrentDomain } from '@/lib/domain-config';

export default function DomainCluster({ locale = 'en' }: { locale?: string }) {
  const current = getCurrentDomain();
  const isZh = locale === 'zh-CN';

  return (
    <section className="border-t border-[var(--color-glass-border)] bg-background-secondary/50 py-12">
      <div className="container-custom">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent-purple">
            {isZh ? 'Solana 生态域名联盟' : 'Solana Domain Network'}
          </p>
          <h3 className="text-lg font-semibold">
            {isZh ? '探索我们的 Solana 域名生态' : 'Explore Our Solana Domain Ecosystem'}
          </h3>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {ALL_DOMAINS.map((d) => {
            const isCurrent = d.domain === current;
            return (
              <a
                key={d.domain}
                href={`https://${d.domain}`}
                target={isCurrent ? undefined : '_blank'}
                rel={isCurrent ? undefined : 'noopener'}
                className={`group relative rounded-lg border p-3 text-center transition-all duration-300 ${
                  isCurrent
                    ? 'border-accent-purple/40 bg-accent-purple/10'
                    : 'border-[var(--color-glass-border)] bg-[var(--color-glass)] hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.06]'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-accent-purple px-2 py-0.5 text-[10px] font-medium text-white">
                    {isZh ? '当前' : 'Current'}
                  </span>
                )}
                <span className="mb-1 block text-lg">{d.icon}</span>
                <span className="block text-xs font-medium text-foreground-secondary group-hover:text-foreground">
                  {d.domain}
                </span>
              </a>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-foreground-tertiary">
          {isZh
            ? '部分域名正在出售，欢迎咨询 →'
            : 'Select domains are available for purchase →'}{' '}
          <a href={`https://${ALL_DOMAINS[0].domain}/${locale === 'zh-CN' ? 'zh-CN' : 'en'}/domains`} className="text-accent-purple underline underline-offset-2 transition-colors hover:text-white">
            {isZh ? '查看详情' : 'Learn more'}
          </a>
        </p>
      </div>
    </section>
  );
}
