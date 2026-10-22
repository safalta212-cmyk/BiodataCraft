import React, { useState, useEffect } from 'react';
import { adminService, AdminConfig } from '../services/adminService';
import { analyticsService, AggregateStats } from '../services/analyticsService';
import {
  Lock,
  Unlock,
  ShieldCheck,
  BarChart3,
  Sliders,
  Bell,
  Eye,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => adminService.isAuthenticated());
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [stats, setStats] = useState<AggregateStats>(() => analyticsService.getStats());
  const [config, setConfig] = useState<AdminConfig>(() => adminService.getConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setStats(analyticsService.getStats());
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const success = await adminService.login(passcode);
    if (success) {
      setIsAuthenticated(true);
      setPasscode('');
    } else {
      setAuthError('Invalid administrator credentials. Access denied.');
    }
  };

  const handleLogout = () => {
    adminService.logout();
    setIsAuthenticated(false);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = adminService.updateConfig(config);
    setConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleRefreshStats = () => {
    setStats(analyticsService.getStats());
  };

  // If not logged in, render secure login challenge
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-8 border border-stone-200 shadow-xl">
          <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-center text-stone-900 font-cinzel">
            Admin Portal
          </h2>
          <p className="text-xs text-center text-stone-500 mt-1 mb-6">
            Protected area for platform analytics and configuration.
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full text-sm border border-stone-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Authenticate & Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Header Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Secure Session Active
              </span>
              <span className="text-xs text-stone-400">• Protected Environment</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-cinzel mt-1">
              BiodataCraft Administrative Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshStats}
              className="p-2 text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
              title="Refresh Analytics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 1. Anonymous Analytics Metrics Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-800" />
              <span>Privacy-Conscious Anonymous Usage Metrics</span>
            </h2>
            <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Zero PII Stored
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500">Visitors</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1">
                {stats.visitors.toLocaleString()}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">Browser Instances</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500">Page Views</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1">
                {stats.pageViews.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                {(stats.pageViews / Math.max(1, stats.visitors)).toFixed(1)} / visitor
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500">Builder Starts</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1">
                {stats.builderStarts.toLocaleString()}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">Sessions</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500">Generations</span>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">
                {stats.biodataGenerations.toLocaleString()}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">PDFs Rendered</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500">Total Downloads</span>
              <div className="text-2xl font-extrabold text-emerald-800 mt-1">
                {stats.downloads.toLocaleString()}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">PDF + PNG Exports</span>
            </div>
          </div>
        </div>

        {/* 2. Template Popularity & Device Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template Popularity */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="font-bold text-stone-900 text-sm mb-4">
              Template Popularity Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.templateUsage).map(([tmplId, count]) => {
                const total = Math.max(1, Object.values(stats.templateUsage).reduce((a, b) => a + b, 0));
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={tmplId} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="capitalize">{tmplId.replace('-', ' ')}</span>
                      <span className="text-stone-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-800 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device & Language Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-stone-900 text-sm mb-3">Device Types</h3>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <div className="font-bold text-stone-900 text-lg">{stats.deviceCounts.mobile || 0}</div>
                  <span className="text-stone-500">Mobile</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <div className="font-bold text-stone-900 text-lg">{stats.deviceCounts.desktop || 0}</div>
                  <span className="text-stone-500">Desktop</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <div className="font-bold text-stone-900 text-lg">{stats.deviceCounts.tablet || 0}</div>
                  <span className="text-stone-500">Tablet</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">Language Preference</h3>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span>English: <strong className="text-stone-900">{stats.languageCounts.en || 0}</strong></span>
                <span>•</span>
                <span>हिन्दी (Hindi): <strong className="text-stone-900">{stats.languageCounts.hi || 0}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Platform Settings & Monetization Controls */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-amber-800" />
            <h3 className="font-bold text-stone-900 text-base">
              Advertising & Monetization Controls (AdSense Compliant)
            </h3>
          </div>

          {saveSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Configuration successfully updated!</span>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Ad Units Active
                </label>
                <select
                  value={config.adsEnabled ? 'true' : 'false'}
                  onChange={(e) => setConfig({ ...config, adsEnabled: e.target.value === 'true' })}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5 bg-white"
                >
                  <option value="true">Enabled (Show compliant ad spaces)</option>
                  <option value="false">Disabled (Completely hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Monetization Experience Level
                </label>
                <select
                  value={config.monetizationLevel}
                  onChange={(e) =>
                    setConfig({ ...config, monetizationLevel: e.target.value as any })
                  }
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5 bg-white"
                >
                  <option value="standard">Standard (Subtle footer & sidebar ads)</option>
                  <option value="template">Template (Targeted matrimonial sponsor units)</option>
                  <option value="advanced">Advanced (Multi-tier placement)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Site-wide Announcement Banner
              </label>
              <input
                type="text"
                value={config.announcementText}
                onChange={(e) => setConfig({ ...config, announcementText: e.target.value })}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5 bg-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Admin Settings
              </button>
            </div>
          </form>
        </div>

        {/* 4. Privacy Compliance Audit Checklist */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
          <h3 className="font-bold text-emerald-950 text-sm mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Architecture & Privacy Compliance Audit</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Core Principle 1: No Customer Registration enforced</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Core Principle 6: Zero customer biodata Firestore collection</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Core Principle 9: Technical event analytics only (No PII)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Core Principle 12: No horizontal scrolling across responsive targets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
