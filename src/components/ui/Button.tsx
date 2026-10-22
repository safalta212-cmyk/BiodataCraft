import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseClass =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    // Size styles with mobile touch ergonomics
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px] sm:min-h-0 sm:h-8',
      md: 'text-sm px-4 py-2 gap-2 min-h-[44px] sm:h-10',
      lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px] sm:h-12'
    };

    // Variant styles
    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-amber-800 text-white hover:bg-amber-900 focus:ring-amber-800/50 shadow-sm shadow-amber-900/20 border border-amber-900/20',
      secondary:
        'bg-stone-100 text-stone-800 hover:bg-stone-200 focus:ring-stone-400 border border-stone-200',
      outline:
        'bg-white text-stone-700 hover:bg-stone-50 border border-stone-300 focus:ring-amber-800/40',
      ghost:
        'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:ring-stone-300',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClass} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
