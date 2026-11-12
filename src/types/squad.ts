import type { Agent, SlotRole } from '@/types/valorant';

export interface SquadSlot {
  id: string;
  name: string;
  role: SlotRole;
  lockedAgentId: string | null;
}

export interface SquadState {
  slots: SquadSlot[];
}

export type SquadErrorCode =
  | 'INVALID_SLOT_COUNT'
  | 'INVALID_LOCK'
  | 'INVALID_LOCK_ROLE'
  | 'INSUFFICIENT_ROLE'
  | 'EXHAUSTED_POOL';

export interface SquadErrorDetail {
  role?: SlotRole;
  needed?: number;
  availableCount?: number;
  agentId?: string;
}

export type SquadWarningCode = 'TEAM_MISSING_ROLE' | 'FLEX_NOT_FILLED';

export interface SquadWarning {
  code: SquadWarningCode;
  role?: SlotRole;
}

export interface SquadResult {
  /** slotId -> agent được gán */
  bySlot: Record<string, Agent>;
  /** slotId theo thứ tự được assign */
  order: string[];
  warnings: SquadWarning[];
}
