import type {
  Agent,
  GameMap,
  Role,
  Weapon,
  WeaponCategory,
} from '@/types/valorant';

export interface AgentFilter {
  role?: Role | 'all';
}

export interface MapFilter {
  activeOnly?: boolean;
}

export interface WeaponFilter {
  category?: WeaponCategory | 'all';
  costMin?: number;
  costMax?: number;
}

export function filterAgents(
  agents: readonly Agent[],
  filter: AgentFilter,
): Agent[] {
  if (!filter.role || filter.role === 'all') {
    return agents.slice();
  }
  const targetRole = filter.role;
  return agents.filter((agent) => agent.role === targetRole);
}

export function filterMaps(
  maps: readonly GameMap[],
  filter: MapFilter,
): GameMap[] {
  if (!filter.activeOnly) {
    return maps.slice();
  }
  return maps.filter((map) => map.active);
}

export function filterWeapons(
  weapons: readonly Weapon[],
  filter: WeaponFilter,
): Weapon[] {
  return weapons.filter((weapon) => {
    if (filter.category && filter.category !== 'all') {
      if (weapon.category !== filter.category) return false;
    }
    if (filter.costMin !== undefined && weapon.cost < filter.costMin) {
      return false;
    }
    if (filter.costMax !== undefined && weapon.cost > filter.costMax) {
      return false;
    }
    return true;
  });
}
