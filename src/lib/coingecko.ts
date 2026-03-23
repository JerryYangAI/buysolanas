/**
 * CoinGecko API integration with tiered fallback.
 *
 * Setup: Create .env.local with:
 *   COINGECKO_API_KEY=your_key_here
 *
 * Get a free demo key at https://www.coingecko.com/en/api
 * Pro keys start with "CG-", demo keys do not.
 * For Cloudflare deployment: set the secret in wrangler.jsonc vars or dashboard.
 */

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
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 97_350.0, price_change_percentage_24h: -1.12, price_change_percentage_1h_in_currency: -0.4, price_change_percentage_7d_in_currency: 2.15, market_cap: 1_920_000_000_000, market_cap_rank: 1, total_volume: 28_500_000_000, image: '' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 2_685.4, price_change_percentage_24h: 0.87, price_change_percentage_1h_in_currency: 0.3, price_change_percentage_7d_in_currency: -1.5, market_cap: 323_000_000_000, market_cap_rank: 2, total_volume: 12_100_000_000, image: '' },
  { id: 'tether', symbol: 'usdt', name: 'Tether', current_price: 1.0, price_change_percentage_24h: 0.01, price_change_percentage_1h_in_currency: 0.0, price_change_percentage_7d_in_currency: 0.02, market_cap: 145_000_000_000, market_cap_rank: 3, total_volume: 55_000_000_000, image: '' },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', current_price: 612.3, price_change_percentage_24h: 1.45, price_change_percentage_1h_in_currency: 0.2, price_change_percentage_7d_in_currency: 3.1, market_cap: 91_000_000_000, market_cap_rank: 4, total_volume: 1_800_000_000, image: '' },
  { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 148.52, price_change_percentage_24h: 3.24, price_change_percentage_1h_in_currency: 0.8, price_change_percentage_7d_in_currency: 5.6, market_cap: 72_400_000_000, market_cap_rank: 5, total_volume: 3_200_000_000, image: '' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.62, price_change_percentage_24h: -0.35, price_change_percentage_1h_in_currency: 0.1, price_change_percentage_7d_in_currency: 1.2, market_cap: 34_500_000_000, market_cap_rank: 6, total_volume: 1_200_000_000, image: '' },
  { id: 'usd-coin', symbol: 'usdc', name: 'USD Coin', current_price: 1.0, price_change_percentage_24h: 0.0, price_change_percentage_1h_in_currency: 0.0, price_change_percentage_7d_in_currency: 0.01, market_cap: 33_000_000_000, market_cap_rank: 7, total_volume: 5_600_000_000, image: '' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.45, price_change_percentage_24h: 2.1, price_change_percentage_1h_in_currency: 0.5, price_change_percentage_7d_in_currency: 4.3, market_cap: 16_200_000_000, market_cap_rank: 8, total_volume: 420_000_000, image: '' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', current_price: 0.082, price_change_percentage_24h: 1.6, price_change_percentage_1h_in_currency: 0.3, price_change_percentage_7d_in_currency: -2.1, market_cap: 11_800_000_000, market_cap_rank: 9, total_volume: 680_000_000, image: '' },
  { id: 'tron', symbol: 'trx', name: 'TRON', current_price: 0.125, price_change_percentage_24h: 0.42, price_change_percentage_1h_in_currency: 0.1, price_change_percentage_7d_in_currency: 1.8, market_cap: 10_900_000_000, market_cap_rank: 10, total_volume: 310_000_000, image: '' },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink', current_price: 14.82, price_change_percentage_24h: -0.95, price_change_percentage_1h_in_currency: -0.2, price_change_percentage_7d_in_currency: 3.4, market_cap: 9_200_000_000, market_cap_rank: 11, total_volume: 520_000_000, image: '' },
  { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', current_price: 36.4, price_change_percentage_24h: 2.8, price_change_percentage_1h_in_currency: 0.6, price_change_percentage_7d_in_currency: 7.2, market_cap: 8_800_000_000, market_cap_rank: 12, total_volume: 450_000_000, image: '' },
  { id: 'polkadot', symbol: 'dot', name: 'Polkadot', current_price: 7.15, price_change_percentage_24h: 1.2, price_change_percentage_1h_in_currency: 0.1, price_change_percentage_7d_in_currency: 2.5, market_cap: 7_600_000_000, market_cap_rank: 13, total_volume: 280_000_000, image: '' },
  { id: 'matic-network', symbol: 'matic', name: 'Polygon', current_price: 0.92, price_change_percentage_24h: -0.7, price_change_percentage_1h_in_currency: -0.1, price_change_percentage_7d_in_currency: 1.9, market_cap: 7_200_000_000, market_cap_rank: 14, total_volume: 350_000_000, image: '' },
  { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', current_price: 84.6, price_change_percentage_24h: 0.55, price_change_percentage_1h_in_currency: 0.2, price_change_percentage_7d_in_currency: -0.8, market_cap: 6_300_000_000, market_cap_rank: 15, total_volume: 410_000_000, image: '' },
  { id: 'uniswap', symbol: 'uni', name: 'Uniswap', current_price: 8.45, price_change_percentage_24h: 1.8, price_change_percentage_1h_in_currency: 0.4, price_change_percentage_7d_in_currency: 5.1, market_cap: 5_100_000_000, market_cap_rank: 16, total_volume: 190_000_000, image: '' },
  { id: 'cosmos', symbol: 'atom', name: 'Cosmos', current_price: 9.72, price_change_percentage_24h: -1.3, price_change_percentage_1h_in_currency: -0.3, price_change_percentage_7d_in_currency: 0.6, market_cap: 3_800_000_000, market_cap_rank: 17, total_volume: 150_000_000, image: '' },
  { id: 'stellar', symbol: 'xlm', name: 'Stellar', current_price: 0.118, price_change_percentage_24h: 0.92, price_change_percentage_1h_in_currency: 0.1, price_change_percentage_7d_in_currency: 2.7, market_cap: 3_400_000_000, market_cap_rank: 18, total_volume: 120_000_000, image: '' },
  { id: 'near', symbol: 'near', name: 'NEAR Protocol', current_price: 5.28, price_change_percentage_24h: 3.5, price_change_percentage_1h_in_currency: 0.7, price_change_percentage_7d_in_currency: 8.4, market_cap: 3_100_000_000, market_cap_rank: 19, total_volume: 210_000_000, image: '' },
  { id: 'aptos', symbol: 'apt', name: 'Aptos', current_price: 8.92, price_change_percentage_24h: 2.1, price_change_percentage_1h_in_currency: 0.3, price_change_percentage_7d_in_currency: 6.3, market_cap: 2_800_000_000, market_cap_rank: 20, total_volume: 160_000_000, image: '' },
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
  error?: string;
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
      if (res.status === 429) {
        console.error('CoinGecko authenticated API rate limited');
      } else {
        console.error(`CoinGecko authenticated API error: ${res.status}`);
      }
    } catch (error) {
      console.error('CoinGecko authenticated fetch failed:', error);
    }
  }

  // Tier 2: Public API (no key required, rate-limited)
  try {
    const url = buildMarketUrl('https://api.coingecko.com');
    const res = await fetch(url.toString(), {
      headers: {
        accept: 'application/json',
        'User-Agent': 'buysolanas/1.0 (https://buysolanas.com)',
      },
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const coins: CoinData[] = await res.json();
      return { data: coins, isMock: false };
    }
    if (res.status === 429) {
      console.error('CoinGecko public API rate limited (429)');
      return { data: mockData, isMock: true, error: 'rate_limited' };
    }
    console.error(`CoinGecko public API error: ${res.status}`);
  } catch (error) {
    console.error('CoinGecko public fetch failed:', error);
  }

  // Tier 3: Mock data fallback
  return { data: mockData, isMock: true, error: 'api_error' };
}

async function fetchGlobalData(): Promise<GlobalData | null> {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const host =
      apiKey?.startsWith('CG-')
        ? 'https://pro-api.coingecko.com'
        : 'https://api.coingecko.com';
    const headers: Record<string, string> = {
      accept: 'application/json',
      'User-Agent': 'buysolanas/1.0 (https://buysolanas.com)',
    };

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
