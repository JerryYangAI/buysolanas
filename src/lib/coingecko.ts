import { unstable_cache } from 'next/cache';

export type CoinData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  sparkline_in_7d?: { price: number[] };
};

export type GlobalData = {
  total_market_cap_usd: number;
  total_volume_24h_usd: number;
  btc_dominance: number;
  market_cap_change_percentage_24h: number;
};

const mockData: CoinData[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 97_350.0,
    price_change_percentage_24h: -1.12,
    price_change_percentage_1h_in_currency: -0.4,
    price_change_percentage_7d_in_currency: 2.15,
    market_cap: 1_920_000_000_000,
    market_cap_rank: 1,
    total_volume: 28_500_000_000,
    image: '',
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 2_685.4,
    price_change_percentage_24h: 0.87,
    price_change_percentage_1h_in_currency: 0.3,
    price_change_percentage_7d_in_currency: -1.5,
    market_cap: 323_000_000_000,
    market_cap_rank: 2,
    total_volume: 12_100_000_000,
    image: '',
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    current_price: 148.52,
    price_change_percentage_24h: 3.24,
    price_change_percentage_1h_in_currency: 0.8,
    price_change_percentage_7d_in_currency: 5.6,
    market_cap: 72_400_000_000,
    market_cap_rank: 5,
    total_volume: 3_200_000_000,
    image: '',
  },
];

function buildMarketUrl(host: string): URL {
  const url = new URL(`${host}/api/v3/coins/markets`);
  url.searchParams.set('vs_currency', 'usd');
  url.searchParams.set('order', 'market_cap_desc');
  url.searchParams.set('per_page', '100');
  url.searchParams.set('page', '1');
  url.searchParams.set('sparkline', 'true');
  url.searchParams.set('price_change_percentage', '1h,24h,7d');
  return url;
}

async function fetchCoinGeckoData(): Promise<{
  data: CoinData[];
  isMock: boolean;
}> {
  const apiKey = process.env.COINGECKO_API_KEY;

  // Tier 1: Authenticated API (if key is set)
  if (apiKey) {
    try {
      const isPro = apiKey.startsWith('CG-');
      const host = isPro
        ? 'https://pro-api.coingecko.com'
        : 'https://api.coingecko.com';
      const headerKey = isPro ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key';

      const url = buildMarketUrl(host);
      const res = await fetch(url.toString(), {
        headers: {
          accept: 'application/json',
          [headerKey]: apiKey,
        },
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const coins: CoinData[] = await res.json();
        return { data: coins, isMock: false };
      }
      console.error(`CoinGecko authenticated API error: ${res.status}`);
    } catch (error) {
      console.error('CoinGecko authenticated fetch failed:', error);
    }
  }

  // Tier 2: Public API (no key required, rate-limited)
  try {
    const url = buildMarketUrl('https://api.coingecko.com');
    const res = await fetch(url.toString(), {
      headers: { accept: 'application/json' },
      next: { revalidate: 120 },
    });

    if (res.ok) {
      const coins: CoinData[] = await res.json();
      return { data: coins, isMock: false };
    }
    console.error(`CoinGecko public API error: ${res.status}`);
  } catch (error) {
    console.error('CoinGecko public fetch failed:', error);
  }

  // Tier 3: Mock data fallback
  return { data: mockData, isMock: true };
}

async function fetchGlobalData(): Promise<GlobalData | null> {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const host =
      apiKey?.startsWith('CG-')
        ? 'https://pro-api.coingecko.com'
        : 'https://api.coingecko.com';
    const headers: Record<string, string> = { accept: 'application/json' };

    if (apiKey) {
      const headerKey = apiKey.startsWith('CG-')
        ? 'x-cg-pro-api-key'
        : 'x-cg-demo-api-key';
      headers[headerKey] = apiKey;
    }

    const res = await fetch(`${host}/api/v3/global`, {
      headers,
      next: { revalidate: 120 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const d = json.data;
    return {
      total_market_cap_usd: d.total_market_cap?.usd ?? 0,
      total_volume_24h_usd: d.total_volume?.usd ?? 0,
      btc_dominance: d.market_cap_percentage?.btc ?? 0,
      market_cap_change_percentage_24h:
        d.market_cap_change_percentage_24h_usd ?? 0,
    };
  } catch {
    return null;
  }
}

export const getCoinData = unstable_cache(
  fetchCoinGeckoData,
  ['coingecko-market-data'],
  { revalidate: 60 }
);

export const getGlobalData = unstable_cache(
  fetchGlobalData,
  ['coingecko-global-data'],
  { revalidate: 120 }
);
