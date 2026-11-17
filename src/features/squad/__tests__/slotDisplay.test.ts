import { describe, expect, it } from 'vitest';
import { agentById, agents } from '@/data';
import { mulberry32 } from '@/features/random/rng';
import {
  buildRollingFrame,
  getMissingRoles,
  resolveSlotDisplay,
  rollTickDelay,
} from '@/features/squad/slotDisplay';
import type { SquadResult, SquadSlot } from '@/types/squad';

const jett = agents.find((a) => a.slug === 'jett')!;
const omen = agents.find((a) => a.slug === 'omen')!;

const baseSlot: SquadSlot = { id: 'slot-1', name: 'P1', role: 'flex', lockedAgentId: null };
const result: SquadResult = { bySlot: { 'slot-1': jett }, order: ['slot-1'], warnings: [] };

function resolve(slot: SquadSlot, overrides: Partial<Parameters<typeof resolveSlotDisplay>[0]> = {}) {
  return resolveSlotDisplay({
    slot,
    result,
    rollingBySlot: {},
    lockedAgentIds: [],
    agentLookup: agentById,
    ...overrides,
  });
}

describe('slotDisplay (AC-21.4, AC-21.5, AC-23.4)', () => {
  it('AC-21.4 shows the rolled agent in-place, or empty when no result', () => {
    expect(resolve(baseSlot)).toEqual({ kind: 'rolled', agent: jett });
    expect(resolve(baseSlot, { result: null })).toEqual({ kind: 'empty' });
  });

  it('AC-23.4 locked agent takes priority over rolling preview and result', () => {
    const slot = { ...baseSlot, lockedAgentId: omen.id };
    expect(resolve(slot, { rollingBySlot: { 'slot-1': jett } })).toEqual({ kind: 'locked', agent: omen });
  });

  it('AC-21.5 rolling preview overrides last result for unlocked slots', () => {
    expect(resolve(baseSlot, { rollingBySlot: { 'slot-1': omen } })).toEqual({ kind: 'rolling', agent: omen });
  });

  it('hides a rolled agent that became role-incompatible or locked elsewhere', () => {
    expect(resolve({ ...baseSlot, role: 'controller' })).toEqual({ kind: 'empty' });
    expect(resolve(baseSlot, { lockedAgentIds: [jett.id] })).toEqual({ kind: 'empty' });
  });

  it('AC-21.5 buildRollingFrame skips locked slots and respects slot role', () => {
    const slots: SquadSlot[] = [
      { id: 'a', name: '', role: 'controller', lockedAgentId: null },
      { id: 'b', name: '', role: 'flex', lockedAgentId: jett.id },
    ];
    const rng = mulberry32(42);
    for (let i = 0; i < 50; i += 1) {
      const frame = buildRollingFrame(slots, agents, rng);
      expect(frame.a?.role).toBe('controller');
      expect(frame.b).toBeUndefined();
    }
  });

  it('getMissingRoles extracts TEAM_MISSING_ROLE warnings', () => {
    const withWarnings: SquadResult = {
      ...result,
      warnings: [{ code: 'TEAM_MISSING_ROLE', role: 'sentinel' }, { code: 'FLEX_NOT_FILLED' }],
    };
    expect(getMissingRoles(withWarnings)).toEqual(['sentinel']);
    expect(getMissingRoles(null)).toEqual([]);
  });

  it('rollTickDelay decelerates from fast to slow', () => {
    expect(rollTickDelay(0)).toBeLessThan(rollTickDelay(0.5));
    expect(rollTickDelay(0.5)).toBeLessThan(rollTickDelay(1));
    expect(rollTickDelay(2)).toBe(rollTickDelay(1));
  });
});
