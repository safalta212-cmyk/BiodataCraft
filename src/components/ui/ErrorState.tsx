import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please check your connection and try again.',
  onRetry,
  showHomeButton = true,
  className = ''
}) => {
  return (
    <div
      className={`bg-red-50/50 border border-red-200/80 rounded-2xl p-6 sm:p-8 text-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-stone-900 font-cinzel">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-stone-600 mt-2 mb-6 leading-relaxed max-w-sm mx-auto">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            size="sm"
            variant="primary"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Try Again
          </Button>
        )}

        {showHomeButton && (
          <Link
            to="/"
            className="inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-1 text-xs px-3 py-1.5 gap-1.5 h-8 bg-white text-stone-700 hover:bg-stone-50 border border-stone-300 focus:ring-amber-800/40"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        )}
      </div>
    </div>
  );
};
