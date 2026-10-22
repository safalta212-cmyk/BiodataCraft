import React, { useState } from 'react';
import { BiodataData, TemplateId } from '../../types/biodata';
import { BiodataRenderer } from '../renderer/BiodataRenderer';
import { TEMPLATES } from '../../data/initialBiodata';
import { analyticsService } from '../../services/analyticsService';
import {
  X,
  Download,
  Printer,
  ArrowLeft,
  Palette,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileCheck2,
  Globe
} from 'lucide-react';

export interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BiodataData;
  onOpenDownload?: () => void;
  onPrint?: () => void;
  language?: 'en' | 'hi' | 'bilingual';
  onChangeTemplate?: (templateId: TemplateId) => void;
  onChangeLanguage?: (lang: 'en' | 'hi' | 'bilingual') => void;
}

/**
 * Enhanced LivePreviewModal
 * Implements Phase 5 Live Biodata Preview requirements:
 * - Preview & Fullscreen Preview
 * - Back to Edit (clear navigation back to builder)
 * - Change Template on-the-fly with real-time visual update
 * - Zoom & Scaling controls for desktop and mobile viewports
 * - Multi-page awareness
 */
export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  onOpenDownload,
  onPrint,
  language = 'en',
  onChangeTemplate,
  onChangeLanguage
}) => {
  // Automatically compute optimal scale fitting viewport (mobile 320px - desktop 1920px)
  const [scale, setScale] = useState<number>(0.85);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(1);

  React.useEffect(() => {
    if (!isOpen) return;
    const computeScale = () => {
      if (typeof window === 'undefined') return 0.85;
      const vw = window.innerWidth;
      if (vw < 340) return 0.35;
      if (vw < 380) return 0.40;
      if (vw < 420) return 0.45;
      if (vw < 480) return 0.50;
      if (vw < 640) return 0.58;
      if (vw < 768) return 0.65;
      if (vw < 1024) return 0.75;
      return 0.85;
    };

    setScale(computeScale());

    const onResize = () => setScale(computeScale());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen]);

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const handleZoomIn = () => {
    setScale((prev) => Math.min(1.2, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.4, Number((prev - 0.1).toFixed(2))));
  };

  const handleResetZoom = () => {
    setScale(0.85);
  };

  const currentTemplate =
    TEMPLATES.find((t) => t.id === data.templateId) || TEMPLATES[0];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-stone-950/90 backdrop-blur-md transition-all ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      {/* ================= Top Navigation Bar ================= */}
      <div className="bg-stone-900 text-white px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 shrink-0 select-none shadow-lg">
        {/* Left Side: Back to Edit & Document Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 text-xs font-bold transition-colors cursor-pointer border border-stone-700"
            title="Return to editing form"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">{isHindi ? 'संपादन पर वापस जाएं' : 'Back to Edit'}</span>
            <span className="inline xs:hidden">{isHindi ? 'वापस' : 'Back'}</span>
          </button>

          <div className="hidden sm:block">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>{isHindi ? 'बायोडेटा लाइव प्रिव्यू' : 'Live Biodata Preview'}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                A4 Standard
              </span>
              {pageCount > 1 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {pageCount} Pages
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Center / Middle Controls: Change Template & Language */}
        <div className="flex items-center gap-2">
          {/* Change Template dropdown button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTemplatePicker((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 cursor-pointer transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline text-stone-400">Template:</span>
              <span className="text-white font-bold max-w-[120px] truncate">
                {currentTemplate.name}
              </span>
            </button>

            {/* Template Selector Dropdown */}
            {showTemplatePicker && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-stone-900 border border-stone-700 rounded-xl p-2 shadow-2xl z-50 grid grid-cols-1 gap-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1 border-b border-stone-800 mb-1">
                  Choose Template Design:
                </div>
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      onChangeTemplate?.(tmpl.id);
                      analyticsService.trackTemplateSelected(tmpl.id, 'live_preview');
                      setShowTemplatePicker(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      data.templateId === tmpl.id
                        ? 'bg-amber-900/40 text-amber-200 border border-amber-600/50 font-bold'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: tmpl.primaryColor }}
                      />
                      <span>{tmpl.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-400">{tmpl.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language selector toggle if callback provided */}
          {onChangeLanguage && (
            <div className="hidden lg:flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700 text-xs font-medium">
              <button
                type="button"
                onClick={() => onChangeLanguage('en')}
                className={`px-2 py-1 rounded cursor-pointer ${
                  language === 'en' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguage('hi')}
                className={`px-2 py-1 rounded cursor-pointer ${
                  language === 'hi' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguage('bilingual')}
                className={`px-2 py-1 rounded cursor-pointer ${
                  language === 'bilingual' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Bilingual
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-stone-800 rounded-lg border border-stone-700 px-1 py-0.5 text-stone-300">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:text-white rounded cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="text-[11px] font-bold px-1.5 hover:text-white cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:text-white rounded cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Print, Download & Close */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="hidden md:flex p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Direct Print */}
          <button
            type="button"
            onClick={() => onPrint?.()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold cursor-pointer border border-stone-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-stone-300" />
            <span>{isHindi ? 'प्रिंट' : 'Print'}</span>
          </button>


          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] min-w-[38px] flex items-center justify-center p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer"
            title="Close Preview"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ================= Main Scrollable Viewport ================= */}
      <div
        className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start"
        onClick={() => {
          if (showTemplatePicker) setShowTemplatePicker(false);
        }}
      >
        <div className="py-2">
          <BiodataRenderer
            data={data}
            scale={scale}
            id="live-preview-modal-document"
            onPageCountChange={(count) => setPageCount(count)}
          />
        </div>
      </div>

      {/* ================= Bottom Helper Floating Bar (Mobile Viewport) ================= */}
      <div className="sm:hidden bg-stone-900 border-t border-stone-800 px-3 py-1.5 flex items-center justify-between text-xs text-stone-400 shrink-0 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-amber-400 font-bold min-h-[44px] px-2.5 rounded-lg active:bg-stone-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Edit Form</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            className="min-h-[44px] min-w-[40px] flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 font-bold text-base cursor-pointer"
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="text-[11px] font-mono font-bold px-1 text-stone-300">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="min-h-[44px] min-w-[40px] flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 font-bold text-base cursor-pointer"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenDownload?.();
          }}
          className="text-amber-400 font-bold flex items-center gap-1.5 min-h-[44px] px-2.5 rounded-lg active:bg-stone-800 cursor-pointer"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Save PDF</span>
        </button>
      </div>
    </div>
  );
};
