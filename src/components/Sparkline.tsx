export default function Sparkline({
  data,
  isUp,
  width = 120,
  height = 32,
}: {
  data: number[];
  isUp: boolean;
  width?: number;
  height?: number;
}) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const innerH = height - padding * 2;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = padding + innerH - ((v - min) / range) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block"
    >
      <polyline
        fill="none"
        stroke={isUp ? '#34d399' : '#f87171'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
