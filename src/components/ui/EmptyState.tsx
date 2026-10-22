import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`border-2 border-dashed border-stone-200 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto bg-stone-50/50 ${className}`}
    >
      <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/60 shadow-2xs">
        {icon || <FileQuestion className="w-7 h-7" />}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-stone-900 font-cinzel">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-stone-500 mt-1.5 mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {actionText && onAction && (
        <Button size="sm" variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
