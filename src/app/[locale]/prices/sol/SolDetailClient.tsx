'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type MarketData = {
  price: number;
  change24h: number;
  change7d: number;
  change30d: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  ath: number;
  athDate: string;
  circulatingSupply: number;
  totalSupply: number;
};

type ChartPoint = { time: string; price: number };

const timeframes = ['24h', '7d', '30d', '1y'] as const;
type Timeframe = (typeof timeframes)[number];

const tfToDays: Record<Timeframe, number> = { '24h': 1, '7d': 7, '30d': 30, '1y': 365 };

function formatUSD(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SolDetailClient() {
  const [data, setData] = useState<MarketData | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [tf, setTf] = useState<Timeframe>('7d');

  // Fetch market data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false',
          { headers: { accept: 'application/json' } }
        );
        if (!res.ok) return;
        const json = await res.json();
        const md = json.market_data;
        setData({
          price: md.current_price.usd,
          change24h: md.price_change_percentage_24h ?? 0,
          change7d: md.price_change_percentage_7d ?? 0,
          change30d: md.price_change_percentage_30d ?? 0,
          marketCap: md.market_cap.usd,
          volume24h: md.total_volume.usd,
          high24h: md.high_24h.usd,
          low24h: md.low_24h.usd,
          ath: md.ath.usd,
          athDate: md.ath_date.usd,
          circulatingSupply: md.circulating_supply,
          totalSupply: md.total_supply,
        });
      } catch { /* fallback */ }
    }
    fetchData();
  }, []);

  // Fetch chart data
  useEffect(() => {
    async function fetchChart() {
      try {
        const days = tfToDays[tf];
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=${days}`,
          { headers: { accept: 'application/json' } }
        );
        if (!res.ok) return;
        const json = await res.json();
        const points: ChartPoint[] = json.prices.map(([ts, price]: [number, number]) => ({
          time: new Date(ts).toLocaleDateString(),
          price,
        }));
        // Downsample for performance
        const step = Math.max(1, Math.floor(points.length / 100));
        setChart(points.filter((_, i) => i % step === 0));
      } catch { /* fallback */ }
    }
    fetchChart();
  }, [tf]);

  // SVG chart
  const chartSVG = (() => {
    if (chart.length < 2) return null;
    const w = 800, h = 200, pad = 4;
    const prices = chart.map((p) => p.price);
    const min = Math.min(...prices), max = Math.max(...prices);
    const range = max - min || 1;
    const isUp = prices[prices.length - 1] >= prices[0];
    const color = isUp ? '#14F195' : '#FF4D4D';

    const coords = chart.map((p, i) => ({
      x: pad + (i / (chart.length - 1)) * (w - pad * 2),
      y: pad + (h - pad * 2) - ((p.price - min) / range) * (h - pad * 2),
    }));

    const line = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
    const fill = [`${coords[0].x},${h}`, ...coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`), `${coords[coords.length - 1].x},${h}`].join(' ');

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={fill} fill="url(#cg)" />
        <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  })();

  const Change = ({ val }: { val: number }) => (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${val >= 0 ? 'text-sol-green' : 'text-accent-red'}`}>
      {val >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      {val >= 0 ? '+' : ''}{val.toFixed(2)}%
    </span>
  );

  return (
    <div className="space-y-8">
      {/* Price header */}
      <div className="glass-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sol-purple to-sol-blue text-sm font-bold text-white">SOL</div>
          <div>
            <h2 className="text-lg font-bold">Solana <span className="text-sm font-normal text-foreground-secondary">SOL</span></h2>
            <p className="text-xs text-foreground-tertiary">Rank #5</p>
          </div>
        </div>
        {data ? (
          <div className="flex flex-wrap items-end gap-6">
            <p className="text-4xl font-bold">${data.price.toFixed(2)}</p>
            <div className="flex gap-4">
              <div><p className="text-[10px] text-foreground-tertiary">24h</p><Change val={data.change24h} /></div>
              <div><p className="text-[10px] text-foreground-tertiary">7d</p><Change val={data.change7d} /></div>
              <div><p className="text-[10px] text-foreground-tertiary">30d</p><Change val={data.change30d} /></div>
            </div>
          </div>
        ) : (
          <div className="h-12 animate-pulse rounded bg-background-tertiary" />
        )}
      </div>

      {/* Chart */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-3">
          <h3 className="text-sm font-semibold">价格走势</h3>
          <div className="flex gap-1">
            {timeframes.map((t) => (
              <button
                key={t}
                onClick={() => setTf(t)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${tf === t ? 'bg-sol-purple/20 text-sol-purple' : 'text-foreground-tertiary hover:text-foreground-secondary'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[240px] px-2 py-4">
          {chartSVG || <div className="flex h-full items-center justify-center text-sm text-foreground-tertiary">Loading chart...</div>}
        </div>
      </div>

      {/* Market stats grid */}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: '市值 Market Cap', val: formatUSD(data.marketCap) },
            { label: '24h 交易量', val: formatUSD(data.volume24h) },
            { label: '24h 最高', val: `$${data.high24h.toFixed(2)}` },
            { label: '24h 最低', val: `$${data.low24h.toFixed(2)}` },
            { label: '历史最高 ATH', val: `$${data.ath.toFixed(2)}` },
            { label: 'ATH 日期', val: new Date(data.athDate).toLocaleDateString() },
            { label: '流通量', val: `${(data.circulatingSupply / 1e6).toFixed(1)}M SOL` },
            { label: '总供应量', val: `${(data.totalSupply / 1e6).toFixed(1)}M SOL` },
          ].map((s, i) => (
            <div key={i} className="glass-card p-4">
              <p className="mb-1 text-xs text-foreground-tertiary">{s.label}</p>
              <p className="text-sm font-semibold">{s.val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Staking info */}
      <div className="glass-card p-6">
        <h3 className="mb-4 text-lg font-bold">SOL 质押信息</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-foreground-tertiary">质押年化 APY</p>
            <p className="text-xl font-bold text-sol-green">~6.5%</p>
          </div>
          <div>
            <p className="text-xs text-foreground-tertiary">验证节点数</p>
            <p className="text-xl font-bold">1,500+</p>
          </div>
          <div>
            <p className="text-xs text-foreground-tertiary">Gas 费用</p>
            <p className="text-xl font-bold text-sol-green">&lt;$0.001</p>
          </div>
        </div>
      </div>

      {/* Solana ecosystem tokens */}
      <div className="glass-card p-6">
        <h3 className="mb-4 text-lg font-bold">Solana 生态 Top 代币</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: 'Jupiter', ticker: 'JUP', desc: 'DEX 聚合器', color: 'from-sol-green to-sol-blue' },
            { name: 'Raydium', ticker: 'RAY', desc: 'AMM DEX', color: 'from-sol-purple to-sol-blue' },
            { name: 'Marinade', ticker: 'MNDE', desc: '流动性质押', color: 'from-sol-green to-sol-purple' },
            { name: 'Jito', ticker: 'JTO', desc: 'MEV 质押', color: 'from-amber-400 to-amber-600' },
            { name: 'Bonk', ticker: 'BONK', desc: 'Meme 币', color: 'from-amber-400 to-accent-red' },
            { name: 'Pyth', ticker: 'PYTH', desc: '预言机', color: 'from-sol-blue to-sol-purple' },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-[var(--color-glass-border)] bg-white/[0.02] p-3 transition-all hover:bg-white/[0.04]">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${t.color} text-[10px] font-bold text-white`}>
                {t.ticker.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium">{t.name} <span className="text-xs text-foreground-tertiary">{t.ticker}</span></p>
                <p className="text-xs text-foreground-secondary">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
