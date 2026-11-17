import { pick, type Rng } from '@/features/random/rng';
import type { SquadResult, SquadSlot } from '@/types/squad';
import type { Agent, Role } from '@/types/valorant';

/** What a lobby banner should render for a given slot. */
export type SlotDisplay =
  | { kind: 'empty' }
  | { kind: 'rolling'; agent: Agent }
  | { kind: 'rolled'; agent: Agent }
  | { kind: 'locked'; agent: Agent };

export interface ResolveSlotDisplayInput {
  slot: SquadSlot;
  result: SquadResult | null;
  rollingBySlot: Readonly<Record<string, Agent>>;
  lockedAgentIds: readonly string[];
  agentLookup: ReadonlyMap<string, Agent>;
}

function isCompatible(slot: SquadSlot, agent: Agent): boolean {
  return slot.role === 'flex' || agent.role === slot.role;
}

/**
 * Pure resolver deciding the banner state of a slot.
 * Priority: locked agent > rolling preview > last rolled result > empty.
 * A rolled agent is hidden when it became incompatible with the slot role
 * or is now locked in another slot (prevents duplicate display).
 */
export function resolveSlotDisplay(input: ResolveSlotDisplayInput): SlotDisplay {
  const { slot, result, rollingBySlot, lockedAgentIds, agentLookup } = input;

  if (slot.lockedAgentId) {
    const locked = agentLookup.get(slot.lockedAgentId);
    if (locked) return { kind: 'locked', agent: locked };
  }

  const rolling = rollingBySlot[slot.id];
  if (rolling) return { kind: 'rolling', agent: rolling };

  const rolled = result?.bySlot[slot.id];
  if (rolled && isCompatible(slot, rolled) && !lockedAgentIds.includes(rolled.id)) {
    return { kind: 'rolled', agent: rolled };
  }

  return { kind: 'empty' };
}

/**
 * Builds one frame of the roulette preview: a random candidate per unlocked slot,
 * restricted to the slot's desired role. Locked slots are skipped.
 */
export function buildRollingFrame(
  slots: readonly SquadSlot[],
  pool: readonly Agent[],
  rng: Rng,
): Record<string, Agent> {
  const frame: Record<string, Agent> = {};
  for (const slot of slots) {
    if (slot.lockedAgentId) continue;
    const candidates =
      slot.role === 'flex' ? pool : pool.filter((a) => a.role === slot.role);
    const agent = pick(candidates, rng);
    if (agent) frame[slot.id] = agent;
  }
  return frame;
}

/** Roles flagged as missing by the squad result warnings. */
export function getMissingRoles(result: SquadResult | null): Role[] {
  if (!result) return [];
  const roles: Role[] = [];
  for (const warning of result.warnings) {
    if (warning.code !== 'TEAM_MISSING_ROLE' || !warning.role) continue;
    if (warning.role === 'flex') continue;
    roles.push(warning.role);
  }
  return roles;
}

/**
 * Delay (ms) before the next roulette tick: fast at the start, slower near the end.
 * `progress` is in [0, 1].
 */
export function rollTickDelay(progress: number): number {
  const p = progress < 0 ? 0 : progress > 1 ? 1 : progress;
  return 50 + 140 * p * p;
}
