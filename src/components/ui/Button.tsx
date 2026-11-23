import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-val-red text-white hover:bg-[#FF5563] active:bg-val-red-dim shadow-glow focus-visible:ring-val-red',
  secondary:
    'bg-val-teal text-bg-base hover:brightness-110 active:brightness-95 shadow-glow-teal focus-visible:ring-val-teal',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-hi/80 focus-visible:ring-ink-muted',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  outline:
    'bg-bg-elevated/80 border border-white/15 text-ink hover:border-white/35 hover:bg-surface-hi focus-visible:ring-val-offwhite',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center gap-2 rounded-sm font-tactical font-bold tracking-widest uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base select-none disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
        {...rest}
      >
        {loading && (
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
