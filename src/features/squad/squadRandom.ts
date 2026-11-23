import { pick, shuffle, type Rng } from '@/features/random/rng';
import type {
  SquadErrorCode,
  SquadErrorDetail,
  SquadResult,
  SquadSlot,
  SquadWarning,
} from '@/types/squad';
import type { Agent, Role } from '@/types/valorant';
import { ROLES } from '@/types/valorant';

export class SquadError extends Error {
  readonly code: SquadErrorCode;
  readonly details?: SquadErrorDetail;

  constructor(code: SquadErrorCode, details?: SquadErrorDetail, message?: string) {
    super(message ?? code);
    this.name = 'SquadError';
    this.code = code;
    this.details = details;
  }
}

export interface SquadRandomInput {
  slots: readonly SquadSlot[];
  pool: readonly Agent[];
  rng: Rng;
}

type RoleBuckets = Record<Role, Agent[]>;

function buildPoolIndex(pool: readonly Agent[]): {
  poolMap: Map<string, Agent>;
  buckets: RoleBuckets;
} {
  const poolMap = new Map<string, Agent>();
  const buckets: RoleBuckets = { duelist: [], initiator: [], controller: [], sentinel: [] };
  for (const agent of pool) {
    poolMap.set(agent.id, agent);
    buckets[agent.role].push(agent);
  }
  return { poolMap, buckets };
}

function removeAgentFromBucket(buckets: RoleBuckets, agent: Agent): void {
  const list = buckets[agent.role];
  const idx = list.indexOf(agent);
  if (idx === -1) return;
  const last = list.pop();
  if (last && idx < list.length) {
    list[idx] = last;
  }
}

function validateInput(slots: readonly SquadSlot[], poolMap: Map<string, Agent>): void {
  if (slots.length < 1 || slots.length > 5) {
    throw new SquadError('INVALID_SLOT_COUNT', { needed: slots.length });
  }
  const lockedIds = new Set<string>();
  for (const slot of slots) {
    if (!slot.lockedAgentId) continue;
    if (lockedIds.has(slot.lockedAgentId)) {
      throw new SquadError('INVALID_LOCK', { agentId: slot.lockedAgentId });
    }
    lockedIds.add(slot.lockedAgentId);
    const agent = poolMap.get(slot.lockedAgentId);
    if (!agent) {
      throw new SquadError('INVALID_LOCK', { agentId: slot.lockedAgentId });
    }
    if (slot.role !== 'flex' && agent.role !== slot.role) {
      throw new SquadError('INVALID_LOCK_ROLE', { role: slot.role, agentId: slot.lockedAgentId });
    }
  }
}

function assignLockedSlots(
  slots: readonly SquadSlot[],
  poolMap: Map<string, Agent>,
  buckets: RoleBuckets,
  bySlot: Record<string, Agent>,
  order: string[],
): void {
  for (const slot of slots) {
    if (!slot.lockedAgentId) continue;
    const agent = poolMap.get(slot.lockedAgentId)!;
    bySlot[slot.id] = agent;
    order.push(slot.id);
    removeAgentFromBucket(buckets, agent);
  }
}

function assignFixedRoles(
  slots: readonly SquadSlot[],
  buckets: RoleBuckets,
  bySlot: Record<string, Agent>,
  order: string[],
  rng: Rng,
): void {
  const fixedFreeSlots = slots.filter((slot) => slot.role !== 'flex' && !slot.lockedAgentId);
  for (const slot of shuffle(fixedFreeSlots, rng)) {
    const role = slot.role as Role;
    const candidates = buckets[role];
    if (candidates.length === 0) {
      throw new SquadError('INSUFFICIENT_ROLE', { role, needed: 1, availableCount: 0 });
    }
    const chosen = pick(candidates, rng)!;
    bySlot[slot.id] = chosen;
    order.push(slot.id);
    removeAgentFromBucket(buckets, chosen);
  }
}

function assignFlexSlots(
  slots: readonly SquadSlot[],
  buckets: RoleBuckets,
  bySlot: Record<string, Agent>,
  order: string[],
  rng: Rng,
): void {
  const flexFreeSlots = slots.filter((slot) => slot.role === 'flex' && !slot.lockedAgentId);
  const teamRoles = new Set(Object.values(bySlot).map((a) => a.role));
  let missing = ROLES.filter((r) => !teamRoles.has(r));

  for (const slot of shuffle(flexFreeSlots, rng)) {
    const fillable = missing.filter((r) => buckets[r].length > 0);
    if (fillable.length > 0) {
      const chosenRole = pick(fillable, rng)!;
      const chosen = pick(buckets[chosenRole], rng)!;
      bySlot[slot.id] = chosen;
      order.push(slot.id);
      removeAgentFromBucket(buckets, chosen);
      missing = missing.filter((r) => r !== chosenRole);
      continue;
    }

    const remaining = ROLES.flatMap((r) => buckets[r]);
    if (remaining.length === 0) {
      throw new SquadError('EXHAUSTED_POOL');
    }
    const chosen = pick(remaining, rng)!;
    bySlot[slot.id] = chosen;
    order.push(slot.id);
    removeAgentFromBucket(buckets, chosen);
  }
}

export function randomSquad(input: SquadRandomInput): SquadResult {
  const { slots, pool, rng } = input;
  const { poolMap, buckets } = buildPoolIndex(pool);

  validateInput(slots, poolMap);

  const bySlot: Record<string, Agent> = {};
  const order: string[] = [];
  const warnings: SquadWarning[] = [];

  assignLockedSlots(slots, poolMap, buckets, bySlot, order);
  assignFixedRoles(slots, buckets, bySlot, order, rng);
  assignFlexSlots(slots, buckets, bySlot, order, rng);

  const finalTeamRoles = new Set(Object.values(bySlot).map((a) => a.role));
  for (const r of ROLES) {
    if (!finalTeamRoles.has(r)) {
      warnings.push({ code: 'TEAM_MISSING_ROLE', role: r });
    }
  }

  return { bySlot, order, warnings };
}

export const squadRandom = randomSquad;
