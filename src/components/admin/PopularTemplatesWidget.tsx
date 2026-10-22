import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { PopularTemplateItem } from '../../types/analytics';
import { TEMPLATES } from '../../data/initialBiodata';
import { Trophy, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

export interface PopularTemplatesWidgetProps {
  templates: PopularTemplateItem[];
  loading?: boolean;
  className?: string;
}

export const PopularTemplatesWidget: React.FC<PopularTemplatesWidgetProps> = ({
  templates,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <Card className={`border-stone-200 shadow-xs animate-pulse ${className}`}>
        <CardHeader className="pb-3">
          <div className="h-5 bg-stone-200 rounded w-44 mb-1" />
          <div className="h-3 bg-stone-100 rounded w-60" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-stone-100 rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Map template configurations for visual details
  const enrichedTemplates = templates.map((tmpl, idx) => {
    const full = TEMPLATES.find((t) => t.id === tmpl.id);
    return {
      ...tmpl,
      rank: idx + 1,
      category: full?.category || 'Traditional',
      primaryColor: full?.primaryColor || '#8B0000',
      badge: idx === 0 ? 'Top Pick' : idx === 1 ? 'Trending' : undefined
    };
  });

  const rankBadges = [
    'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    'bg-stone-200 text-stone-800 border-stone-300 font-bold',
    'bg-orange-100 text-orange-900 border-orange-300 font-bold'
  ];

  return (
    <Card className={`border-stone-200 shadow-xs ${className}`}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg font-bold font-cinzel text-stone-900">
              Popular Templates
            </CardTitle>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-600" />
              <span>Ranked</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Most selected and downloaded biodata designs by users
          </p>
        </div>

        <Link to="/admin/templates">
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3 h-3" />}>
            All Templates
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-2 pb-5 space-y-3">
        {enrichedTemplates.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-2xl border border-stone-200/80 bg-stone-50/60 hover:bg-stone-50 hover:border-amber-200 transition-colors gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Rank Badge */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 border ${
                  rankBadges[item.rank - 1] || 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                #{item.rank}
              </div>

              {/* Color Swatch & Names */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.primaryColor }}
                  />
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                    {item.name}
                  </h4>
                  {item.badge && (
                    <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-500 block truncate">
                  {item.category} Category
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="text-right shrink-0">
              <div className="flex items-center gap-2 justify-end">
                <span className="font-extrabold text-stone-900 text-sm font-mono">
                  {item.count.toLocaleString()}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {item.percentage}%
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">Total Generations</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
