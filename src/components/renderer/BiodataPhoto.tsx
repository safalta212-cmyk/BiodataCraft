import React, { useState } from 'react';
import { PhotoConfig, PhotoFrameStyle } from '../../types/biodata';
import { User } from 'lucide-react';

export interface BiodataPhotoProps {
  photoUrl?: string;
  photoConfig?: PhotoConfig;
  candidateName: string;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  frameStyleOverride?: PhotoFrameStyle;
}

/**
 * BiodataPhoto component
 * - Requirement 5: Correct image rendering (rotation, zoom, aspect ratio, frame style)
 * - Safe image load error handling with elegant monogram fallback
 */
export const BiodataPhoto: React.FC<BiodataPhotoProps> = ({
  photoUrl,
  photoConfig,
  candidateName,
  primaryColor = '#7a1426',
  secondaryColor = '#c59b27',
  className = '',
  size = 'md',
  frameStyleOverride
}) => {
  const [hasError, setHasError] = useState(false);

  const zoom = photoConfig?.zoom ?? 1;
  const rotate = photoConfig?.rotate ?? 0;
  const frameStyle = frameStyleOverride || photoConfig?.frameStyle || 'arch';
  const cropAspect = photoConfig?.cropAspect || 'portrait';

  // Sizing definitions
  const dimensions = {
    sm: { width: 'w-24 sm:w-28', height: 'h-32 sm:h-36' },
    md: { width: 'w-32 sm:w-36', height: 'h-40 sm:h-48' },
    lg: { width: 'w-36 sm:w-44', height: 'h-48 sm:h-56' }
  }[size];

  // Aspect ratio adjustment if square or classic
  const aspectClass =
    cropAspect === 'square'
      ? 'aspect-square !h-auto'
      : cropAspect === 'classic'
      ? 'aspect-[4/5] !h-auto'
      : '';

  // Frame styling
  const getFrameClasses = () => {
    switch (frameStyle) {
      case 'arch':
        return 'rounded-t-full rounded-b-xl border-4 shadow-md';
      case 'oval':
        return 'rounded-full border-4 shadow-md';
      case 'rounded':
        return 'rounded-2xl border-4 shadow-md';
      case 'classic':
      default:
        return 'rounded-lg border-4 shadow-md';
    }
  };

  // Get initials for fallback
  const initials = candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'M';

  return (
    <div className={`relative shrink-0 flex flex-col items-center justify-center ${className}`}>
      <div
        className={`relative ${dimensions.width} ${dimensions.height} ${aspectClass} overflow-hidden bg-stone-100 flex items-center justify-center transition-all ${getFrameClasses()}`}
        style={{
          borderColor: secondaryColor || '#d4af37',
          backgroundColor: '#fffdf9'
        }}
      >
        {photoUrl && !hasError ? (
          <img
            src={photoUrl}
            alt={candidateName || 'Candidate Photo'}
            onError={() => setHasError(true)}
            crossOrigin="anonymous"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-200 select-none"
            style={{
              transform: `scale(${zoom}) rotate(${rotate}deg)`,
              transformOrigin: 'center center'
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-stone-50 select-none">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner mb-1"
              style={{ backgroundColor: primaryColor }}
            >
              {initials}
            </div>
            <User className="w-4 h-4 text-stone-400 mt-1" />
            <span className="text-[10px] text-stone-500 font-medium mt-0.5">
              {photoUrl && hasError ? 'Photo' : 'Photograph'}
            </span>
          </div>
        )}

        {/* Decorative corner accent for classic frame */}
        {frameStyle === 'classic' && (
          <>
            <div
              className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 pointer-events-none"
              style={{ borderColor: primaryColor }}
            />
            <div
              className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 pointer-events-none"
              style={{ borderColor: primaryColor }}
            />
            <div
              className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 pointer-events-none"
              style={{ borderColor: primaryColor }}
            />
            <div
              className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 pointer-events-none"
              style={{ borderColor: primaryColor }}
            />
          </>
        )}
      </div>
    </div>
  );
};
