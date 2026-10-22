import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'h-48 rounded-2xl'
  };

  const inlineStyles: React.CSSProperties = {
    width: width,
    height: height,
    ...style
  };

  return (
    <div
      className={`animate-pulse bg-stone-200/80 ${variantStyles[variant]} ${className}`}
      style={inlineStyles}
      {...props}
    />
  );
};
