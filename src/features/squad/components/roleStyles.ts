import type { Role } from '@/types/valorant';

interface RoleStyle {
  /** Role badge colors. */
  badge: string;
  /** Gradient start color for the portrait glow. */
  glow: string;
}

/** Static Tailwind class map per agent role (kept literal for JIT scanning). */
export const ROLE_STYLES: Record<Role, RoleStyle> = {
  duelist: {
    badge: 'border-role-duelist/40 bg-role-duelist/15 text-role-duelist',
    glow: 'from-role-duelist/30',
  },
  initiator: {
    badge: 'border-role-initiator/40 bg-role-initiator/15 text-role-initiator',
    glow: 'from-role-initiator/30',
  },
  controller: {
    badge: 'border-role-controller/40 bg-role-controller/15 text-role-controller',
    glow: 'from-role-controller/30',
  },
  sentinel: {
    badge: 'border-role-sentinel/40 bg-role-sentinel/15 text-role-sentinel',
    glow: 'from-role-sentinel/30',
  },
};
