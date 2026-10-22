import React from 'react';

export const PageLoadingFallback: React.FC = () => {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-stone-50"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-12 h-12 relative flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-amber-200 border-t-amber-800 animate-spin" />
        <span className="text-amber-800 font-cinzel text-xs font-bold">॥</span>
      </div>
      <p className="text-xs font-medium text-stone-500 font-sans tracking-wide">
        Loading BiodataCraft...
      </p>
    </div>
  );
};
