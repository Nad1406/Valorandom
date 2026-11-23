import React from 'react';
import type { SlotRole } from '@/types/valorant';

export type BadgeVariant = SlotRole | 'default' | 'accent' | 'muted';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  duelist: 'bg-role-duelist/15 text-role-duelist border-role-duelist/35',
  initiator: 'bg-role-initiator/15 text-role-initiator border-role-initiator/35',
  controller: 'bg-role-controller/15 text-role-controller border-role-controller/35',
  sentinel: 'bg-role-sentinel/15 text-role-sentinel border-role-sentinel/35',
  flex: 'bg-role-flex/15 text-role-flex border-role-flex/35',
  default: 'bg-surface-hi text-ink border-white/15',
  accent: 'bg-val-red/15 text-val-red border-val-red/40',
  muted: 'bg-surface text-ink-muted border-white/10',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...rest
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 font-tactical tracking-widest uppercase rounded-sm border font-bold select-none ${VARIANT_STYLES[variant]} ${sizeClass} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};
