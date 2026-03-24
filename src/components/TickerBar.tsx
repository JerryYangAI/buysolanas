'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

type TickerData = {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
};

function formatCompact(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

export default function TickerBar() {
  const [data, setData] = useState<TickerData | null>(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true',
          {
            headers: {
              accept: 'application/json',
              ...(process.env.NEXT_PUBLIC_COINGECKO_API_KEY
                ? { 'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY }
                : {}),
            },
          }
        );
        if (res.ok) {
          const json = await res.json();
          const sol = json.solana;
          setData({
            price: sol.usd,
            change24h: sol.usd_24h_change,
            marketCap: sol.usd_market_cap,
            volume24h: sol.usd_24h_vol,
          });
        }
      } catch {
        // Fallback to static data
        setData({
          price: 142.5,
          change24h: 3.21,
          marketCap: 66_200_000_000,
          volume24h: 4_100_000_000,
        });
      }
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 30_000);
    return () => clearInterval(interval);
  }, []);

  const isUp = (data?.change24h ?? 0) >= 0;

  return (
    <div className="sticky top-[60px] z-40 border-b border-[var(--color-glass-border)] bg-background-secondary">
      <Link href="/prices" className="block">
        <div className="container-custom flex items-center gap-6 overflow-x-auto py-2 text-[13px] whitespace-nowrap md:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-foreground-secondary">SOL/USD</span>
            <span className="font-semibold">
              {data ? `$${data.price.toFixed(2)}` : '...'}
            </span>
            {data && (
              <span className={`text-xs ${isUp ? 'text-sol-green' : 'text-accent-red'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(data.change24h).toFixed(2)}%
              </span>
            )}
          </div>

          <span className="text-foreground-tertiary">|</span>

          <div className="flex items-center gap-2">
            <span className="text-foreground-secondary">市值</span>
            <span className="font-medium">{data ? formatCompact(data.marketCap) : '...'}</span>
          </div>

          <span className="hidden text-foreground-tertiary sm:inline">|</span>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-foreground-secondary">24h 交易量</span>
            <span className="font-medium">{data ? formatCompact(data.volume24h) : '...'}</span>
          </div>

          <span className="hidden text-foreground-tertiary md:inline">|</span>

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-foreground-secondary">TPS</span>
            <span className="font-medium text-sol-green">65,000+</span>
          </div>

          <span className="hidden text-foreground-tertiary lg:inline">|</span>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-foreground-secondary">全球排名</span>
            <span className="font-medium">#5</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
