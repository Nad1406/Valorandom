import React from 'react';
import type { SlotRole } from '@/types/valorant';

export type BadgeVariant = SlotRole | 'default' | 'accent' | 'muted';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  duelist: 'bg-role-duelist/15 text-role-duelist border-role-duelist/30',
  initiator: 'bg-role-initiator/15 text-role-initiator border-role-initiator/30',
  controller: 'bg-role-controller/15 text-role-controller border-role-controller/30',
  sentinel: 'bg-role-sentinel/15 text-role-sentinel border-role-sentinel/30',
  flex: 'bg-role-flex/15 text-role-flex border-role-flex/30',
  default: 'bg-surface-hi text-ink border-line',
  accent: 'bg-val-red/15 text-val-red border-val-red/30',
  muted: 'bg-surface text-ink-muted border-line/50',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...rest
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 font-display tracking-wider uppercase rounded-md border font-semibold select-none ${VARIANT_STYLES[variant]} ${sizeClass} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};
