import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Layers, Info } from 'lucide-react';

export interface BarItem {
  id: string;
  label: string;
  value: number;
  color?: string;
  percentage?: number;
  subtext?: string;
}

export interface BarComparisonChartProps {
  title: string;
  subtitle?: string;
  items: BarItem[];
  orientation?: 'horizontal' | 'vertical';
  metricUnit?: string;
  loading?: boolean;
  emptyMessage?: string;
  badgeText?: string;
  className?: string;
}

export const BarComparisonChart: React.FC<BarComparisonChartProps> = ({
  title,
  subtitle,
  items,
  orientation = 'horizontal',
  metricUnit = 'uses',
  loading = false,
  emptyMessage = 'No comparison data available.',
  badgeText,
  className = ''
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (loading) {
    return (
      <Card className={`border-stone-200 shadow-xs animate-pulse ${className}`}>
        <CardHeader className="pb-2">
          <div className="h-5 bg-stone-200 rounded w-40 mb-1" />
          <div className="h-3 bg-stone-100 rounded w-52" />
        </CardHeader>
        <CardContent className="space-y-4 pt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 bg-stone-200 rounded w-28" />
                <div className="h-3 bg-stone-200 rounded w-12" />
              </div>
              <div className="h-3 bg-stone-100 rounded-full w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className={`border-stone-200 shadow-xs ${className}`}>
        <CardHeader>
          <CardTitle className="text-base font-cinzel text-stone-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-48 flex flex-col items-center justify-center text-center text-stone-400">
          <Info className="w-8 h-8 mb-2 text-stone-300" />
          <p className="text-xs">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...items.map((it) => it.value), 1);
  const totalValue = items.reduce((a, b) => a + b.value, 0) || 1;

  // Default color palette for items that don't specify their own
  const palette = [
    '#92400e', // amber-800
    '#047857', // emerald-700
    '#0369a1', // sky-700
    '#6d28d9', // purple-700
    '#be185d', // pink-700
    '#b45309'  // amber-700
  ];

  return (
    <Card className={`border-stone-200 shadow-xs ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg font-bold font-cinzel text-stone-900">
              {title}
            </CardTitle>
            {badgeText && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
          <Layers className="w-4 h-4" />
        </div>
      </CardHeader>

      <CardContent className="pt-3 pb-5">
        {orientation === 'horizontal' ? (
          <div className="space-y-3.5">
            {items.map((item, idx) => {
              const pct = item.percentage ?? Math.round((item.value / totalValue) * 100);
              const barWidth = Math.max(3, Math.round((item.value / maxValue) * 100));
              const barColor = item.color || palette[idx % palette.length];
              const isHovered = hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-2 rounded-xl transition-colors cursor-default ${
                    isHovered ? 'bg-stone-50' : ''
                  }`}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: barColor }}
                      />
                      <span className="font-semibold text-stone-800 truncate">{item.label}</span>
                      {item.subtext && (
                        <span className="text-[10px] text-stone-400 hidden sm:inline">
                          ({item.subtext})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                      <span className="font-bold text-stone-900">
                        {item.value.toLocaleString()} {metricUnit}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-400 w-9 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: barColor,
                        opacity: hoveredId && !isHovered ? 0.6 : 1
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Vertical Column Layout */
          <div className="pt-4">
            <div className="h-44 flex items-end justify-between gap-3 border-b border-stone-200 pb-2">
              {items.map((item, idx) => {
                const barHeight = Math.max(6, Math.round((item.value / maxValue) * 100));
                const barColor = item.color || palette[idx % palette.length];
                const isHovered = hoveredId === item.id;

                return (
                  <div
                    key={item.id}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <span
                      className={`text-[10px] font-mono mb-1 transition-opacity ${
                        isHovered ? 'opacity-100 font-bold text-stone-900' : 'opacity-0'
                      }`}
                    >
                      {item.value}
                    </span>
                    <div className="w-full bg-stone-100 rounded-t-lg h-full flex items-end">
                      <div
                        className="w-full rounded-t-lg transition-all duration-300"
                        style={{
                          height: `${barHeight}%`,
                          backgroundColor: barColor,
                          opacity: hoveredId && !isHovered ? 0.6 : 1
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 mt-2 truncate w-full text-center">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
