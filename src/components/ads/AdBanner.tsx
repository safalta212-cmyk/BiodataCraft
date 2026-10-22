import React from 'react';
import { AdSlot } from './AdSlot';
import { MonetizationLevel } from '../../config/adConfig';

interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed' | 'footer-banner';
  monetizationTier?: 'standard' | 'template' | 'advanced';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = 'biodatacraft-default-slot',
  format = 'horizontal',
  monetizationTier = 'standard',
  className = ''
}) => {
  const mappedLevel = monetizationTier.toUpperCase() as MonetizationLevel;
  const mappedFormat =
    format === 'rectangle' ? 'rectangle' : format === 'horizontal' ? 'horizontal' : 'auto';

  return (
    <div className={`ad-banner-wrapper no-print ${className}`} data-html2canvas-ignore="true">
      <AdSlot
        slotId={slotId}
        format={mappedFormat}
        monetizationLevel={mappedLevel}
      />
    </div>
  );
};
