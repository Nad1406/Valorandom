import type {
  Agent,
  GameMap,
  Role,
  Weapon,
  WeaponCategory,
} from '@/types/valorant';

export interface BasePoolFilter {
  selectedIds?: ReadonlySet<string> | readonly string[];
  excludedIds?: ReadonlySet<string> | readonly string[];
}

export interface AgentFilter extends BasePoolFilter {
  role?: Role | 'all';
}

export interface MapFilter extends BasePoolFilter {
  activeOnly?: boolean;
}

export interface WeaponFilter extends BasePoolFilter {
  category?: WeaponCategory | 'all';
  costMin?: number;
  costMax?: number;
}

function toSet(ids?: ReadonlySet<string> | readonly string[]): ReadonlySet<string> | null {
  if (!ids) return null;
  return ids instanceof Set ? ids : new Set(ids);
}

function matchesIdFilters(
  id: string,
  selectedSet: ReadonlySet<string> | null,
  excludedSet: ReadonlySet<string> | null,
): boolean {
  if (selectedSet && !selectedSet.has(id)) {
    return false;
  }
  if (excludedSet && excludedSet.has(id)) {
    return false;
  }
  return true;
}

export function filterAgents(
  agents: readonly Agent[],
  filter: AgentFilter,
): Agent[] {
  const selectedSet = toSet(filter.selectedIds);
  const excludedSet = toSet(filter.excludedIds);

  return agents.filter((agent) => {
    if (filter.role && filter.role !== 'all' && agent.role !== filter.role) {
      return false;
    }
    return matchesIdFilters(agent.id, selectedSet, excludedSet);
  });
}

export function filterMaps(
  maps: readonly GameMap[],
  filter: MapFilter,
): GameMap[] {
  const selectedSet = toSet(filter.selectedIds);
  const excludedSet = toSet(filter.excludedIds);

  return maps.filter((map) => {
    if (filter.activeOnly && !map.active) {
      return false;
    }
    return matchesIdFilters(map.id, selectedSet, excludedSet);
  });
}

export function filterWeapons(
  weapons: readonly Weapon[],
  filter: WeaponFilter,
): Weapon[] {
  const selectedSet = toSet(filter.selectedIds);
  const excludedSet = toSet(filter.excludedIds);

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
    return matchesIdFilters(weapon.id, selectedSet, excludedSet);
  });
}
