import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getCoinData, getGlobalData } from '@/lib/coingecko';
import type { CoinData } from '@/lib/coingecko';
import { formatUSD, formatCompact, formatPercent, formatLargeUSD } from '@/lib/format';
import { routing } from '@/i18n/routing';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import Sparkline from '@/components/Sparkline';

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

function ChangeCell({ value }: { value?: number | null }) {
  if (value == null) return <span className="text-foreground-tertiary">-</span>;
  const isUp = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono text-xs ${
        isUp ? 'text-accent-green' : 'text-accent-red'
      }`}
    >
      {formatPercent(value)}
    </span>
  );
}

function CoinRow({ coin, t }: { coin: CoinData; t: (key: string) => string }) {
  const isUp = (coin.price_change_percentage_24h ?? 0) >= 0;
  const sparklineData = coin.sparkline_in_7d?.price;
  const sparklineUp =
    sparklineData && sparklineData.length > 1
      ? sparklineData[sparklineData.length - 1] >= sparklineData[0]
      : isUp;

  return (
    <tr className="border-b border-[var(--color-glass-border)] transition-colors hover:bg-white/[0.03]">
      <td className="px-3 py-4 text-center text-xs text-foreground-tertiary">
        {coin.market_cap_rank ?? '-'}
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          {coin.image ? (
            <img
              src={coin.image}
              alt={coin.name}
              width={24}
              height={24}
              className="rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-foreground-tertiary/20" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{coin.name}</p>
            <p className="text-xs uppercase text-foreground-tertiary">{coin.symbol}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-right font-mono text-sm">{formatUSD(coin.current_price)}</td>
      <td className="hidden px-3 py-4 text-right lg:table-cell">
        <ChangeCell value={coin.price_change_percentage_1h_in_currency} />
      </td>
      <td className="px-3 py-4 text-right">
        <ChangeCell value={coin.price_change_percentage_24h} />
      </td>
      <td className="hidden px-3 py-4 text-right lg:table-cell">
        <ChangeCell value={coin.price_change_percentage_7d_in_currency} />
      </td>
      <td className="hidden px-3 py-4 text-right font-mono text-xs text-foreground-secondary md:table-cell">
        {formatCompact(coin.total_volume)}
      </td>
      <td className="hidden px-3 py-4 text-right font-mono text-xs text-foreground-secondary md:table-cell">
        {formatCompact(coin.market_cap)}
      </td>
      <td className="hidden px-3 py-4 text-right xl:table-cell">
        {sparklineData && sparklineData.length > 1 ? (
          <Sparkline data={sparklineData} isUp={sparklineUp} width={100} height={28} />
        ) : (
          <span className="text-foreground-tertiary">-</span>
        )}
      </td>
    </tr>
  );
}

function MobileCard({ coin, t }: { coin: CoinData; t: (key: string) => string }) {
  const isUp = (coin.price_change_percentage_24h ?? 0) >= 0;
  const sparklineData = coin.sparkline_in_7d?.price;
  const sparklineUp =
    sparklineData && sparklineData.length > 1
      ? sparklineData[sparklineData.length - 1] >= sparklineData[0]
      : isUp;

  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-foreground-tertiary">{coin.market_cap_rank ?? '-'}</span>
          {coin.image ? (
            <img src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" loading="lazy" />
          ) : (
            <div className="h-6 w-6 rounded-full bg-foreground-tertiary/20" />
          )}
          <div>
            <p className="text-sm font-medium">{coin.name}</p>
            <p className="text-xs uppercase text-foreground-tertiary">{coin.symbol}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 font-mono text-sm ${isUp ? 'text-accent-green' : 'text-accent-red'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatPercent(coin.price_change_percentage_24h)}
        </span>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-lg">{formatUSD(coin.current_price)}</p>
        {sparklineData && sparklineData.length > 1 && (
          <Sparkline data={sparklineData} isUp={sparklineUp} width={80} height={24} />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-foreground-tertiary">{t('change1h')}</p>
          <ChangeCell value={coin.price_change_percentage_1h_in_currency} />
        </div>
        <div>
          <p className="text-foreground-tertiary">{t('change7d')}</p>
          <ChangeCell value={coin.price_change_percentage_7d_in_currency} />
        </div>
        <div>
          <p className="text-foreground-tertiary">{t('marketCap')}</p>
          <p className="font-mono text-foreground-secondary">{formatCompact(coin.market_cap)}</p>
        </div>
      </div>
    </div>
  );
}

export default async function PricesPage() {
  const t = await getTranslations('prices');
  const [{ data: coins, isMock }, globalData] = await Promise.all([
    getCoinData(),
    getGlobalData(),
  ]);

  return (
    <div className="container-custom py-8 md:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight gradient-text sm:text-3xl">
          {t('title')}
        </h1>
        <p className="text-sm text-foreground-secondary">{t('description')}</p>
      </div>

      {/* Global market summary bar */}
      {globalData && (
        <div className="mb-8 glass-card flex flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3.5 text-xs">
          <div>
            <span className="text-foreground-tertiary">{t('globalMarketCap')}: </span>
            <span className="font-mono font-medium">{formatLargeUSD(globalData.total_market_cap_usd)}</span>
            <span className={`ml-1 font-mono ${globalData.market_cap_change_percentage_24h >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {formatPercent(globalData.market_cap_change_percentage_24h)}
            </span>
          </div>
          <div>
            <span className="text-foreground-tertiary">{t('globalVolume24h')}: </span>
            <span className="font-mono font-medium">{formatLargeUSD(globalData.total_volume_24h_usd)}</span>
          </div>
          <div>
            <span className="text-foreground-tertiary">{t('btcDominance')}: </span>
            <span className="font-mono font-medium">{globalData.btc_dominance.toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* Mock data notice */}
      {isMock && (
        <div className="mb-6 glass-card flex items-start gap-3 border-amber-500/20 bg-amber-500/[0.03] px-4 py-3">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-sm text-amber-200/80">{t('mockNotice')}</p>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-x-auto glass-card md:block">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--color-glass-border)] bg-white/[0.02]">
              <th className="w-12 px-3 py-3 text-center text-xs font-medium text-foreground-tertiary">{t('rank')}</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-foreground-tertiary">{t('coin')}</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-foreground-tertiary">{t('price')}</th>
              <th className="hidden px-3 py-3 text-right text-xs font-medium text-foreground-tertiary lg:table-cell">{t('change1h')}</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-foreground-tertiary">{t('change24h')}</th>
              <th className="hidden px-3 py-3 text-right text-xs font-medium text-foreground-tertiary lg:table-cell">{t('change7d')}</th>
              <th className="hidden px-3 py-3 text-right text-xs font-medium text-foreground-tertiary md:table-cell">{t('volume')}</th>
              <th className="hidden px-3 py-3 text-right text-xs font-medium text-foreground-tertiary md:table-cell">{t('marketCap')}</th>
              <th className="hidden px-3 py-3 text-right text-xs font-medium text-foreground-tertiary xl:table-cell">{t('sparkline')}</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <CoinRow key={coin.id} coin={coin} t={t} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {coins.map((coin) => (
          <MobileCard key={coin.id} coin={coin} t={t} />
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-foreground-tertiary">{t('lastUpdated')}</p>
    </div>
  );
}
