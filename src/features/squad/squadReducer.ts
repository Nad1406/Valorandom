import { agentById } from '@/data';
import type { SquadResult, SquadSlot } from '@/types/squad';
import type { SlotRole } from '@/types/valorant';

export interface SquadState {
  slots: SquadSlot[];
  lastResult: SquadResult | null;
}

export type SquadAction =
  | { type: 'ADD_SLOT' }
  | { type: 'REMOVE_SLOT'; id: string }
  | { type: 'SET_NAME'; id: string; name: string }
  | { type: 'SET_ROLE'; id: string; role: SlotRole }
  | { type: 'LOCK_AGENT'; id: string; agentId: string }
  | { type: 'UNLOCK_AGENT'; id: string }
  | { type: 'LOCK_ALL' }
  | { type: 'UNLOCK_ALL' }
  | { type: 'RESET' }
  | { type: 'SET_RESULT'; result: SquadResult | null }
  | { type: 'HYDRATE'; slots: SquadSlot[]; lastResult?: SquadResult | null };

export const DEFAULT_INITIAL_SLOTS: SquadSlot[] = [
  { id: 'slot-1', name: 'Player 1', role: 'duelist', lockedAgentId: null },
  { id: 'slot-2', name: 'Player 2', role: 'initiator', lockedAgentId: null },
  { id: 'slot-3', name: 'Player 3', role: 'controller', lockedAgentId: null },
  { id: 'slot-4', name: 'Player 4', role: 'sentinel', lockedAgentId: null },
  { id: 'slot-5', name: 'Player 5', role: 'flex', lockedAgentId: null },
];

export const initialSquadState: SquadState = {
  slots: DEFAULT_INITIAL_SLOTS,
  lastResult: null,
};

let slotCounter = 6;
function createNewSlot(existingLength: number): SquadSlot {
  slotCounter += 1;
  return {
    id: `slot-${slotCounter}`,
    name: `Player ${existingLength + 1}`,
    role: 'flex',
    lockedAgentId: null,
  };
}

export function squadReducer(state: SquadState, action: SquadAction): SquadState {
  switch (action.type) {
    case 'ADD_SLOT': {
      if (state.slots.length >= 5) return state;
      return {
        ...state,
        slots: [...state.slots, createNewSlot(state.slots.length)],
      };
    }

    case 'REMOVE_SLOT': {
      if (state.slots.length <= 1) return state;
      return {
        ...state,
        slots: state.slots.filter((s) => s.id !== action.id),
      };
    }

    case 'SET_NAME': {
      return {
        ...state,
        slots: state.slots.map((s) =>
          s.id === action.id ? { ...s, name: action.name.slice(0, 16) } : s,
        ),
      };
    }

    case 'SET_ROLE': {
      return {
        ...state,
        slots: state.slots.map((s) => {
          if (s.id !== action.id) return s;
          let lockedAgentId = s.lockedAgentId;
          if (lockedAgentId && action.role !== 'flex') {
            const agent = agentById.get(lockedAgentId);
            if (!agent || agent.role !== action.role) {
              lockedAgentId = null;
            }
          }
          return { ...s, role: action.role, lockedAgentId };
        }),
      };
    }

    case 'LOCK_AGENT': {
      return {
        ...state,
        slots: state.slots.map((s) => {
          if (s.id === action.id) {
            return { ...s, lockedAgentId: action.agentId };
          }
          if (s.lockedAgentId === action.agentId) {
            return { ...s, lockedAgentId: null };
          }
          return s;
        }),
      };
    }

    case 'UNLOCK_AGENT': {
      return {
        ...state,
        slots: state.slots.map((s) =>
          s.id === action.id ? { ...s, lockedAgentId: null } : s,
        ),
      };
    }

    case 'LOCK_ALL': {
      if (!state.lastResult) return state;
      const bySlot = state.lastResult.bySlot;
      return {
        ...state,
        slots: state.slots.map((s) => {
          const agent = bySlot[s.id];
          if (!agent) return s;
          if (s.role !== 'flex' && agent.role !== s.role) return s;
          return { ...s, lockedAgentId: agent.id };
        }),
      };
    }

    case 'UNLOCK_ALL': {
      return {
        ...state,
        slots: state.slots.map((s) => ({ ...s, lockedAgentId: null })),
      };
    }

    case 'RESET': {
      return initialSquadState;
    }

    case 'SET_RESULT': {
      return {
        ...state,
        lastResult: action.result,
      };
    }

    case 'HYDRATE': {
      return {
        ...state,
        slots: action.slots.slice(0, 5),
        lastResult: action.lastResult !== undefined ? action.lastResult : state.lastResult,
      };
    }

    default:
      return state;
  }
}
