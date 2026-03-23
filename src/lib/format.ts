export function formatUSD(value: number | null | undefined): string {
  if (value == null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 4,
  }).format(value);
}

export function formatCompact(value: number | null | undefined): string {
  if (value == null) return '-';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return '-';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatLargeUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(value);
}
