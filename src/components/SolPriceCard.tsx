'use client';

import { useEffect, useState } from 'react';

type PriceData = {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
};

export default function SolPriceCard() {
  const [data, setData] = useState<PriceData>({
    price: 142.5,
    change24h: 3.21,
    high24h: 148.2,
    low24h: 136.8,
  });

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false',
          { headers: { accept: 'application/json' } }
        );
        if (res.ok) {
          const json = await res.json();
          setData({
            price: json.market_data.current_price.usd,
            change24h: json.market_data.price_change_percentage_24h,
            high24h: json.market_data.high_24h.usd,
            low24h: json.market_data.low_24h.usd,
          });
        }
      } catch {
        /* keep fallback */
      }
    }
    fetchPrice();
  }, []);

  const isUp = data.change24h >= 0;

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sol-purple to-sol-blue text-xs font-bold text-white">
          SOL
        </div>
        <div>
          <p className="text-[15px] font-semibold">Solana</p>
          <p className="text-xs text-foreground-secondary">SOL · Solana Network</p>
        </div>
      </div>

      {/* Price */}
      <p className="mb-1 text-4xl font-bold">${data.price.toFixed(2)}</p>
      <span
        className={`mb-5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[13px] font-medium ${
          isUp ? 'bg-sol-green/10 text-sol-green' : 'bg-accent-red/10 text-accent-red'
        }`}
      >
        {isUp ? '▲' : '▼'} {Math.abs(data.change24h).toFixed(2)}%
      </span>

      {/* Mini chart placeholder */}
      <div className="mb-4 h-[60px] overflow-hidden rounded-lg bg-background-tertiary">
        <svg viewBox="0 0 300 60" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14F195" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#14F195" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,50 L20,44 L50,40 L80,42 L100,35 L130,30 L160,25 L180,20 L210,18 L240,12 L270,8 L300,5 L300,60 L0,60 Z" fill="url(#chartGrad)" />
          <path d="M0,50 L20,44 L50,40 L80,42 L100,35 L130,30 L160,25 L180,20 L210,18 L240,12 L270,8 L300,5" fill="none" stroke="#14F195" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Stats rows */}
      <div className="space-y-0 text-xs">
        {[
          ['24h 最高', `$${data.high24h.toFixed(2)}`],
          ['24h 最低', `$${data.low24h.toFixed(2)}`],
          ['总供应量', '464.7M SOL'],
          ['Gas 费用', '<$0.001'],
        ].map(([label, val], i) => (
          <div
            key={i}
            className={`flex justify-between py-1.5 ${i < 3 ? 'border-b border-[var(--color-glass-border)]' : ''}`}
          >
            <span className="text-foreground-secondary">{label}</span>
            <span className="font-medium">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
