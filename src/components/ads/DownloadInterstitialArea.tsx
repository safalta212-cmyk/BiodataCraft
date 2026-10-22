import React from 'react';
import { AdSlot } from './AdSlot';
import { AdConfig, MonetizationLevel } from '../../config/adConfig';
import { useAdSettings } from '../../context/AdContext';
import { ShieldCheck, HeartHandshake, Info } from 'lucide-react';

export interface DownloadInterstitialAreaProps {
  /**
   * Application monetization level: STANDARD | TEMPLATE | ADVANCED
   */
  monetizationLevel?: MonetizationLevel;
  /**
   * Custom CSS classes
   */
  className?: string;
  /**
   * Language preference for disclosures
   */
  language?: 'en' | 'hi' | 'bilingual';
}

/**
 * DownloadInterstitialArea Component
 * 
 * Specifically engineered for the download dialog flow with strict Google AdSense compliance:
 * 1. NEVER labeled as a "Download", "Save", or "Proceed" button.
 * 2. Visual containment and ample padding preventing accidental clicks.
 * 3. Never blocks or gates the user's PDF generation or image download.
 * 4. Transparent disclosure stating that downloading requires zero ad clicks.
 * 5. Strictly isolated from PDF and canvas capture (no-print, data-html2canvas-ignore).
 * 6. Supports STANDARD, TEMPLATE, and ADVANCED monetization opportunity tiers.
 */
export const DownloadInterstitialArea: React.FC<DownloadInterstitialAreaProps> = ({
  monetizationLevel = 'STANDARD',
  className = '',
  language = 'en'
}) => {
  const { settings } = useAdSettings();
  if (!settings.adsEnabled) return null;

  const downloadSlotId = (settings.adsenseSlotDownload || AdConfig.getSlotId('downloadModal')).trim();
  if (!downloadSlotId) {
    return null;
  }

  const levelConfig = AdConfig.getLevelConfig(monetizationLevel);
  const isHindi = language === 'hi';

  return (
    <div
      className={`download-interstitial-area border border-stone-200 bg-stone-50/90 rounded-2xl p-3.5 my-4 transition-all no-print select-none shadow-2xs ${className}`}
      data-html2canvas-ignore="true"
      data-monetization-level={levelConfig.level}
    >
      {/* 1. Header with Unambiguous Policy-Required "Advertisement" Label */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/60">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded">
            Advertisement
          </span>
          <span className="text-[10px] text-stone-600 font-mono">
            Tier: {levelConfig.level}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-stone-500">
          <ShieldCheck className="w-3 h-3 text-stone-500" />
          <span>Non-Intrusive</span>
        </div>
      </div>

      {/* 2. Google AdSense Slot */}
      <div className="overflow-hidden">
        <AdSlot
          slotId={downloadSlotId}
          format="auto"
          monetizationLevel={levelConfig.level}
          minHeight="100px"
          className="my-1"
        />
      </div>

      {/* 3. Anti-Deception & Accessibility Notice */}
      {/* Guarantees users understand that clicking the ad is NEVER required to download their biodata */}
      <div className="flex items-start gap-1.5 pt-2 mt-2 border-t border-stone-200/50 text-[10px] text-stone-600 leading-tight">
        <Info className="w-3 h-3 text-stone-500 shrink-0 mt-0.5" />
        <span>
          {isHindi
            ? 'विज्ञापन स्थान BiodataCraft को 100% नि:शुल्क रखने में सहायता करता है। डाउनलोड करने के लिए विज्ञापन पर क्लिक करने की कोई आवश्यकता नहीं है।'
            : 'Sponsored space helps keep BiodataCraft 100% free with zero customer fees. Your download does not require clicking on any sponsor link.'}
        </span>
      </div>
    </div>
  );
};
