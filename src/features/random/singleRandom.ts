import { pick, type Rng } from './rng';
import type { Agent, GameMap, Weapon } from '@/types/valorant';

export interface ComboResult {
  agent: Agent | null;
  map: GameMap | null;
  weapon: Weapon | null;
}

export function randomAgent(
  pool: readonly Agent[],
  rng: Rng,
): Agent | null {
  return pick(pool, rng);
}

export function randomMap(
  pool: readonly GameMap[],
  rng: Rng,
): GameMap | null {
  return pick(pool, rng);
}

export function randomWeapon(
  pool: readonly Weapon[],
  rng: Rng,
): Weapon | null {
  return pick(pool, rng);
}

export function randomCombo(
  agentsPool: readonly Agent[],
  mapsPool: readonly GameMap[],
  weaponsPool: readonly Weapon[],
  rng: Rng,
): ComboResult {
  return {
    agent: randomAgent(agentsPool, rng),
    map: randomMap(mapsPool, rng),
    weapon: randomWeapon(weaponsPool, rng),
  };
}
