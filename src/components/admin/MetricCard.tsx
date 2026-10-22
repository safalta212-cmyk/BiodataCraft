import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  changePercent?: number; // e.g. +12.5 or -4.2
  changeLabel?: string; // e.g. "vs yesterday" or "this period"
  colorTheme?: 'amber' | 'emerald' | 'blue' | 'indigo' | 'purple' | 'rose' | 'stone';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  changePercent,
  changeLabel = 'vs previous',
  colorTheme = 'amber',
  loading = false,
  onClick,
  className = ''
}) => {
  const colorStyles = {
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-200/60',
      border: 'hover:border-amber-300'
    },
    emerald: {
      bg: 'bg-emerald-50/50',
      text: 'text-emerald-950',
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200/60',
      border: 'hover:border-emerald-300'
    },
    blue: {
      bg: 'bg-sky-50/50',
      text: 'text-sky-950',
      iconBg: 'bg-sky-100 text-sky-800 border-sky-200/60',
      border: 'hover:border-sky-300'
    },
    indigo: {
      bg: 'bg-indigo-50/50',
      text: 'text-indigo-950',
      iconBg: 'bg-indigo-100 text-indigo-800 border-indigo-200/60',
      border: 'hover:border-indigo-300'
    },
    purple: {
      bg: 'bg-purple-50/50',
      text: 'text-purple-950',
      iconBg: 'bg-purple-100 text-purple-800 border-purple-200/60',
      border: 'hover:border-purple-300'
    },
    rose: {
      bg: 'bg-rose-50/50',
      text: 'text-rose-950',
      iconBg: 'bg-rose-100 text-rose-800 border-rose-200/60',
      border: 'hover:border-rose-300'
    },
    stone: {
      bg: 'bg-stone-50/50',
      text: 'text-stone-900',
      iconBg: 'bg-stone-100 text-stone-800 border-stone-200/60',
      border: 'hover:border-stone-400'
    }
  }[colorTheme];

  if (loading) {
    return (
      <Card className="border-stone-200 shadow-xs animate-pulse">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-stone-200 rounded w-24" />
            <div className="w-8 h-8 rounded-xl bg-stone-200" />
          </div>
          <div className="h-7 bg-stone-200 rounded w-16" />
          <div className="h-3 bg-stone-100 rounded w-32" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = typeof changePercent === 'number' && changePercent > 0;
  const isNegative = typeof changePercent === 'number' && changePercent < 0;
  const isNeutral = typeof changePercent === 'number' && changePercent === 0;

  return (
    <Card
      className={`border-stone-200 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${colorStyles.border} ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-3.5 sm:p-5 flex flex-col justify-between h-full">
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider truncate min-w-0">
              {title}
            </span>
            <div
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border ${colorStyles.iconBg}`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            </div>
          </div>

          {/* Main Stat Value */}
          <div className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-sans">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>

        {/* Footer Subtext & Trend Badge */}
        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-stone-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1 text-[10px] sm:text-[11px] text-stone-500">
          <span className="truncate max-w-[110px] sm:max-w-[170px]" title={subtext}>
            {subtext}
          </span>

          {typeof changePercent === 'number' && (
            <span
              className={`inline-flex items-center gap-0.5 sm:gap-1 font-semibold px-1 sm:px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] shrink-0 ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : isNegative
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {isPositive && <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />}
              {isNegative && <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-600" />}
              {isNeutral && <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-500" />}
              <span>{Math.abs(changePercent)}%</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
