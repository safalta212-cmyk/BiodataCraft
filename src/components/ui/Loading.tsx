import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullPage?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullPage = false,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  };

  const content = (
    <div className={`flex flex-col items-center justify-center p-4 text-center ${className}`}>
      <div className="relative">
        <Loader2 className={`${sizeMap[size]} animate-spin text-amber-800`} />
      </div>
      {text && (
        <p className="text-xs sm:text-sm font-medium text-stone-600 mt-2.5 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-50/80 backdrop-blur-xs flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
};
