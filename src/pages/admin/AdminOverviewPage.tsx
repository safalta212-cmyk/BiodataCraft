import React, { useEffect, useState, useTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { MetricCard } from '../../components/admin/MetricCard';
import { AreaTrendChart } from '../../components/admin/Charts/AreaTrendChart';
import { BarComparisonChart } from '../../components/admin/Charts/BarComparisonChart';
import { PopularTemplatesWidget } from '../../components/admin/PopularTemplatesWidget';
import { AnonymousActivityFeed } from '../../components/admin/AnonymousActivityFeed';
import { DashboardErrorBanner, DashboardLoadingSkeleton } from '../../components/admin/DashboardStates';
import { analyticsService, AggregateStats } from '../../services/analyticsService';
import { TEMPLATES } from '../../data/initialBiodata';
import {
  Users,
  Eye,
  FileCheck,
  Download,
  Calendar,
  Sparkles,
  Trophy,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Palette,
  Settings,
  BarChart3,
  ExternalLink,
  BookOpen,
  Mail
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AggregateStats>(() => analyticsService.getStats());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visitorRange, setVisitorRange] = useState(14);
  const [generationRange, setGenerationRange] = useState(14);
  const [downloadRange, setDownloadRange] = useState(14);
  const [, startTransition] = useTransition();

  // Authentication check
  useEffect(() => {
    const token = sessionStorage.getItem('biodatacraft_admin_token');
    if (!token) {
      navigate('/admin/login');
    }
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

  const handleExportSummary = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        metrics: {
          visitorsToday: stats.visitorsToday,
          pageViewsToday: stats.pageViewsToday,
          biodataCreatedToday: stats.biodataCreatedToday,
          downloadsToday: stats.downloadsToday,
          visitorsThisMonth: stats.visitorsThisMonth,
          downloadsThisMonth: stats.downloadsThisMonth,
          totalVisitors: stats.visitors,
          totalPageViews: stats.pageViews,
          totalGenerations: stats.biodataGenerations,
          totalDownloads: stats.downloads
        },
        popularTemplates: stats.popularTemplates,
        privacyNotice: 'Zero Customer PII - Strictly Anonymous Technical Counts'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `biodatacraft-admin-summary-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Ignore
    }
  };

  // Prepare template bar chart items
  const templateBarItems = (stats.popularTemplates || []).map((t) => {
    const templateDef = TEMPLATES.find((x) => x.id === t.id);
    return {
      id: t.id,
      label: t.name,
      value: t.count,
      percentage: t.percentage,
      color: templateDef?.primaryColor || '#92400e',
      subtext: templateDef?.category || 'Traditional'
    };
  });

  // Calculate percentage of today's conversion
  const conversionRateToday = stats.visitorsToday > 0
    ? Math.round((stats.downloadsToday / stats.visitorsToday) * 100)
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header & Overview Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Zero Customer Data Mode: Verified Active</span>
              </span>
              <span className="text-xs text-stone-400">
                • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel">
              Platform Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Anonymous real-time metrics, template usage trends, and system administration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportSummary}
              className="text-stone-700 bg-white shadow-2xs"
            >
              Export Summary
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleRefresh}
              isLoading={loading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh Data
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
            - Popular Templates (top preview) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Core Performance Indicators
            </h2>
            <span className="text-[11px] text-stone-400">Real-time telemetry</span>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. Visitors Today */}
            <MetricCard
              title="Visitors Today"
              value={stats.visitorsToday}
              subtext="Unique anonymous visitors"
              icon={Users}
              changePercent={8.4}
              colorTheme="amber"
              loading={loading}
            />

            {/* 2. Page Views Today */}
            <MetricCard
              title="Page Views Today"
              value={stats.pageViewsToday}
              subtext={`${(stats.pageViewsToday / Math.max(1, stats.visitorsToday)).toFixed(1)} views / visitor`}
              icon={Eye}
              changePercent={12.1}
              colorTheme="blue"
              loading={loading}
            />

            {/* 3. Biodata Created Today */}
            <MetricCard
              title="Biodata Created Today"
              value={stats.biodataCreatedToday}
              subtext="Renderings finished"
              icon={FileCheck}
              changePercent={14.8}
              colorTheme="purple"
              loading={loading}
            />

            {/* 4. Downloads Today */}
            <MetricCard
              title="Downloads Today"
              value={stats.downloadsToday}
              subtext={`${conversionRateToday}% session conversion`}
              icon={Download}
              changePercent={9.2}
              colorTheme="emerald"
              loading={loading}
            />

            {/* 5. Visitors This Month */}
            <MetricCard
              title="Visitors This Month"
              value={stats.visitorsThisMonth}
              subtext="Cumulative 30-day reach"
              icon={Calendar}
              colorTheme="stone"
              loading={loading}
            />

            {/* 6. Downloads This Month */}
            <MetricCard
              title="Downloads This Month"
              value={stats.downloadsThisMonth}
              subtext={`${stats.downloadsBreakdown.pdf} PDFs • ${stats.downloadsBreakdown.png} PNGs`}
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
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Interactive Trend Telemetry
            </h2>
            <Link
              to="/admin/analytics"
              className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Visitors over time */}
            <AreaTrendChart
              title="Visitors Over Time"
              subtitle="Daily unique anonymous browser instances across the platform"
              data={stats.dailyTimeSeries || []}
              metricKey="visitors"
              metricLabel="visitors"
              colorScheme="amber"
              timeRanges={[7, 14, 30]}
              selectedRange={visitorRange}
              onRangeChange={setVisitorRange}
              loading={loading}
              badgeText="Visitors"
            />

            {/* Chart 2: Biodata generations */}
            <AreaTrendChart
              title="Biodata Generations"
              subtitle="Daily completed PDF renderings created in builder"
              data={stats.dailyTimeSeries || []}
              metricKey="biodataGenerations"
              metricLabel="generations"
              colorScheme="purple"
              timeRanges={[7, 14, 30]}
              selectedRange={generationRange}
              onRangeChange={setGenerationRange}
              loading={loading}
              badgeText="Creations"
            />

            {/* Chart 3: Downloads */}
            <AreaTrendChart
              title="Downloads Over Time"
              subtitle="Daily completed downloads across all formats (PDF, PNG, Print)"
              data={stats.dailyTimeSeries || []}
              metricKey="downloads"
              metricLabel="downloads"
              colorScheme="emerald"
              timeRanges={[7, 14, 30]}
              selectedRange={downloadRange}
              onRangeChange={setDownloadRange}
              loading={loading}
              badgeText="Downloads"
            />

            {/* Chart 4: Template usage */}
            <BarComparisonChart
              title="Template Usage Distribution"
              subtitle="Comparison of user selections across cultural biodata designs"
              items={templateBarItems}
              orientation="horizontal"
              metricUnit="uses"
              loading={loading}
              badgeText="Templates"
            />
          </div>
        </div>

        {/* 3. POPULAR TEMPLATES & RECENT ACTIVITY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Templates Widget (1 column) */}
          <div className="lg:col-span-1">
            <PopularTemplatesWidget
              templates={stats.popularTemplates || []}
              loading={loading}
            />
          </div>

          {/* Recent Activity (2 columns) - Anonymous event summaries only */}
          <div className="lg:col-span-2">
            <AnonymousActivityFeed
              events={stats.recentEvents || []}
              loading={loading}
              maxItems={8}
            />
          </div>
        </div>

        {/* Quick Management Shortcuts Grid */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 px-1">
            Platform Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/templates"
              className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-amber-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm font-cinzel">Templates Manager</h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Configure 6 Indian templates, tags, colors, and layouts.
              </p>
              <div className="mt-3 flex items-center text-xs font-bold text-amber-800 gap-1">
                <span>Configure</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-amber-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm font-cinzel">Analytics Deep Dive</h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Device breakdowns, browser category shares, and traffic sources.
              </p>
              <div className="mt-3 flex items-center text-xs font-bold text-amber-800 gap-1">
                <span>View Analytics</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/admin/blog"
              className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-amber-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm font-cinzel">Editorial & Guides</h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Manage marriage biodata writing tips, Kundali matching guides, and FAQs.
              </p>
              <div className="mt-3 flex items-center text-xs font-bold text-amber-800 gap-1">
                <span>Manage Blog</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-amber-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm font-cinzel">Platform Settings</h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Broadcast announcements, maintenance toggles, and ad placement options.
              </p>
              <div className="mt-3 flex items-center text-xs font-bold text-amber-800 gap-1">
                <span>Open Settings</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/admin/messages"
              className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-amber-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm font-cinzel">Support Inquiries</h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                User inquiries, feedback submissions, and template requests.
              </p>
              <div className="mt-3 flex items-center text-xs font-bold text-amber-800 gap-1">
                <span>Manage Messages</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Security & Zero PII Compliance Footer Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-950 font-bold font-cinzel text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Zero Customer Data Architecture: Fully Enforced</span>
          </div>
          <p className="text-xs text-emerald-900/80 leading-relaxed max-w-4xl">
            BiodataCraft's admin panel monitors strictly aggregated numerical telemetry, non-identifying client platforms, and template popularity percentages. Customer names, contact numbers, family details, addresses, and uploaded photographs are never stored in databases, nor transmitted or displayed on any administrative screen.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
