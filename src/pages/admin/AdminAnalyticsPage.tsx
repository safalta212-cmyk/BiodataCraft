import React, { useEffect, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { MetricCard } from '../../components/admin/MetricCard';
import { AreaTrendChart } from '../../components/admin/Charts/AreaTrendChart';
import { BarComparisonChart } from '../../components/admin/Charts/BarComparisonChart';
import { AnonymousActivityFeed } from '../../components/admin/AnonymousActivityFeed';
import { DashboardErrorBanner } from '../../components/admin/DashboardStates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { analyticsService, AggregateStats } from '../../services/analyticsService';
import { TEMPLATES } from '../../data/initialBiodata';
import {
  Users,
  Eye,
  FileCheck,
  Download,
  Calendar,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  RefreshCw,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AggregateStats>(() => analyticsService.getStats());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<number>(14);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const token = sessionStorage.getItem('biodatacraft_admin_token');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        const fresh = analyticsService.getStats();
        startTransition(() => {
          setStats(fresh);
          setLoading(false);
        });
      } catch {
        setError('Failed to refresh analytics telemetry.');
        setLoading(false);
      }
    }, 400);
  };

  const handleExportFull = () => {
    try {
      const exportData = {
        generatedAt: new Date().toISOString(),
        aggregateStats: stats,
        privacyStandard: 'Strictly Anonymous Platform Telemetry - Zero Customer PII'
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `biodatacraft-analytics-full-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Ignore
    }
  };

  // Calculations for distributions
  const totalDeviceCount = Math.max(
    1,
    (stats.deviceCategory.mobile || 0) +
      (stats.deviceCategory.desktop || 0) +
      (stats.deviceCategory.tablet || 0)
  );

  const totalBrowserCount = Math.max(
    1,
    Object.values(stats.browserCategory).reduce((a, b) => a + b, 0)
  );

  const totalTrafficCount = Math.max(
    1,
    Object.values(stats.trafficSource).reduce((a, b) => a + b, 0)
  );

  const templateBarItems = (stats.popularTemplates || []).map((t) => {
    const full = TEMPLATES.find((x) => x.id === t.id);
    return {
      id: t.id,
      label: t.name,
      value: t.count,
      percentage: t.percentage,
      color: full?.primaryColor || '#92400e',
      subtext: full?.category || 'Traditional'
    };
  });

  const downloadFormatBarItems = [
    {
      id: 'pdf',
      label: 'PDF Documents (Print & Share)',
      value: stats.downloadsBreakdown.pdf,
      color: '#059669',
      subtext: 'High-res vector PDF'
    },
    {
      id: 'png',
      label: 'PNG Images (WhatsApp HD)',
      value: stats.downloadsBreakdown.png,
      color: '#0284c7',
      subtext: 'Crisp image cards'
    },
    {
      id: 'print',
      label: 'Direct Browser Print',
      value: stats.downloadsBreakdown.print,
      color: '#d97706',
      subtext: 'System print dialog'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Zero Customer Data Mode: Active</span>
              </span>
              <span className="text-xs text-stone-400">
                • Real-time anonymous telemetry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel">
              Platform Analytics & Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Comprehensive visitor statistics, usage trends, client environments, and event logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportFull}
              className="text-stone-700 bg-white"
            >
              Export JSON
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleRefresh}
              isLoading={loading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh Metrics
            </Button>
          </div>
        </div>

        {error && (
          <DashboardErrorBanner
            title="Telemetry Error"
            message={error}
            onRetry={handleRefresh}
          />
        )}

        {/* 1. REQUIRED DASHBOARD METRICS:
            - Visitors Today
            - Page Views Today
            - Biodata Created Today
            - Downloads Today
            - Visitors This Month
            - Downloads This Month
            - Popular Templates */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Today vs Monthly Metrics
            </h2>
            <span className="text-[11px] text-stone-400">Strictly Non-PII Counters</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <MetricCard
              title="Visitors Today"
              value={stats.visitorsToday}
              subtext="Unique anonymous visitors"
              icon={Users}
              changePercent={8.4}
              colorTheme="amber"
              loading={loading}
            />

            <MetricCard
              title="Page Views Today"
              value={stats.pageViewsToday}
              subtext={`${(stats.pageViewsToday / Math.max(1, stats.visitorsToday)).toFixed(1)} views/visitor`}
              icon={Eye}
              changePercent={12.1}
              colorTheme="blue"
              loading={loading}
            />

            <MetricCard
              title="Biodata Created Today"
              value={stats.biodataCreatedToday}
              subtext="Renderings finished"
              icon={FileCheck}
              changePercent={14.8}
              colorTheme="purple"
              loading={loading}
            />

            <MetricCard
              title="Downloads Today"
              value={stats.downloadsToday}
              subtext="Saved to local storage"
              icon={Download}
              changePercent={9.2}
              colorTheme="emerald"
              loading={loading}
            />

            <MetricCard
              title="Visitors This Month"
              value={stats.visitorsThisMonth}
              subtext="Monthly active audience"
              icon={Calendar}
              colorTheme="stone"
              loading={loading}
            />

            <MetricCard
              title="Downloads This Month"
              value={stats.downloadsThisMonth}
              subtext="Monthly conversion total"
              icon={Sparkles}
              colorTheme="emerald"
              loading={loading}
            />
          </div>
        </div>

        {/* 2. REQUIRED CHARTS:
            1. Visitors over time
            2. Biodata generations
            3. Downloads
            4. Template usage */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Interactive Time-Series Telemetry
            </h2>

            {/* Global Range Switcher */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <span>Timeframe:</span>
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTimeRange(d)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      timeRange === d
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Visitors over time */}
            <AreaTrendChart
              title="Visitors Over Time"
              subtitle="Unique anonymous sessions visiting BiodataCraft"
              data={stats.dailyTimeSeries || []}
              metricKey="visitors"
              metricLabel="visitors"
              colorScheme="amber"
              timeRanges={[7, 14, 30]}
              selectedRange={timeRange}
              onRangeChange={setTimeRange}
              loading={loading}
              badgeText="Visitors"
            />

            {/* Chart 2: Biodata generations */}
            <AreaTrendChart
              title="Biodata Generations"
              subtitle="Full client-side PDF document constructions completed"
              data={stats.dailyTimeSeries || []}
              metricKey="biodataGenerations"
              metricLabel="creations"
              colorScheme="purple"
              timeRanges={[7, 14, 30]}
              selectedRange={timeRange}
              onRangeChange={setTimeRange}
              loading={loading}
              badgeText="Generations"
            />

            {/* Chart 3: Downloads */}
            <AreaTrendChart
              title="Downloads Completed"
              subtitle="Daily completed PDF, PNG, and print executions"
              data={stats.dailyTimeSeries || []}
              metricKey="downloads"
              metricLabel="downloads"
              colorScheme="emerald"
              timeRanges={[7, 14, 30]}
              selectedRange={timeRange}
              onRangeChange={setTimeRange}
              loading={loading}
              badgeText="Downloads"
            />

            {/* Chart 4: Template usage */}
            <BarComparisonChart
              title="Template Usage & Popularity"
              subtitle="Aggregate usage counts across the 6 cultural templates"
              items={templateBarItems}
              orientation="horizontal"
              metricUnit="uses"
              loading={loading}
              badgeText="Templates"
            />
          </div>
        </div>

        {/* 3. Conversion Funnel & Download Formats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg font-bold font-cinzel text-stone-900">
                Visitor Conversion Funnel
              </CardTitle>
              <CardDescription className="text-xs text-stone-500">
                Progression from landing on the website to downloading finalized biodata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1 pb-5">
              {[
                {
                  step: '1. Site Visitors',
                  count: stats.visitors,
                  pct: 100,
                  sub: 'Total unique browsers'
                },
                {
                  step: '2. Builder Sessions',
                  count: stats.builderStarts,
                  pct: Math.round((stats.builderStarts / Math.max(1, stats.visitors)) * 100),
                  sub: 'Initiated biodata builder'
                },
                {
                  step: '3. Biodata Rendered',
                  count: stats.biodataGenerations,
                  pct: Math.round((stats.biodataGenerations / Math.max(1, stats.visitors)) * 100),
                  sub: 'Completed preview generation'
                },
                {
                  step: '4. Downloads Completed',
                  count: stats.downloads,
                  pct: Math.round((stats.downloads / Math.max(1, stats.visitors)) * 100),
                  sub: 'Saved PDF / PNG locally'
                }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 p-2 rounded-xl bg-stone-50/70 border border-stone-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">{item.step}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-stone-600">{item.count.toLocaleString()}</span>
                      <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-800 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, item.pct)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 block">{item.sub}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Download Format Breakdown */}
          <BarComparisonChart
            title="Download Format Breakdown"
            subtitle="Distribution of file formats chosen by users"
            items={downloadFormatBarItems}
            orientation="horizontal"
            metricUnit="downloads"
            loading={loading}
            badgeText="Formats"
          />
        </div>

        {/* 4. Client Environment Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Device Distribution */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-800" />
                <CardTitle className="text-base font-cinzel text-stone-900">
                  Device Categories
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-stone-500">
                Screen & viewport classification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-1">
              {[
                {
                  label: 'Mobile',
                  count: stats.deviceCategory.mobile,
                  pct: Math.round((stats.deviceCategory.mobile / totalDeviceCount) * 100),
                  icon: Smartphone
                },
                {
                  label: 'Desktop',
                  count: stats.deviceCategory.desktop,
                  pct: Math.round((stats.deviceCategory.desktop / totalDeviceCount) * 100),
                  icon: Monitor
                },
                {
                  label: 'Tablet',
                  count: stats.deviceCategory.tablet,
                  pct: Math.round((stats.deviceCategory.tablet / totalDeviceCount) * 100),
                  icon: Tablet
                }
              ].map((dev) => (
                <div key={dev.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <dev.icon className="w-3.5 h-3.5 text-stone-500" />
                      <span className="font-semibold text-stone-800">{dev.label}</span>
                    </div>
                    <span className="font-mono text-stone-500 text-[11px]">
                      {dev.count} ({dev.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-800 h-full rounded-full"
                      style={{ width: `${dev.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Browser Category */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-800" />
                <CardTitle className="text-base font-cinzel text-stone-900">
                  Browser Categories
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-stone-500">
                Top browser rendering engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-1">
              {Object.entries(stats.browserCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([name, count]) => {
                  const pct = Math.round((count / totalBrowserCount) * 100);
                  return (
                    <div key={name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800">{name}</span>
                        <span className="font-mono text-stone-500 text-[11px]">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-800" />
                <CardTitle className="text-base font-cinzel text-stone-900">
                  Traffic Sources
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-stone-500">
                Referring channels & acquisition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-1">
              {Object.entries(stats.trafficSource)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([source, count]) => {
                  const pct = Math.round((count / totalTrafficCount) * 100);
                  return (
                    <div key={source} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800">{source}</span>
                        <span className="font-mono text-stone-500 text-[11px]">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-sky-700 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>

        {/* 5. Complete Searchable Anonymous Event Trail */}
        <AnonymousActivityFeed
          events={stats.recentEvents || []}
          loading={loading}
          maxItems={20}
          showFilters={true}
        />
      </div>
    </AdminLayout>
  );
};
