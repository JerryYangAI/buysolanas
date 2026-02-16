import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getCoinData } from '@/lib/coingecko';
import { formatUSD, formatCompact, formatPercent } from '@/lib/format';
import { routing } from '@/i18n/routing';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('prices');
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/prices`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/prices`])
      ),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}/${locale}/prices`,
    },
  };
}

export default async function PricesPage() {
  const t = await getTranslations('prices');
  const { data: coins, isMock } = await getCoinData();

  return (
    <div className="container-custom py-12 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </h1>
        <p className="text-foreground-secondary">{t('description')}</p>
      </div>

      {/* Mock data notice */}
      {isMock && (
        <div className="mb-8 flex items-start gap-3 rounded-sm border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-sm text-amber-200">{t('mockNotice')}</p>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-sm border border-foreground-tertiary/20 md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground-tertiary/20 bg-background-secondary">
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
                {t('coin')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
                {t('price')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
                {t('change24h')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
                {t('marketCap')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
                {t('volume')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground-tertiary/10">
            {coins.map((coin) => {
              const isUp = coin.price_change_percentage_24h >= 0;
              return (
                <tr
                  key={coin.id}
                  className="transition-colors hover:bg-background-secondary"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {coin.image && (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-xs uppercase text-foreground-tertiary">
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-sm">
                    {formatUSD(coin.current_price)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-sm ${
                        isUp ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isUp ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {formatPercent(coin.price_change_percentage_24h)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-sm text-foreground-secondary">
                    {formatCompact(coin.market_cap)}
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-sm text-foreground-secondary">
                    {formatCompact(coin.total_volume)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {coins.map((coin) => {
          const isUp = coin.price_change_percentage_24h >= 0;
          return (
            <div
              key={coin.id}
              className="rounded-sm border border-foreground-tertiary/20 bg-background-secondary p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {coin.image && (
                    <img
                      src={coin.image}
                      alt={coin.name}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{coin.name}</p>
                    <p className="text-xs uppercase text-foreground-tertiary">
                      {coin.symbol}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 font-mono text-sm ${
                    isUp ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {isUp ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {formatPercent(coin.price_change_percentage_24h)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-xs text-foreground-tertiary">
                    {t('price')}
                  </p>
                  <p className="font-mono">{formatUSD(coin.current_price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground-tertiary">
                    {t('marketCap')}
                  </p>
                  <p className="font-mono text-foreground-secondary">
                    {formatCompact(coin.market_cap)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary">
                    {t('volume')}
                  </p>
                  <p className="font-mono text-foreground-secondary">
                    {formatCompact(coin.total_volume)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-foreground-tertiary">
        {t('lastUpdated')}
      </p>
    </div>
  );
}
