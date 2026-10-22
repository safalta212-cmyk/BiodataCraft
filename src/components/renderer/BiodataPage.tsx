import React from 'react';
import { TemplateConfig } from '../../types/template';

export interface BiodataPageProps {
  children: React.ReactNode;
  templateConfig: TemplateConfig;
  pageNumber?: number;
  totalPages?: number;
  id?: string;
  isPrintMode?: boolean;
  className?: string;
  showWatermark?: boolean;
  watermarkText?: string;
}

/**
 * BiodataPage component
 * - Requirement 4: A4 document proportions (210mm x 297mm)
 * - Requirement 13: Multiple pages supported
 * - Requirement 14: Controlled page breaks
 * - Requirement 15: Template-specific borders, corners, patterns
 */
export const BiodataPage: React.FC<BiodataPageProps> = ({
  children,
  templateConfig,
  pageNumber = 1,
  totalPages = 1,
  id,
  isPrintMode = false,
  className = '',
  showWatermark = false,
  watermarkText = 'BiodataCraft'
}) => {
  const primaryColor = templateConfig.primaryColor || '#7a1426';
  const secondaryColor = templateConfig.secondaryColor || '#c59b27';
  const borderStyle = templateConfig.borderStyle || 'ornate';
  const cornerStyle = templateConfig.cornerStyle || 'fluted';

  // Corner radius based on cornerStyle
  const getCornerClass = () => {
    switch (cornerStyle) {
      case 'rounded':
        return 'rounded-2xl';
      case 'arch':
        return 'rounded-t-3xl rounded-b-md';
      case 'fluted':
      case 'sharp':
      default:
        return 'rounded-none';
    }
  };

  return (
    <div
      id={id}
      className={`w-[210mm] min-h-[297mm] mx-auto bg-white text-stone-900 relative p-8 sm:p-10 shadow-2xl print-page box-border overflow-hidden select-text flex flex-col justify-between mb-8 last:mb-0 ${
        isPrintMode ? 'mb-0 shadow-none' : ''
      } ${getCornerClass()} ${className}`}
      style={{
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        pageBreakAfter: totalPages > pageNumber ? 'always' : 'auto',
        breakAfter: totalPages > pageNumber ? 'page' : 'auto'
      }}
    >
      {/* ================= Decorative Borders ================= */}
      {borderStyle === 'ornate' && (
        <div
          className="absolute inset-3 border-2 pointer-events-none"
          style={{ borderColor: secondaryColor }}
        >
          <div
            className="absolute inset-1.5 border pointer-events-none"
            style={{ borderColor: primaryColor, opacity: 0.85 }}
          />

          {/* Corner Floral Filigree */}
          <div
            className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4"
            style={{ borderColor: secondaryColor }}
          />
          <div
            className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4"
            style={{ borderColor: secondaryColor }}
          />
          <div
            className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4"
            style={{ borderColor: secondaryColor }}
          />
          <div
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4"
            style={{ borderColor: secondaryColor }}
          />
        </div>
      )}

      {borderStyle === 'mandap' && (
        <div
          className="absolute inset-3.5 border-4 rounded-xl pointer-events-none"
          style={{ borderColor: primaryColor }}
        >
          <div
            className="absolute inset-1 border pointer-events-none"
            style={{ borderColor: secondaryColor }}
          />
          {/* Mandap pillars accent */}
          <div
            className="absolute top-0 left-4 right-4 h-1.5"
            style={{ backgroundColor: secondaryColor }}
          />
          <div
            className="absolute bottom-0 left-4 right-4 h-1.5"
            style={{ backgroundColor: secondaryColor }}
          />
        </div>
      )}

      {borderStyle === 'double' && (
        <div
          className="absolute inset-3.5 border-2 pointer-events-none"
          style={{ borderColor: primaryColor }}
        >
          <div
            className="absolute inset-1 border pointer-events-none"
            style={{ borderColor: secondaryColor }}
          />
        </div>
      )}

      {borderStyle === 'floral' && (
        <div
          className="absolute inset-3 border-2 pointer-events-none"
          style={{ borderColor: secondaryColor }}
        >
          {/* Subtle floral dots */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 bg-white text-[11px]"
            style={{ color: secondaryColor }}
          >
            ❦ ❦ ❦
          </div>
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 bg-white text-[11px]"
            style={{ color: secondaryColor }}
          />
        </div>
      )}

      {borderStyle === 'clean' && (
        <div
          className="absolute inset-4 border pointer-events-none"
          style={{ borderColor: '#cbd5e1' }}
        />
      )}

      {borderStyle === 'classic' && (
        <div
          className="absolute inset-3.5 border pointer-events-none"
          style={{ borderColor: secondaryColor }}
        >
          <div
            className="absolute inset-1.5 border-2 pointer-events-none"
            style={{ borderColor: primaryColor }}
          />
        </div>
      )}

      {/* ================= Optional Watermark ================= */}
      {showWatermark && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          style={{ opacity: templateConfig.watermarkOpacity ?? 0.04 }}
        >
          <span
            className="text-7xl sm:text-8xl font-black rotate-[-35deg] tracking-widest uppercase"
            style={{ color: primaryColor }}
          >
            {watermarkText}
          </span>
        </div>
      )}

      {/* ================= Page Content Container ================= */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
