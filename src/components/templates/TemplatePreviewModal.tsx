import React, { useState } from 'react';
import { Template } from '../../types/template';
import { BiodataTemplateView } from './BiodataTemplateView';
import { sampleHinduBiodata, sampleHindiBiodata } from '../../data/initialBiodata';
import { Button } from '../ui/Button';
import { X, Sparkles, ZoomIn, ZoomOut, Check, ArrowRight } from 'lucide-react';

interface TemplatePreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: Template) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate
}) => {
  const [sampleType, setSampleType] = useState<'groom' | 'bride'>('groom');
  const [scale, setScale] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const vw = window.innerWidth;
      if (vw < 360) return 0.36;
      if (vw < 400) return 0.42;
      if (vw < 480) return 0.48;
      if (vw < 768) return 0.62;
    }
    return 0.75;
  });

  if (!isOpen || !template) return null;

  const currentSampleData = sampleType === 'groom' ? sampleHinduBiodata : sampleHindiBiodata;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex flex-col animate-in fade-in duration-150"
    >
      {/* Top Modal Navigation Header */}
      <div className="bg-stone-900 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-stone-800 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer shrink-0"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="font-bold text-xs sm:text-base font-cinzel truncate max-w-[120px] xs:max-w-none">{template.name}</h2>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase bg-amber-800 text-white px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                {template.isPremium ? 'Premium' : 'Free'}
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block truncate">{template.tagline}</p>
          </div>
        </div>

        {/* Controls: Sample switcher, Zoom, Use Template CTA */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Sample Switcher */}
          <div className="bg-stone-800 p-0.5 rounded-xl flex items-center text-xs font-semibold border border-stone-700">
            <button
              onClick={() => setSampleType('groom')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                sampleType === 'groom'
                  ? 'bg-amber-800 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">Groom (English)</span>
              <span className="sm:hidden">Groom</span>
            </button>
            <button
              onClick={() => setSampleType('bride')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                sampleType === 'bride'
                  ? 'bg-amber-800 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">वधू (हिन्दी)</span>
              <span className="sm:hidden">वधू</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1.5 text-stone-400 bg-stone-800 px-2 py-1 rounded-xl text-xs">
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.05))}
              className="p-1 hover:text-white cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px]">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(1.0, s + 0.05))}
              className="p-1 hover:text-white cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Use Template CTA */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => onUseTemplate(template)}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-200" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />}
            className="shadow-md text-xs px-2.5 sm:px-3 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Use This Template</span>
            <span className="sm:hidden">Use</span>
          </Button>
        </div>
      </div>

      {/* Main Document Viewer Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-stone-900/60">
        <div className="my-auto">
          <BiodataTemplateView
            data={currentSampleData}
            templateOverride={template}
            scale={scale}
            id="template-modal-preview"
          />
        </div>
      </div>
    </div>
  );
};
