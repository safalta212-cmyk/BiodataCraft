import React from 'react';

export interface BiodataFooterProps {
  pageNumber?: number;
  totalPages?: number;
  primaryColor?: string;
  secondaryColor?: string;
  isHindi?: boolean;
  closingNote?: string;
}

/**
 * BiodataFooter component
 * - Requirement 4 & 13: Page numbering and multi-page footer
 * - Requirement 14: Controlled print page breaks
 */
export const BiodataFooter: React.FC<BiodataFooterProps> = ({
  pageNumber = 1,
  totalPages = 1,
  primaryColor = '#7a1426',
  secondaryColor = '#c59b27',
  isHindi = false,
  closingNote
}) => {
  return (
    <footer className="biodata-footer mt-auto pt-3 border-t flex items-center justify-between text-[11px] text-stone-500 select-none break-inside-avoid" style={{ borderColor: `${secondaryColor}40` }}>
      <div className="flex items-center gap-2">
        <span className="font-semibold" style={{ color: primaryColor }}>
          {closingNote || (isHindi ? '॥ शुभ विवाह ॥' : '॥ With Best Compliments ॥')}
        </span>
      </div>

      <div className="text-right font-medium text-stone-400">
        {totalPages > 1 && (
          <span>
            {isHindi
              ? `पृष्ठ ${pageNumber} / ${totalPages}`
              : `Page ${pageNumber} of ${totalPages}`}
          </span>
        )}
      </div>
    </footer>
  );
};
