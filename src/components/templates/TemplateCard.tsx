import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Template } from '../../types/template';
import { Button } from '../ui/Button';
import { Eye, Sparkles, Crown } from 'lucide-react';
import { getTemplateDisplayThumbnail } from '../../utils/templateVisuals';

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onUseTemplate
}) => {
  const { templateConfig } = template;
  const isPremium = template.isPremium;
  const [imageError, setImageError] = useState(false);
  const displayThumbnail = getTemplateDisplayThumbnail(template);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      {/* 1. Visual Card Header / Image Showcase Box */}
      <div
        className="h-48 relative flex flex-col justify-between cursor-pointer select-none overflow-hidden bg-stone-100"
        onClick={() => onPreview(template)}
      >
        {/* Render Thumbnail Image */}
        {!imageError && (
          <img
            src={displayThumbnail}
            alt={template.name}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Gradient Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/35 to-stone-950/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 p-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-stone-900 shadow-sm border border-stone-200 backdrop-blur-xs">
              {template.categoryName || template.categoryId}
            </span>
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-amber-200 shadow-sm border border-white/20 backdrop-blur-xs">
              From BiodataCraft
            </span>
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 ${
              isPremium
                ? 'bg-amber-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isPremium && <Crown className="w-2.5 h-2.5" />}
            <span>{isPremium ? 'Royal Design (Free)' : '100% Free'}</span>
          </span>
        </div>

        {/* Bottom Bar overlaying the image */}
        <div className="relative z-10 p-3 flex items-end justify-between text-white">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-amber-200 line-clamp-1">
              {templateConfig?.defaultHeaderTitle || '॥ श्री गणेशाय नमः ॥'}
            </div>
            <div className="text-sm font-extrabold font-cinzel line-clamp-1 drop-shadow-sm text-white">
              {template.name}
            </div>
            <div className="text-[10px] text-stone-200 font-medium">
              {template.region} • {template.religion}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
              style={{ backgroundColor: templateConfig?.primaryColor || '#7a1426' }}
              title="Primary Tone"
            />
            <span
              className="w-3 h-3 rounded-full border border-white shadow-xs"
              style={{ backgroundColor: templateConfig?.secondaryColor || '#c59b27' }}
              title="Secondary Accent"
            />
          </div>
        </div>

        {/* Hover Eye Overlay Indicator */}
        <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-2xs z-20">
          <Eye className="w-4 h-4" />
          <span>Click to Full Preview</span>
        </div>
      </div>

      {/* 2. Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-base text-stone-900 font-cinzel group-hover:text-amber-800 transition-colors">
              <Link to={`/templates/${template.slug}`}>{template.name}</Link>
            </h3>
            <span className="text-[11px] font-semibold text-stone-400 capitalize">
              {template.style}
            </span>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
            {template.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="text-[11px] text-amber-950 font-medium bg-amber-50/70 p-2 rounded-xl border border-amber-200/50">
            <span className="font-bold text-amber-900">Recommended for: </span>
            <span className="line-clamp-1">{template.popularFor}</span>
          </div>

          {/* Action Buttons: Preview & Use Template */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPreview(template)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
              className="w-full text-xs font-semibold"
            >
              Preview
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => onUseTemplate(template)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-200" />}
              className="w-full text-xs font-bold"
            >
              Use Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
