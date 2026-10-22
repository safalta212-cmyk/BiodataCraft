import React, { useState, useId } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { DailyMetricPoint } from '../../../types/analytics';
import { TrendingUp, Calendar, Info } from 'lucide-react';

export interface AreaTrendChartProps {
  title: string;
  subtitle?: string;
  data: DailyMetricPoint[];
  metricKey: keyof Pick<DailyMetricPoint, 'visitors' | 'pageViews' | 'biodataGenerations' | 'downloads'>;
  metricLabel: string;
  colorScheme?: 'amber' | 'emerald' | 'blue' | 'purple';
  timeRanges?: number[]; // e.g. [7, 14, 30]
  selectedRange?: number;
  onRangeChange?: (days: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  badgeText?: string;
  className?: string;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({
  title,
  subtitle,
  data,
  metricKey,
  metricLabel,
  colorScheme = 'amber',
  timeRanges = [7, 14, 30],
  selectedRange = 14,
  onRangeChange,
  loading = false,
  emptyMessage = 'No telemetry points available for this period.',
  badgeText,
  className = ''
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const gradientId = useId();

  // Slice data based on selected range
  const displayData = data.slice(-selectedRange);

  const colors = {
    amber: {
      stroke: '#d97706',
      fillStart: 'rgba(217, 119, 6, 0.35)',
      fillEnd: 'rgba(217, 119, 6, 0.02)',
      dot: '#b45309',
      badge: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    emerald: {
      stroke: '#059669',
      fillStart: 'rgba(5, 150, 105, 0.35)',
      fillEnd: 'rgba(5, 150, 105, 0.02)',
      dot: '#047857',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    blue: {
      stroke: '#0284c7',
      fillStart: 'rgba(2, 132, 199, 0.35)',
      fillEnd: 'rgba(2, 132, 199, 0.02)',
      dot: '#0369a1',
      badge: 'bg-sky-50 text-sky-800 border-sky-200'
    },
    purple: {
      stroke: '#7c3aed',
      fillStart: 'rgba(124, 58, 237, 0.35)',
      fillEnd: 'rgba(124, 58, 237, 0.02)',
      dot: '#6d28d9',
      badge: 'bg-purple-50 text-purple-800 border-purple-200'
    }
  }[colorScheme];

  if (loading) {
    return (
      <Card className={`border-stone-200 shadow-xs animate-pulse ${className}`}>
        <CardHeader className="pb-2">
          <div className="h-5 bg-stone-200 rounded w-44 mb-1" />
          <div className="h-3.5 bg-stone-100 rounded w-64" />
        </CardHeader>
        <CardContent className="h-64 flex items-end justify-between gap-2 pt-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-stone-200 rounded-t w-full"
              style={{ height: `${20 + (i % 5) * 15}%` }}
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (displayData.length === 0) {
    return (
      <Card className={`border-stone-200 shadow-xs ${className}`}>
        <CardHeader>
          <CardTitle className="text-base font-cinzel text-stone-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-56 flex flex-col items-center justify-center text-center text-stone-400">
          <Info className="w-8 h-8 mb-2 text-stone-300" />
          <p className="text-xs">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate coordinates & bounds
  const values = displayData.map((d) => (d[metricKey] as number) || 0);
  const maxValue = Math.max(...values, 10);
  const minValue = Math.min(...values, 0);
  const totalSum = values.reduce((a, b) => a + b, 0);
  const avgValue = Math.round(totalSum / displayData.length);

  // SVG dimensions
  const width = 600;
  const height = 220;
  const paddingX = 30;
  const paddingY = 24;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  // Coordinate projection
  const getX = (index: number) => {
    if (displayData.length <= 1) return paddingX + innerWidth / 2;
    return paddingX + (index / (displayData.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const range = maxValue - minValue || 1;
    const normalized = (val - minValue) / range;
    return paddingY + innerHeight - normalized * innerHeight;
  };

  // Build smooth cubic Bézier curve
  const points = displayData.map((d, i) => ({
    x: getX(i),
    y: getY((d[metricKey] as number) || 0)
  }));

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX1 = curr.x + (next.x - curr.x) / 3;
    const cpY1 = curr.y;
    const cpX2 = curr.x + ((next.x - curr.x) * 2) / 3;
    const cpY2 = next.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    paddingY + innerHeight
  } L ${points[0].x} ${paddingY + innerHeight} Z`;

  const activePoint = hoverIndex !== null ? displayData[hoverIndex] : displayData[displayData.length - 1];
  const activeValue = (activePoint[metricKey] as number) || 0;
  const activeDate = activePoint.label || activePoint.date;

  return (
    <Card className={`border-stone-200 shadow-xs overflow-hidden ${className}`}>
      <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg font-bold font-cinzel text-stone-900">
              {title}
            </CardTitle>
            {badgeText && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors.badge}`}
              >
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Time Range Selector */}
        {timeRanges.length > 1 && (
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 self-end sm:self-auto">
            {timeRanges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => onRangeChange?.(range)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedRange === range
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {range}D
              </button>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-2 pb-5 space-y-4">
        {/* Quick Header Metric Summary */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">
              {hoverIndex !== null ? `On ${activeDate}` : `Latest (${activeDate})`}
            </span>
            <div className="text-2xl font-extrabold text-stone-900 tracking-tight">
              {activeValue.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500">{metricLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500">
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Period Total</span>
              <span className="font-bold text-stone-800">{totalSum.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Daily Avg</span>
              <span className="font-bold text-stone-800">{avgValue.toLocaleString()}/day</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Peak</span>
              <span className="font-bold text-stone-800">{maxValue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SVG Interactive Area */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] min-h-[180px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.fillStart} />
                <stop offset="100%" stopColor={colors.fillEnd} />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingY + innerHeight * (1 - ratio);
              const tickVal = Math.round(minValue + ratio * (maxValue - minValue));
              return (
                <g key={ratio}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 ? undefined : '3 3'}
                  />
                  <text
                    x={paddingX - 6}
                    y={y + 3}
                    textAnchor="end"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {tickVal}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill={`url(#${gradientId})`} />

            {/* Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active / Hover crosshair */}
            {hoverIndex !== null && (
              <g>
                <line
                  x1={points[hoverIndex].x}
                  y1={paddingY}
                  x2={points[hoverIndex].x}
                  y2={paddingY + innerHeight}
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={points[hoverIndex].x}
                  cy={points[hoverIndex].y}
                  r="5"
                  fill="#ffffff"
                  stroke={colors.stroke}
                  strokeWidth="3"
                />
              </g>
            )}

            {/* Transparent touch/click trigger bars */}
            {points.map((pt, i) => (
              <rect
                key={i}
                x={pt.x - innerWidth / (points.length * 2)}
                y={paddingY}
                width={innerWidth / points.length}
                height={innerHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
                onTouchStart={() => setHoverIndex(i)}
              />
            ))}
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between text-[10px] text-stone-400 font-medium px-2">
          <span>{displayData[0]?.label}</span>
          <span>{displayData[Math.floor(displayData.length / 2)]?.label}</span>
          <span>{displayData[displayData.length - 1]?.label}</span>
        </div>
      </CardContent>
    </Card>
  );
};
