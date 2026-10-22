import React, { useEffect } from 'react';
import { AdFlowService } from '../../services/adFlowService';
import { CreationMode } from '../../types/monetization';
import { AdSlot } from './AdSlot';
import { AdConfig } from '../../config/adConfig';

export interface CompliantAdPlacementProps {
  mode: CreationMode | string;
  className?: string;
  placementType?: 'modal-banner' | 'card' | 'inline';
  slotId?: string;
}

/**
 * CompliantAdPlacement Component
 * Strictly policy-compliant Google AdSense placement container:
 * - Unambiguous "Advertisement" labeling
 * - No fake ads or simulated sponsors
 * - Never obscures download buttons
 * - Never simulates clicks or creates fake impressions
 * - Completely isolated from PDF generation (no-print, data-html2canvas-ignore)
 */
export const CompliantAdPlacement: React.FC<CompliantAdPlacementProps> = ({
  mode,
  className = '',
  slotId
}) => {
  const adLevel = AdFlowService.getAdLevel(mode);
  const adsEnabled = AdFlowService.isAdvertisingEnabled();
  const effectiveSlot = slotId || AdConfig.getSlotId('inContent');

  useEffect(() => {
    if (adsEnabled && effectiveSlot) {
      AdFlowService.markAdOpportunityRendered();
    }
  }, [adsEnabled, effectiveSlot]);

  if (!adsEnabled || !effectiveSlot) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border border-stone-200 bg-stone-50/80 p-3 text-stone-700 select-none overflow-hidden transition-all no-print ${className}`}
      data-ad-level={adLevel}
      data-creation-mode={mode}
      data-html2canvas-ignore="true"
    >
      {/* Policy-Required Label: "Advertisement" */}
      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-stone-200/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
          Advertisement
        </span>
        <span className="text-[10px] text-stone-500 font-mono">
          Tier {adLevel}
        </span>
      </div>

      {/* Real AdSlot (strictly Google AdSense) */}
      <AdSlot
        slotId={effectiveSlot}
        format="auto"
        monetizationLevel={mode === 'ADVANCED' ? 'ADVANCED' : mode === 'TEMPLATE' ? 'TEMPLATE' : 'STANDARD'}
      />
    </div>
  );
};
