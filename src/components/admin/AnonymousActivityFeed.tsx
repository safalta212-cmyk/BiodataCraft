import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { AnonymousAnalyticsEvent, AnalyticsEventType } from '../../types/analytics';
import {
  ShieldCheck,
  Download,
  FileCheck,
  Palette,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  Search,
  Filter,
  Info
} from 'lucide-react';

export interface AnonymousActivityFeedProps {
  events: AnonymousAnalyticsEvent[];
  loading?: boolean;
  maxItems?: number;
  showFilters?: boolean;
  className?: string;
}

export const AnonymousActivityFeed: React.FC<AnonymousActivityFeedProps> = ({
  events,
  loading = false,
  maxItems = 10,
  showFilters = true,
  className = ''
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (loading) {
    return (
      <Card className={`border-stone-200 shadow-xs animate-pulse ${className}`}>
        <CardHeader className="pb-3">
          <div className="h-5 bg-stone-200 rounded w-40 mb-1" />
          <div className="h-3 bg-stone-100 rounded w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-stone-100 rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Filter events safely
  const filteredEvents = events.filter((evt) => {
    // Category match
    if (filterType === 'downloads') {
      const isDownload =
        evt.eventName === 'download_completed' ||
        evt.eventName === 'download_pdf' ||
        evt.eventName === 'download_png' ||
        evt.eventName === 'print_biodata';
      if (!isDownload) return false;
    } else if (filterType === 'generations') {
      if (evt.eventName !== 'pdf_generation_completed' && evt.eventName !== 'preview_generated') {
        return false;
      }
    } else if (filterType === 'templates') {
      if (evt.eventName !== 'template_selected' && evt.eventName !== 'template_view') {
        return false;
      }
    } else if (filterType === 'pages') {
      if (evt.eventName !== 'page_view') return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const templateMatch = (evt.templateId || evt.metadata?.templateId as string || '').toLowerCase().includes(q);
      const nameMatch = evt.eventName.toLowerCase().includes(q);
      const formatMatch = (evt.metadata?.format as string || '').toLowerCase().includes(q);
      const pathMatch = (evt.metadata?.pagePath as string || '').toLowerCase().includes(q);
      return templateMatch || nameMatch || formatMatch || pathMatch;
    }

    return true;
  });

  const displayList = filteredEvents.slice(0, maxItems);

  // Helper for human-readable relative time
  const formatTimeAgo = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Helper for anonymous event formatting
  const getEventMeta = (evt: AnonymousAnalyticsEvent) => {
    switch (evt.eventName) {
      case 'download_completed':
      case 'download_pdf':
      case 'download_png':
      case 'print_biodata': {
        const fmt = (evt.metadata?.format as string) || (evt.eventName.includes('pdf') ? 'PDF' : evt.eventName.includes('png') ? 'PNG' : 'Print');
        const tmpl = (evt.metadata?.templateId as string) || evt.templateId || 'Template';
        return {
          title: `Biodata downloaded (${fmt.toUpperCase()})`,
          detail: `Design: ${tmpl.replace('-', ' ')}`,
          icon: Download,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
        };
      }
      case 'pdf_generation_completed': {
        const tmpl = (evt.metadata?.templateId as string) || evt.templateId || 'Standard';
        return {
          title: 'Biodata PDF generated',
          detail: `Template: ${tmpl.replace('-', ' ')}`,
          icon: FileCheck,
          badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
        };
      }
      case 'template_selected': {
        const tmpl = (evt.metadata?.templateId as string) || evt.templateId || 'Template';
        return {
          title: 'Template chosen',
          detail: `Selected: ${tmpl.replace('-', ' ')}`,
          icon: Palette,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
        };
      }
      case 'template_view': {
        const tmpl = (evt.metadata?.templateId as string) || evt.templateId || 'Template';
        return {
          title: 'Template previewed',
          detail: `Inspected: ${tmpl.replace('-', ' ')}`,
          icon: Eye,
          badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
        };
      }
      case 'page_view': {
        const path = (evt.metadata?.pagePath as string) || evt.page || '/';
        return {
          title: 'Page viewed',
          detail: `Path: ${path}`,
          icon: Eye,
          badgeColor: 'bg-stone-100 text-stone-700 border-stone-200'
        };
      }
      default:
        return {
          title: evt.eventName.replace(/_/g, ' '),
          detail: 'Anonymous platform event',
          icon: ShieldCheck,
          badgeColor: 'bg-stone-100 text-stone-700 border-stone-200'
        };
    }
  };

  return (
    <Card className={`border-stone-200 shadow-xs ${className}`}>
      <CardHeader className="pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg font-bold font-cinzel text-stone-900">
              Recent Activity
            </CardTitle>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Zero PII Telemetry</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Strictly anonymous platform event stream. Never logs customer names, phones, or biodata.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-48 self-end sm:self-auto">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </CardHeader>

      {/* Filter Tabs */}
      {showFilters && (
        <div className="px-5 pb-3 flex flex-wrap items-center gap-1.5 border-b border-stone-100">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'downloads', label: 'Downloads' },
            { id: 'generations', label: 'Generations' },
            { id: 'templates', label: 'Templates' },
            { id: 'pages', label: 'Page Views' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-amber-800 text-white'
                  : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <CardContent className="pt-3 pb-5">
        {displayList.length === 0 ? (
          <div className="py-8 text-center text-stone-400 space-y-1">
            <Info className="w-6 h-6 mx-auto text-stone-300" />
            <p className="text-xs font-medium">No matching events in the current stream</p>
            <p className="text-[10px] text-stone-400">Try changing the filter or search term</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayList.map((evt) => {
              const meta = getEventMeta(evt);
              const Icon = meta.icon;

              return (
                <div
                  key={evt.eventId}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 bg-stone-50/40 hover:bg-stone-50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${meta.badgeColor}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-800 truncate">
                        {meta.title}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate capitalize">
                        {meta.detail}
                      </div>
                    </div>
                  </div>

                  {/* Device & Time */}
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-stone-400 font-mono">
                      {evt.deviceCategory === 'mobile' && <Smartphone className="w-3 h-3" />}
                      {evt.deviceCategory === 'desktop' && <Monitor className="w-3 h-3" />}
                      {evt.deviceCategory === 'tablet' && <Tablet className="w-3 h-3" />}
                      <span className="capitalize">{evt.deviceCategory}</span>
                      <span>•</span>
                      <span>{evt.browserCategory}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-stone-400 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(evt.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
