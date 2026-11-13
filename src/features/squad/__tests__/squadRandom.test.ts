import { describe, expect, it } from 'vitest';
import { agents } from '@/data';
import { mulberry32 } from '@/features/random/rng';
import { randomSquad, SquadError } from '@/features/squad/squadRandom';
import type { SquadSlot } from '@/types/squad';
import type { SlotRole } from '@/types/valorant';

describe('Squad Random Algorithm (AC-21.x, AC-22.x, AC-23.x, AC-25.1)', () => {
  const makeSlots = (roles: SlotRole[]): SquadSlot[] => {
    return roles.map((role, idx) => ({
      id: `slot-${idx + 1}`,
      name: `Player ${idx + 1}`,
      role,
      lockedAgentId: null,
    }));
  };

  it('AC-21.1 property test: 5,000 iterations ensure 100% uniqueness of assigned agents', () => {
    const roleCombinations: SlotRole[][] = [
      ['flex', 'flex', 'flex', 'flex', 'flex'],
      ['duelist', 'initiator', 'controller', 'sentinel', 'flex'],
      ['duelist', 'duelist', 'duelist', 'duelist', 'duelist'],
      ['controller', 'controller', 'sentinel', 'sentinel', 'flex'],
      ['initiator', 'initiator', 'initiator', 'flex', 'flex'],
    ];

    for (let i = 0; i < 5000; i += 1) {
      const roles = roleCombinations[i % roleCombinations.length]!;
      const slots = makeSlots(roles);
      const rng = mulberry32(i + 1);

      const result = randomSquad({ slots, pool: agents, rng });
      const assignedIds = Object.values(result.bySlot).map((a) => a.id);

      expect(new Set(assignedIds).size).toBe(slots.length);
      expect(result.order).toHaveLength(slots.length);
    }
  });

  it('AC-21.2 fixed role slots always receive an agent matching slot role', () => {
    const slots = makeSlots(['duelist', 'initiator', 'controller', 'sentinel', 'duelist']);
    const rng = mulberry32(1234);

    for (let i = 0; i < 100; i += 1) {
      const result = randomSquad({ slots, pool: agents, rng });
      for (const slot of slots) {
        const assigned = result.bySlot[slot.id];
        expect(assigned?.role).toBe(slot.role);
      }
    }
  });

  it('AC-21.3 locked agents are strictly preserved and never assigned to other slots', () => {
    const lockedAgent = agents[0]!;
    const slots = makeSlots(['flex', 'flex', 'flex', 'flex', 'flex']);
    slots[0]!.lockedAgentId = lockedAgent.id;

    const rng = mulberry32(4321);
    for (let i = 0; i < 50; i += 1) {
      const result = randomSquad({ slots, pool: agents, rng });
      expect(result.bySlot['slot-1']?.id).toBe(lockedAgent.id);

      const otherAssigned = [
        result.bySlot['slot-2']?.id,
        result.bySlot['slot-3']?.id,
        result.bySlot['slot-4']?.id,
        result.bySlot['slot-5']?.id,
      ];
      expect(otherAssigned).not.toContain(lockedAgent.id);
    }
  });

  it('AC-22.1 & AC-22.2 Flex fills missing roles first: [Duelist, Flex, Flex, Flex, Flex] covers all 4 roles', () => {
    const slots = makeSlots(['duelist', 'flex', 'flex', 'flex', 'flex']);
    const rng = mulberry32(999);

    for (let i = 0; i < 50; i += 1) {
      const result = randomSquad({ slots, pool: agents, rng });
      const teamRoles = new Set(Object.values(result.bySlot).map((a) => a.role));

      // Must cover all 4 roles in Valorant
      expect(teamRoles.has('duelist')).toBe(true);
      expect(teamRoles.has('initiator')).toBe(true);
      expect(teamRoles.has('controller')).toBe(true);
      expect(teamRoles.has('sentinel')).toBe(true);
      expect(result.warnings.some((w) => w.code === 'TEAM_MISSING_ROLE')).toBe(false);
    }
  });

  it('AC-25.1 impossible role configuration throws INSUFFICIENT_ROLE without duplicate pick', () => {
    // Artificial pool with only 1 controller
    const singleControllerPool = agents.filter((a) => a.role !== 'controller').concat(
      agents.filter((a) => a.role === 'controller').slice(0, 1),
    );

    // Request 3 controllers
    const slots = makeSlots(['controller', 'controller', 'controller']);
    const rng = mulberry32(11);

    expect(() =>
      randomSquad({ slots, pool: singleControllerPool, rng }),
    ).toThrowError(SquadError);

    try {
      randomSquad({ slots, pool: singleControllerPool, rng });
    } catch (err) {
      expect(err).toBeInstanceOf(SquadError);
      expect((err as SquadError).code).toBe('INSUFFICIENT_ROLE');
    }
  });

  it('validates input and throws appropriate SquadError codes', () => {
    const rng = mulberry32(1);

    // Invalid slot count (< 1 or > 5)
    expect(() => randomSquad({ slots: [], pool: agents, rng })).toThrowError(
      'INVALID_SLOT_COUNT',
    );
    expect(() =>
      randomSquad({
        slots: makeSlots(['flex', 'flex', 'flex', 'flex', 'flex', 'flex']),
        pool: agents,
        rng,
      }),
    ).toThrowError('INVALID_SLOT_COUNT');

    // Invalid lock: agent does not exist
    const invalidLockSlot = makeSlots(['flex']);
    invalidLockSlot[0]!.lockedAgentId = 'non-existent-id';
    expect(() => randomSquad({ slots: invalidLockSlot, pool: agents, rng })).toThrowError(
      'INVALID_LOCK',
    );

    // Invalid lock: wrong role
    const jett = agents.find((a) => a.slug === 'jett')!;
    const wrongRoleSlot = makeSlots(['sentinel']);
    wrongRoleSlot[0]!.lockedAgentId = jett.id; // Jett is duelist
    expect(() => randomSquad({ slots: wrongRoleSlot, pool: agents, rng })).toThrowError(
      'INVALID_LOCK_ROLE',
    );
  });
});
