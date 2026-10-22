import React from 'react';
import { AdSlot } from './AdSlot';
import { AdConfig, MonetizationLevel } from '../../config/adConfig';
import { useAdSettings } from '../../context/AdContext';

export type ResponsiveAdVariant =
  | 'horizontal-leaderboard'
  | 'rectangle-card'
  | 'in-feed'
  | 'footer-banner'
  | 'blog-top'
  | 'blog-middle'
  | 'blog-bottom';

export interface ResponsiveAdProps {
  /**
   * AdSense ad unit slot ID
   */
  slotId?: string;
  /**
   * Layout variant tailored for different responsive sections
   */
  variant?: ResponsiveAdVariant;
  /**
   * Application monetization level (STANDARD, TEMPLATE, ADVANCED)
   */
  monetizationLevel?: MonetizationLevel;
  /**
   * Custom CSS container classes
   */
  className?: string;
  /**
   * Optional policy-compliant label (strictly "Advertisement" or "Sponsored Links" per Google AdSense policies)
   */
  label?: 'Advertisement' | 'Sponsored Links' | string;
}

/**
 * ResponsiveAd Component
 * 
 * Provides a policy-compliant, responsive wrapper for Google AdSense units:
 * - Clear separation from user content with distinct background, borders, and margins.
 * - Ample click-isolation spacing preventing accidental mis-clicks.
 * - Strict isolation from print and PDF generation (no-print / data-html2canvas-ignore).
 * - Full responsiveness from mobile 320px to desktop 1280px+.
 */
export const ResponsiveAd: React.FC<ResponsiveAdProps> = ({
  slotId,
  variant = 'horizontal-leaderboard',
  monetizationLevel = 'STANDARD',
  className = '',
  label
}) => {
  const { settings } = useAdSettings();
  if (!settings.adsEnabled) return null;

  // Google AdSense policy: Only "Advertisement" or "Sponsored Links" are permitted labels
  const policyLabel = label === 'Sponsored Links' ? 'Sponsored Links' : 'Advertisement';

  // For blog variants, enforce blogAdsEnabled
  const isBlogVariant = variant === 'blog-top' || variant === 'blog-middle' || variant === 'blog-bottom';
  if (isBlogVariant && !settings.blogAdsEnabled) {
    return null;
  }

  // Determine appropriate format and styling based on responsive variant
  let format: 'auto' | 'horizontal' | 'rectangle' = 'auto';
  let containerClasses = 'w-full max-w-5xl mx-auto my-6 px-4';
  let minHeight = '90px';

  switch (variant) {
    case 'horizontal-leaderboard':
      format = 'horizontal';
      containerClasses = 'w-full max-w-4xl mx-auto my-6 px-4';
      minHeight = '90px';
      break;

    case 'rectangle-card':
      format = 'rectangle';
      containerClasses = 'w-full max-w-sm mx-auto my-4';
      minHeight = '250px';
      break;

    case 'in-feed':
      format = 'auto';
      containerClasses = 'w-full my-6 p-2';
      minHeight = '120px';
      break;

    case 'footer-banner':
      format = 'horizontal';
      containerClasses = 'w-full max-w-5xl mx-auto my-8 px-4';
      minHeight = '90px';
      break;

    case 'blog-top':
      format = 'horizontal';
      containerClasses = 'w-full my-6 px-0';
      minHeight = '90px';
      break;

    case 'blog-middle':
      format = 'auto';
      containerClasses = 'w-full my-8 px-0';
      minHeight = '120px';
      break;

    case 'blog-bottom':
      format = 'horizontal';
      containerClasses = 'w-full my-6 px-0';
      minHeight = '90px';
      break;
  }

  const effectiveSlotId =
    slotId ||
    (variant === 'blog-top'
      ? settings.adsenseSlotBlogTop
      : variant === 'blog-middle'
      ? settings.adsenseSlotBlogMiddle
      : variant === 'blog-bottom'
      ? settings.adsenseSlotBlogBottom
      : variant === 'footer-banner'
      ? settings.adsenseSlotFooter
      : variant === 'horizontal-leaderboard'
      ? settings.adsenseSlotHeader
      : AdConfig.getSlotId('inContent'));

  // If slot is not configured, do not render empty ad container
  if (!effectiveSlotId || !effectiveSlotId.trim()) {
    return null;
  }

  return (
    <div
      className={`responsive-ad-wrapper no-print ${containerClasses} ${className}`}
      data-html2canvas-ignore="true"
    >
      <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3 shadow-2xs">
        {/* Policy-Required Boundary Header */}
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-200/50 text-[10px] text-stone-500 uppercase tracking-widest font-semibold select-none">
          <span>{policyLabel}</span>
          <span className="font-mono text-[9px] text-stone-600">
            {monetizationLevel}
          </span>
        </div>

        {/* Ad Unit Slot */}
        <div className="flex justify-center items-center overflow-hidden">
          <AdSlot
            slotId={effectiveSlotId}
            format={format}
            monetizationLevel={monetizationLevel}
            minHeight={minHeight}
            className="my-0 w-full"
          />
        </div>
      </div>
    </div>
  );
};
