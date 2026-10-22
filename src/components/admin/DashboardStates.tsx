import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { AlertCircle, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

export const DashboardLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 bg-stone-200 rounded-lg w-56" />
          <div className="h-4 bg-stone-100 rounded-md w-80" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-stone-200 rounded-lg w-28" />
          <div className="h-8 bg-stone-200 rounded-lg w-28" />
        </div>
      </div>

      {/* KPI Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-stone-200 shadow-xs">
            <CardContent className="p-4 space-y-2">
              <div className="h-3 bg-stone-200 rounded w-20" />
              <div className="h-6 bg-stone-200 rounded w-14" />
              <div className="h-2.5 bg-stone-100 rounded w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-stone-200 shadow-xs h-72">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <div className="h-4 bg-stone-200 rounded w-36" />
            <div className="h-40 bg-stone-100 rounded-xl" />
          </CardContent>
        </Card>
        <Card className="border-stone-200 shadow-xs h-72">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <div className="h-4 bg-stone-200 rounded w-36" />
            <div className="h-40 bg-stone-100 rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export interface DashboardErrorBannerProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const DashboardErrorBanner: React.FC<DashboardErrorBannerProps> = ({
  title = 'Failed to load telemetry',
  message = 'Unable to aggregate anonymous platform statistics. Please try refreshing.',
  onRetry
}) => {
  return (
    <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-stone-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-red-950">{title}</h3>
          <p className="text-xs text-red-800/80 mt-0.5">{message}</p>
        </div>
      </div>

      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="border-red-300 text-red-900 hover:bg-red-100 shrink-0"
        >
          Retry
        </Button>
      )}
    </div>
  );
};
