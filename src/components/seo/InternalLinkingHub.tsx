import React from 'react';
import { Link } from 'react-router-dom';
import { getInternalLinksForSlug } from '../../services/internalLinkService';
import { Compass, BookOpen, Layers, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface InternalLinkingHubProps {
  currentSlug: string;
  categoryName: string;
}

export const InternalLinkingHub: React.FC<InternalLinkingHubProps> = ({
  currentSlug,
  categoryName
}) => {
  const linkCluster = getInternalLinksForSlug(currentSlug);

  return (
    <div className="space-y-8 bg-stone-100/70 border border-stone-200 rounded-3xl p-6 sm:p-10">
      {/* Sibling Related Guides */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Related Formats in {categoryName}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-cinzel">
              Explore Similar Matrimonial Profiles
            </h3>
          </div>
          <Link
            to="/biodata"
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 shrink-0"
          >
            <span>View All Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {linkCluster.siblingTopics.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="p-4 bg-white border border-stone-200 hover:border-amber-300 rounded-2xl shadow-2xs hover:shadow-xs transition-all group flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-800/80 uppercase tracking-wider block">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-stone-850 group-hover:text-amber-900 transition-colors line-clamp-1">
                  {item.anchorText}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Complementary Cross-Category Discovery */}
      {linkCluster.complementaryTopics.length > 0 && (
        <div className="pt-6 border-t border-stone-200 space-y-3">
          <div className="flex items-center gap-2 text-stone-800">
            <Compass className="w-4 h-4 text-amber-800" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Cross-Category Matrimonial Discovery
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {linkCluster.complementaryTopics.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="px-3.5 py-2 bg-white hover:bg-amber-50 hover:text-amber-900 border border-stone-200 hover:border-amber-300 rounded-xl font-medium text-stone-700 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                  {item.badge}
                </span>
                <span>{item.anchorText}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Core Services & Platform Hubs */}
      <div className="pt-6 border-t border-stone-200 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Core Matrimonial Services & Tools
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {linkCluster.pillarHubs.map((pillar, idx) => (
            <Link
              key={idx}
              to={pillar.path}
              className="p-3.5 bg-white/90 hover:bg-white border border-stone-200 hover:border-amber-400 rounded-xl text-center transition-all group shadow-2xs"
            >
              <span className="text-xs font-bold text-stone-800 group-hover:text-amber-900 block line-clamp-1">
                {pillar.title}
              </span>
              <span className="text-[10px] text-stone-500 group-hover:text-stone-700 line-clamp-1 mt-0.5 block">
                {pillar.anchorText}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
