import { describe, expect, it } from 'vitest';
import { agents } from '@/data';
import {
  DEFAULT_INITIAL_SLOTS,
  initialSquadState,
  squadReducer,
} from '@/features/squad/squadReducer';
import type { SquadResult } from '@/types/squad';

describe('Squad Reducer (AC-20.x, AC-23.x)', () => {
  it('AC-20.1 enforces slot range [1, 5]', () => {
    // Cannot add beyond 5 slots
    let state = initialSquadState;
    expect(state.slots).toHaveLength(5);
    state = squadReducer(state, { type: 'ADD_SLOT' });
    expect(state.slots).toHaveLength(5);

    // Remove until 1 slot
    state = squadReducer(state, { type: 'REMOVE_SLOT', id: state.slots[0]!.id });
    state = squadReducer(state, { type: 'REMOVE_SLOT', id: state.slots[0]!.id });
    state = squadReducer(state, { type: 'REMOVE_SLOT', id: state.slots[0]!.id });
    state = squadReducer(state, { type: 'REMOVE_SLOT', id: state.slots[0]!.id });
    expect(state.slots).toHaveLength(1);

    // Cannot remove the last slot
    const lastSlotId = state.slots[0]!.id;
    state = squadReducer(state, { type: 'REMOVE_SLOT', id: lastSlotId });
    expect(state.slots).toHaveLength(1);
    expect(state.slots[0]!.id).toBe(lastSlotId);

    // Can add slot back up to 5
    state = squadReducer(state, { type: 'ADD_SLOT' });
    expect(state.slots).toHaveLength(2);
  });

  it('AC-20.2 updates slot name up to 16 characters max', () => {
    let state = initialSquadState;
    const slotId = state.slots[0]!.id;

    state = squadReducer(state, {
      type: 'SET_NAME',
      id: slotId,
      name: 'SuperLongPlayerNameExceeding16Chars',
    });

    expect(state.slots[0]!.name).toHaveLength(16);
    expect(state.slots[0]!.name).toBe('SuperLongPlayerN');
  });

  it('AC-20.3 changing role clears lock if locked agent does not match new role', () => {
    let state = initialSquadState;
    const jett = agents.find((a) => a.slug === 'jett')!; // duelist
    const slotId = state.slots[0]!.id; // role duelist

    // Lock Jett into slot 1
    state = squadReducer(state, {
      type: 'LOCK_AGENT',
      id: slotId,
      agentId: jett.id,
    });
    expect(state.slots[0]!.lockedAgentId).toBe(jett.id);

    // Change role to controller -> lock must be dropped
    state = squadReducer(state, {
      type: 'SET_ROLE',
      id: slotId,
      role: 'controller',
    });
    expect(state.slots[0]!.lockedAgentId).toBeNull();
    expect(state.slots[0]!.role).toBe('controller');

    // Change role to flex -> does not drop lock if already locked
    state = squadReducer(state, {
      type: 'LOCK_AGENT',
      id: slotId,
      agentId: jett.id,
    });
    state = squadReducer(state, {
      type: 'SET_ROLE',
      id: slotId,
      role: 'flex',
    });
    expect(state.slots[0]!.lockedAgentId).toBe(jett.id);
  });

  it('AC-23.3 locking agent in slot 2 removes it from slot 1 if previously locked there', () => {
    let state = initialSquadState;
    const jett = agents.find((a) => a.slug === 'jett')!;
    const slot1 = state.slots[0]!.id;
    const slot2 = state.slots[1]!.id;

    // Slot 1 locks Jett
    state = squadReducer(state, {
      type: 'LOCK_AGENT',
      id: slot1,
      agentId: jett.id,
    });
    expect(state.slots[0]!.lockedAgentId).toBe(jett.id);

    // Slot 2 locks Jett -> Slot 1 must be unlocked
    state = squadReducer(state, {
      type: 'LOCK_AGENT',
      id: slot2,
      agentId: jett.id,
    });
    expect(state.slots[0]!.lockedAgentId).toBeNull();
    expect(state.slots[1]!.lockedAgentId).toBe(jett.id);

    // Unlock slot 2
    state = squadReducer(state, { type: 'UNLOCK_AGENT', id: slot2 });
    expect(state.slots[1]!.lockedAgentId).toBeNull();
  });

  it('LOCK_ALL and UNLOCK_ALL lock and unlock all available squad slots', () => {
    let state = initialSquadState;
    const jett = agents.find((a) => a.slug === 'jett')!;
    const sova = agents.find((a) => a.slug === 'sova')!;

    const mockResult: SquadResult = {
      bySlot: {
        'slot-1': jett,
        'slot-2': sova,
      },
      order: ['slot-1', 'slot-2'],
      warnings: [],
    };

    state = squadReducer(state, { type: 'SET_RESULT', result: mockResult });
    state = squadReducer(state, { type: 'LOCK_ALL' });

    expect(state.slots[0]!.lockedAgentId).toBe(jett.id);
    expect(state.slots[1]!.lockedAgentId).toBe(sova.id);

    state = squadReducer(state, { type: 'UNLOCK_ALL' });
    expect(state.slots[0]!.lockedAgentId).toBeNull();
    expect(state.slots[1]!.lockedAgentId).toBeNull();
  });

  it('HYDRATE safely replaces slot collection', () => {
    let state = initialSquadState;
    state = squadReducer(state, {
      type: 'HYDRATE',
      slots: DEFAULT_INITIAL_SLOTS.slice(0, 3),
    });
    expect(state.slots).toHaveLength(3);
  });
});
