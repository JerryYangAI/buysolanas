import { unstable_cache } from 'next/cache';

export type CoinData = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
};

const COIN_IDS = ['solana', 'bitcoin', 'ethereum'];

const mockData: CoinData[] = [
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    current_price: 148.52,
    price_change_percentage_24h: 3.24,
    market_cap: 72_400_000_000,
    total_volume: 3_200_000_000,
    image: '',
  },
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 97_350.0,
    price_change_percentage_24h: -1.12,
    market_cap: 1_920_000_000_000,
    total_volume: 28_500_000_000,
    image: '',
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 2_685.4,
    price_change_percentage_24h: 0.87,
    market_cap: 323_000_000_000,
    total_volume: 12_100_000_000,
    image: '',
  },
];

async function fetchCoinGeckoData(): Promise<{
  data: CoinData[];
  isMock: boolean;
}> {
  const apiKey = process.env.COINGECKO_API_KEY;

  if (!apiKey) {
    return { data: mockData, isMock: true };
  }

  try {
    // Pro keys (CG-...) use pro-api host + x-cg-pro-api-key header
    // Demo keys use api host + x-cg-demo-api-key header
    const isPro = apiKey.startsWith('CG-');
    const host = isPro
      ? 'https://pro-api.coingecko.com'
      : 'https://api.coingecko.com';
    const headerKey = isPro ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key';

    const url = new URL(`${host}/api/v3/coins/markets`);
    url.searchParams.set('vs_currency', 'usd');
    url.searchParams.set('ids', COIN_IDS.join(','));
    url.searchParams.set('order', 'market_cap_desc');
    url.searchParams.set('sparkline', 'false');

    const res = await fetch(url.toString(), {
      headers: {
        accept: 'application/json',
        [headerKey]: apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`CoinGecko API error: ${res.status}`);
      return { data: mockData, isMock: true };
    }

    const coins: CoinData[] = await res.json();
    return { data: coins, isMock: false };
  } catch (error) {
    console.error('CoinGecko fetch failed:', error);
    return { data: mockData, isMock: true };
  }
}

export const getCoinData = unstable_cache(
  fetchCoinGeckoData,
  ['coingecko-market-data'],
  { revalidate: 60 }
);
