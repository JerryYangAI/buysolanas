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

  const coords = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = padding + innerH - ((v - min) / range) * innerH;
    return { x: +x.toFixed(1), y: +y.toFixed(1) };
  });

  const points = coords.map((c) => `${c.x},${c.y}`).join(' ');

  // Build polygon for gradient fill area
  const fillPoints = [
    `${coords[0].x},${height}`,
    ...coords.map((c) => `${c.x},${c.y}`),
    `${coords[coords.length - 1].x},${height}`,
  ].join(' ');

  const color = isUp ? '#34d399' : '#f87171';
  const gradId = `sparkGrad-${isUp ? 'up' : 'down'}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${gradId})`} points={fillPoints} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
