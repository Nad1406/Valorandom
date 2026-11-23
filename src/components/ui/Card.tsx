import React, { forwardRef } from 'react';

export type CardVariant = 'default' | 'elevated' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const VARIANT_STYLES: Record<CardVariant, string> = {
  default: 'bg-bg-elevated/95 border border-white/12 text-ink',
  elevated: 'bg-bg-elevated/95 border border-white/15 text-ink shadow-card',
  interactive:
    'bg-bg-elevated/95 border border-white/20 text-ink hover:border-val-red/70 transition-colors duration-200 cursor-pointer',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-sm overflow-hidden ${VARIANT_STYLES[variant]} ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
