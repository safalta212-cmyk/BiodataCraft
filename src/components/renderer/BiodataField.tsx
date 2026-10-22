import React from 'react';

export interface BiodataFieldProps {
  label: string;
  value?: string | number | null | React.ReactNode;
  hindiLabel?: string;
  isHindi?: boolean;
  bilingual?: boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  fullWidth?: boolean;
  variant?: 'inline' | 'stacked' | 'badge' | 'highlight';
  accentColor?: string;
}

/**
 * BiodataField component
 * - Requirement 6: Hindi Unicode support with Devanagari font rendering
 * - Requirement 7: Long text wrapping (break-words, overflow-wrap)
 * - Requirement 8: Long text/address without overflow
 * - Requirement 10: Empty fields should not produce ugly blank sections (returns null if empty)
 */
export const BiodataField: React.FC<BiodataFieldProps> = ({
  label,
  value,
  hindiLabel,
  isHindi = false,
  bilingual = false,
  className = '',
  labelClassName = '',
  valueClassName = '',
  fullWidth = false,
  variant = 'inline',
  accentColor
}) => {
  // Requirement 10: Check if value is truly present
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed === '-' || trimmed === 'N/A' || trimmed === 'None') {
      return null;
    }
  }

  // Display label formatting based on language
  let displayLabel = label;
  if (isHindi && hindiLabel) {
    displayLabel = hindiLabel;
  } else if (bilingual && hindiLabel) {
    displayLabel = `${label} / ${hindiLabel}`;
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border font-medium ${className}`}
        style={{
          borderColor: accentColor ? `${accentColor}40` : undefined,
          backgroundColor: accentColor ? `${accentColor}10` : undefined,
          color: accentColor || undefined
        }}
      >
        <span className="opacity-75 font-normal text-[11px]">{displayLabel}:</span>
        <span className="font-semibold break-words">{value}</span>
      </div>
    );
  }

  if (variant === 'stacked' || fullWidth) {
    return (
      <div
        className={`flex flex-col py-1.5 border-b border-stone-100 last:border-b-0 ${className} break-inside-avoid`}
      >
        <span
          className={`text-[11px] font-semibold tracking-wide uppercase text-stone-500 mb-0.5 ${labelClassName}`}
        >
          {displayLabel}
        </span>
        <span
          className={`text-xs text-stone-900 font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${valueClassName}`}
        >
          {value}
        </span>
      </div>
    );
  }

  if (variant === 'highlight') {
    return (
      <div
        className={`flex items-baseline justify-between py-1 px-2.5 rounded border text-xs ${className} break-inside-avoid`}
        style={{
          borderColor: accentColor ? `${accentColor}30` : '#e2e8f0',
          backgroundColor: accentColor ? `${accentColor}08` : '#f8fafc'
        }}
      >
        <span className={`font-semibold text-stone-700 shrink-0 mr-2 text-[11px] ${labelClassName}`}>
          {displayLabel}
        </span>
        <span className={`font-bold text-stone-900 text-right break-words [overflow-wrap:anywhere] ${valueClassName}`}>
          {value}
        </span>
      </div>
    );
  }

  // Standard inline 2-column key-value pair
  return (
    <div
      className={`flex items-start text-xs py-0.5 leading-snug break-inside-avoid ${
        fullWidth ? 'col-span-full' : ''
      } ${className}`}
    >
      <span
        className={`text-stone-500 font-medium shrink-0 min-w-[90px] max-w-[140px] text-[11px] sm:text-xs select-none pr-1.5 ${labelClassName}`}
      >
        {displayLabel}
      </span>
      <span className="text-stone-400 font-medium mx-1 select-none">:</span>
      <span
        className={`text-stone-900 font-semibold flex-1 pl-1 text-[11.5px] sm:text-xs break-words [overflow-wrap:anywhere] ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
};
