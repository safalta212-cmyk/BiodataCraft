import React from 'react';
import { Link } from 'react-router-dom';
import { Template } from '../../types/template';
import { Button } from '../ui/Button';
import { Eye, Sparkles, Crown, Check } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      {/* 1. Visual Card Header / Mini Preview Box */}
      <div
        className="h-44 p-4 relative flex flex-col justify-between cursor-pointer select-none overflow-hidden"
        style={{ backgroundColor: templateConfig.accentBg || '#fffaf5' }}
        onClick={() => onPreview(template)}
      >
        {/* Miniature Document Border Frame */}
        <div
          className="absolute inset-3 border-2 pointer-events-none rounded-lg"
          style={{ borderColor: templateConfig.secondaryColor }}
        >
          <div
            className="absolute inset-1 border pointer-events-none rounded-md"
            style={{ borderColor: templateConfig.primaryColor, opacity: 0.6 }}
          />
        </div>

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/90 text-stone-800 shadow-2xs border border-stone-200">
            {template.categoryName || template.categoryId}
          </span>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1 ${
              isPremium
                ? 'bg-amber-800 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isPremium && <Crown className="w-2.5 h-2.5" />}
            <span>{isPremium ? 'Royal Design (Free)' : '100% Free'}</span>
          </span>
        </div>

        {/* Center Aesthetic Preview Motif */}
        <div className="relative z-10 text-center my-auto px-4">
          <div
            className="text-xs font-bold tracking-widest uppercase mb-1"
            style={{ color: templateConfig.primaryColor }}
          >
            {templateConfig.defaultHeaderTitle || '॥ श्री गणेशाय नमः ॥'}
          </div>
          <div
            className="text-base font-extrabold font-cinzel line-clamp-1"
            style={{ color: templateConfig.primaryColor }}
          >
            {template.name}
          </div>
          <div className="text-[10px] text-stone-500 font-medium mt-0.5">
            {template.region} • {template.religion}
          </div>
        </div>

        {/* Bottom Color Swatches Bar */}
        <div className="relative z-10 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
              style={{ backgroundColor: templateConfig.primaryColor }}
              title="Primary Tone"
            />
            <span
              className="w-3 h-3 rounded-full border border-white shadow-xs"
              style={{ backgroundColor: templateConfig.secondaryColor }}
              title="Secondary Accent"
            />
          </div>

          <span className="text-[10px] text-stone-500 font-semibold bg-white/80 px-2 py-0.5 rounded">
            A4 Print-Ready
          </span>
        </div>

        {/* Hover Eye Overlay Indicator */}
        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-2xs">
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
