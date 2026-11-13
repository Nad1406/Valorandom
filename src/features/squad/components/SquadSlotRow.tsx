import React, { useState } from 'react';
import { agentById, localize } from '@/data';
import { useI18n } from '@/lib/i18n';
import type { SquadRole, SquadSlot } from '@/types/squad';
import { AgentPickerPopover } from './AgentPickerPopover';
import { RoleSelect } from './RoleSelect';

interface SquadSlotRowProps {
  slot: SquadSlot;
  index: number;
  allLockedAgentIds: readonly string[];
  canRemove: boolean;
  onUpdateName: (id: string, name: string) => void;
  onUpdateRole: (id: string, role: SquadRole) => void;
  onLockAgent: (id: string, agentId: string) => void;
  onUnlockAgent: (id: string) => void;
  onRemoveSlot: (id: string) => void;
}

export const SquadSlotRow: React.FC<SquadSlotRowProps> = ({
  slot,
  index,
  allLockedAgentIds,
  canRemove,
  onUpdateName,
  onUpdateRole,
  onLockAgent,
  onUnlockAgent,
  onRemoveSlot,
}) => {
  const { lang, t } = useI18n();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const lockedAgent = slot.lockedAgentId ? agentById.get(slot.lockedAgentId) : undefined;
  const lockedAgentName = lockedAgent ? localize(lockedAgent.displayName, lang) : '';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-val-border bg-val-surface/70 p-3 transition-colors hover:border-val-border/80 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-2 sm:w-1/3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-val-border text-xs font-bold text-val-muted">
          {index + 1}
        </span>
        <input
          type="text"
          value={slot.name}
          maxLength={16}
          onChange={(e) => onUpdateName(slot.id, e.target.value)}
          placeholder={t('squad.slot.defaultName', { n: index + 1 })}
          aria-label={t('squad.slot.name')}
          className="w-full rounded-lg border border-val-border bg-val-bg px-3 py-1.5 text-sm text-val-text placeholder-val-muted/60 focus:border-val-red focus:outline-none focus:ring-1 focus:ring-val-red"
        />
      </div>

      <div className="sm:w-1/4">
        <RoleSelect
          id={`role-select-${slot.id}`}
          value={slot.role}
          onChange={(role) => onUpdateRole(slot.id, role)}
        />
      </div>

      <div className="flex flex-1 items-center justify-between gap-2">
        {lockedAgent ? (
          <div className="flex items-center gap-2 rounded-lg border border-val-red/40 bg-val-red/10 px-2.5 py-1 text-xs">
            <img
              src={lockedAgent.displayIcon}
              alt={lockedAgentName}
              className="h-6 w-6 rounded object-cover"
            />
            <span className="font-semibold text-val-text">{lockedAgentName}</span>
            <button
              type="button"
              onClick={() => onUnlockAgent(slot.id)}
              className="ml-1 text-val-muted hover:text-val-red"
              aria-label={`${t('squad.slot.unlock')} ${lockedAgentName}`}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="rounded-lg border border-dashed border-val-border px-3 py-1.5 text-xs font-medium text-val-muted transition-colors hover:border-val-text hover:text-val-text"
          >
            + {t('squad.slot.lock')}
          </button>
        )}

        <button
          type="button"
          onClick={() => onRemoveSlot(slot.id)}
          disabled={!canRemove}
          aria-label={t('squad.slot.remove')}
          className="rounded-lg p-2 text-val-muted transition-colors hover:bg-val-red/10 hover:text-val-red disabled:cursor-not-allowed disabled:opacity-30"
        >
          🗑
        </button>
      </div>

      <AgentPickerPopover
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(agentId) => onLockAgent(slot.id, agentId)}
        slotRole={slot.role}
        lockedAgentIds={allLockedAgentIds}
        currentLockedAgentId={slot.lockedAgentId ?? undefined}
      />
    </div>
  );
};
