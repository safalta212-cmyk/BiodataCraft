import React from 'react';

export interface BiodataSectionProps {
  title: string;
  hindiTitle?: string;
  icon?: React.ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  accentBg?: string;
  columns?: 1 | 2;
  children: React.ReactNode;
  isEmpty?: boolean;
  className?: string;
  variant?: 'banner' | 'underline' | 'pill' | 'minimal';
  isHindi?: boolean;
}

/**
 * BiodataSection component
 * - Requirement 10: Empty fields should not produce ugly blank sections
 * - Requirement 11: Optional sections should disappear when empty (renders null if isEmpty is true)
 * - Requirement 14: Controlled page breaks (break-inside-avoid)
 * - Requirement 15: Template-specific styles (banner, pill, underline, minimal)
 */
export const BiodataSection: React.FC<BiodataSectionProps> = ({
  title,
  hindiTitle,
  icon,
  primaryColor = '#7a1426',
  secondaryColor = '#c59b27',
  accentBg,
  columns = 2,
  children,
  isEmpty = false,
  className = '',
  variant = 'banner',
  isHindi = false
}) => {
  // Requirement 11: Completely vanish when empty
  if (isEmpty) {
    return null;
  }

  // Count non-null children
  const childrenArray = React.Children.toArray(children).filter(Boolean);
  if (childrenArray.length === 0) {
    return null;
  }

  const displayTitle = isHindi && hindiTitle ? hindiTitle : title;

  return (
    <section className={`mb-4 break-inside-avoid ${className}`}>
      {/* Section Header */}
      {variant === 'banner' && (
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-sm mb-2 font-bold text-xs uppercase tracking-wider shadow-2xs"
          style={{
            backgroundColor: primaryColor,
            color: '#ffffff'
          }}
        >
          {icon && <span className="opacity-90">{icon}</span>}
          <span>{displayTitle}</span>
          <div
            className="ml-auto h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          />
        </div>
      )}

      {variant === 'pill' && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border"
            style={{
              borderColor: secondaryColor,
              backgroundColor: `${secondaryColor}15`,
              color: primaryColor
            }}
          >
            {icon && <span className="mr-1.5 inline-block">{icon}</span>}
            {displayTitle}
          </div>
          <div
            className="h-[1px] flex-1 opacity-40"
            style={{ backgroundColor: secondaryColor }}
          />
        </div>
      )}

      {variant === 'underline' && (
        <div
          className="pb-1 mb-2 border-b-2 flex items-center justify-between"
          style={{ borderColor: primaryColor }}
        >
          <div
            className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: primaryColor }}
          >
            {icon}
            <span>{displayTitle}</span>
          </div>
          <span
            className="w-2 h-2 rotate-45 inline-block"
            style={{ backgroundColor: secondaryColor }}
          />
        </div>
      )}

      {variant === 'minimal' && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-1 h-3.5 rounded-xs"
            style={{ backgroundColor: primaryColor }}
          />
          <h2
            className="text-xs font-bold uppercase tracking-wider text-stone-800"
          >
            {displayTitle}
          </h2>
        </div>
      )}

      {/* Content Grid */}
      <div
        className={`px-1 ${
          columns === 2
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5'
            : 'space-y-1'
        }`}
        style={{
          backgroundColor: accentBg || 'transparent'
        }}
      >
        {children}
      </div>
    </section>
  );
};
