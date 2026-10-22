import React, { useEffect, useRef, useState } from 'react';
import { AdConfig, MonetizationLevel } from '../../config/adConfig';
import { useAdSettings } from '../../context/AdContext';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export interface AdSlotProps {
  /**
   * AdSense ad unit slot ID
   */
  slotId?: string;
  /**
   * Ad unit format (auto, rectangle, horizontal, vertical)
   */
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical' | 'fluid';
  /**
   * Application monetization level: STANDARD | TEMPLATE | ADVANCED
   */
  monetizationLevel?: MonetizationLevel;
  /**
   * Whether to enable full width responsive layout
   */
  fullWidthResponsive?: boolean;
  /**
   * Custom CSS classes
   */
  className?: string;
  /**
   * Minimum container height to prevent layout shifts (CLS)
   */
  minHeight?: number | string;
  /**
   * Accessibility description
   */
  ariaLabel?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = '',
  format = 'auto',
  monetizationLevel = 'STANDARD',
  fullWidthResponsive = true,
  className = '',
  minHeight,
  ariaLabel = 'Advertisement'
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adError, setAdError] = useState(false);
  const { settings } = useAdSettings();

  const publisherId = (settings?.adsenseClientId || AdConfig.getPublisherId()).trim();
  const isEnabled = Boolean(settings ? settings.adsEnabled : AdConfig.isEnabled());
  const isValidPubId = publisherId.startsWith('ca-pub-') && publisherId.length >= 15;
  const isDevPlaceholder = !isValidPubId;
  const levelConfig = AdConfig.getLevelConfig(monetizationLevel);

  // If ads are disabled globally or slotId is empty, render nothing (no empty container)
  if (!isEnabled || !slotId || !slotId.trim()) {
    return null;
  }

  // Initialize real Google AdSense when publisher ID is provided
  useEffect(() => {
    if (!isEnabled || isDevPlaceholder) return;

    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // Push ad request to Google AdSense queue
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // AdSense initialization gracefully handled if blocked by adblockers or unfilled
      setAdError(true);
    }
  }, [isEnabled, isDevPlaceholder, slotId]);

  // Calculate standard container minimum height based on format to prevent Cumulative Layout Shift
  const defaultHeight =
    minHeight !== undefined
      ? minHeight
      : format === 'horizontal'
      ? '90px'
      : format === 'rectangle'
      ? '250px'
      : format === 'vertical'
      ? '600px'
      : '90px';

  // =========================================================================
  // Development Mode Placeholder
  // Shown when AdSense publisher ID is missing in development.
  // Clearly states it is a development placeholder and NOT an advertisement.
  // =========================================================================
  if (isDevPlaceholder) {
    // In production without publisher ID, we do NOT show development banners
    if (import.meta.env.PROD) {
      return null;
    }

    return (
      <aside
        aria-label="Development AdSense Placeholder"
        className={`ad-container-dev border-2 border-dashed border-stone-300 bg-stone-100/90 rounded-2xl p-4 text-center my-4 transition-all no-print select-none ${className}`}
        style={{ minHeight: defaultHeight }}
        data-html2canvas-ignore="true"
        data-monetization-level={levelConfig.level}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-1.5 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
              AdSense Placeholder (Dev Mode)
            </span>
            <span className="text-[10px] font-mono text-stone-600 bg-stone-200/70 px-1.5 py-0.5 rounded">
              Level: {levelConfig.level} ({levelConfig.opportunityLevel}/3)
            </span>
          </div>

          <p className="text-xs text-stone-700 font-medium max-w-md">
            This space is reserved for a Google AdSense ad unit.
          </p>

          <div className="text-[10px] text-stone-600 space-x-2 font-mono">
            <span>Slot: {slotId}</span>
            <span>•</span>
            <span>Format: {format}</span>
          </div>

          <p className="text-[10px] text-stone-500 max-w-sm italic">
            Notice: This is a layout mockup and is NOT an advertisement. Disabled automatically in production when publisher ID is absent.
          </p>
        </div>
      </aside>
    );
  }

  // =========================================================================
  // Production Google AdSense Unit
  // Adheres to standard AdSense syntax without code manipulation or simulated clicks.
  // Strictly isolated from PDF generation with `no-print` and `data-html2canvas-ignore`.
  // =========================================================================
  return (
    <aside
      aria-label={ariaLabel}
      className={`ad-container my-4 text-center overflow-hidden no-print ${className}`}
      style={{ minHeight: defaultHeight }}
      data-html2canvas-ignore="true"
      data-monetization-level={levelConfig.level}
    >
      {/* Policy-Required Label: "Advertisement" */}
      <div className="text-[10px] uppercase font-bold tracking-widest text-stone-600 py-1 text-center select-none">
        Advertisement
      </div>

      <ins
        ref={adRef}
        className="adsbygoogle inline-block"
        style={{
          display: 'block',
          minHeight: defaultHeight,
          width: '100%'
        }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />

      {adError && (
        <div className="text-[10px] text-stone-500 italic py-1">
          Sponsored Space
        </div>
      )}
    </aside>
  );
};
