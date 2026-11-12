import React, { forwardRef } from 'react';

export type CardVariant = 'default' | 'elevated' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const VARIANT_STYLES: Record<CardVariant, string> = {
  default: 'bg-surface border border-line text-ink',
  elevated: 'bg-surface-hi border border-line/80 text-ink shadow-card',
  interactive:
    'bg-surface border border-line text-ink hover:border-val-red/60 hover:shadow-glow transition-all duration-200 cursor-pointer',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl overflow-hidden ${VARIANT_STYLES[variant]} ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
