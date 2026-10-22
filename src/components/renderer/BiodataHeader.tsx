import React from 'react';
import { BiodataData } from '../../types/biodata';
import { TemplateConfig } from '../../types/template';
import { HEADER_SYMBOLS } from '../../data/initialBiodata';

export interface BiodataHeaderProps {
  data: BiodataData;
  templateConfig: TemplateConfig;
  isHindi?: boolean;
  isSubsequentPage?: boolean;
  pageNumber?: number;
  totalPages?: number;
}

/**
 * BiodataHeader component
 * - Requirement 6: Hindi Unicode support & shlokas
 * - Requirement 15: Template-specific styles (traditional, modern, minimal, royal)
 * - Multi-page awareness: streamlined header on page 2+
 */
export const BiodataHeader: React.FC<BiodataHeaderProps> = ({
  data,
  templateConfig,
  isHindi = false,
  isSubsequentPage = false,
  pageNumber = 1,
  totalPages = 1
}) => {
  const primaryColor = data.themeColor || templateConfig.primaryColor;
  const secondaryColor = templateConfig.secondaryColor;
  const headerStyle = templateConfig.headerStyle || 'royal';

  // Find matching symbol
  const activeSymbol =
    HEADER_SYMBOLS.find((s) => s.id === data.headerSymbol) || HEADER_SYMBOLS[0];

  const headerTitle =
    data.customHeaderTitle ||
    activeSymbol.shloka ||
    (isHindi ? '॥ विवाह हेतु बायोडेटा ॥' : 'MARRIAGE BIODATA');

  // Multi-page running header
  if (isSubsequentPage) {
    return (
      <header className="biodata-header mb-4 pb-2 border-b flex items-center justify-between" style={{ borderColor: `${secondaryColor}60` }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider uppercase break-words [overflow-wrap:anywhere]" style={{ color: primaryColor }}>
            {data.fullName || 'Candidate Biodata'}
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-[11px] text-stone-500 font-medium">
            {isHindi ? 'बायोडेटा (पृष्ठ जारी)' : 'Biodata (Continued)'}
          </span>
        </div>
        <div className="text-[11px] font-semibold text-stone-500">
          {isHindi ? `पृष्ठ ${pageNumber} / ${totalPages}` : `Page ${pageNumber} of ${totalPages}`}
        </div>
      </header>
    );
  }

  // Modern Minimal Header
  if (headerStyle === 'minimal' || headerStyle === 'modern') {
    return (
      <header className="biodata-header text-center mb-6 pt-1 select-none">
        {activeSymbol.id !== 'none' && (
          <div
            className="text-xs sm:text-sm font-semibold tracking-wide mb-1"
            style={{ color: secondaryColor }}
          >
            {headerTitle}
          </div>
        )}

        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase break-words [overflow-wrap:anywhere]"
          style={{ color: primaryColor }}
        >
          {data.fullName || (isHindi ? 'नाम दर्ज करें' : 'MARRIAGE BIODATA')}
        </h1>

        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-[1px] w-12" style={{ backgroundColor: secondaryColor }} />
          <div className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">
            {isHindi ? 'वैवाहिक विवरण' : 'Matrimonial Profile'}
          </div>
          <div className="h-[1px] w-12" style={{ backgroundColor: secondaryColor }} />
        </div>
      </header>
    );
  }

  // Traditional Vedic / Royal Header (Default)
  return (
    <header className="biodata-header text-center mb-5 pt-1 select-none">
      {/* Top Sacred Shloka / Mantra */}
      {activeSymbol.id !== 'none' && (
        <div className="inline-flex flex-col items-center mb-1.5">
          <div
            className="text-xs sm:text-sm font-bold tracking-wide px-4 py-0.5 rounded-full"
            style={{
              color: primaryColor,
              backgroundColor: `${secondaryColor}15`
            }}
          >
            {headerTitle}
          </div>
        </div>
      )}

      {/* Main Candidate Name */}
      <h1
        className="text-2xl sm:text-3xl font-bold tracking-tight py-0.5 break-words [overflow-wrap:anywhere]"
        style={{ color: primaryColor }}
      >
        {data.fullName || (isHindi ? 'बायोडेटा' : 'Marriage Biodata')}
      </h1>

      {/* Auspicious Divider with Ornamental Centerpiece */}
      <div className="flex items-center justify-center gap-2 max-w-sm mx-auto mt-1 mb-2">
        <div
          className="h-[1.5px] flex-1 opacity-80"
          style={{
            background: `linear-gradient(to right, transparent, ${secondaryColor})`
          }}
        />
        <div
          className="w-2.5 h-2.5 rotate-45 border"
          style={{
            borderColor: secondaryColor,
            backgroundColor: primaryColor
          }}
        />
        <div
          className="h-[1.5px] flex-1 opacity-80"
          style={{
            background: `linear-gradient(to left, transparent, ${secondaryColor})`
          }}
        />
      </div>

      {/* Sub-headline pill */}
      <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
        {data.highestEducation || data.occupation ? (
          <span>
            {data.highestEducation}
            {data.occupation ? ` • ${data.occupation}` : ''}
          </span>
        ) : isHindi ? (
          '॥ शुभ विवाह ॥'
        ) : (
          'Personal Biodata'
        )}
      </div>
    </header>
  );
};
