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
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-[#0F1923]/90 p-4 transition-all hover:border-val-red/50 shadow-tactical min-h-[380px] clip-corner-tl">
      {/* Top Banner Header: Slot number & Remove Button */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 z-10">
        <span className="font-tactical text-xs font-bold tracking-widest text-val-teal uppercase">
          // SLOT 0{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemoveSlot(slot.id)}
          disabled={!canRemove}
          aria-label={t('squad.slot.remove')}
          className="rounded p-1 text-white/40 transition-colors hover:bg-val-red/10 hover:text-val-red disabled:cursor-not-allowed disabled:opacity-20"
          title={t('squad.slot.remove')}
        >
          🗑
        </button>
      </div>

      {/* Middle Stage: Locked Agent Artwork OR Empty Slot Lock Button */}
      <div className="relative my-3 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-white/[0.03] to-black/30 p-2">
        {lockedAgent ? (
          <div className="flex flex-col items-center justify-center text-center w-full animate-fade-up">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-val-red shadow-glow bg-[#18222D]">
              <img
                src={lockedAgent.fullPortrait || lockedAgent.displayIcon}
                alt={lockedAgentName}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <span className="mt-2 font-display text-2xl font-black uppercase tracking-wider text-val-offwhite">
              {lockedAgentName}
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="rounded bg-val-red/20 px-2 py-0.5 font-tactical text-[11px] font-bold tracking-widest text-val-red border border-val-red/40">
                🔒 {t('squad.slot.lock')}
              </span>
              <button
                type="button"
                onClick={() => onUnlockAgent(slot.id)}
                className="rounded px-1.5 py-0.5 text-xs text-white/60 hover:bg-white/10 hover:text-val-red border border-white/20"
                aria-label={`${t('squad.slot.unlock')} ${lockedAgentName}`}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <div className="h-20 w-20 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/30 font-tactical text-2xl">
              ?
            </div>
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="rounded border border-dashed border-white/25 px-3 py-1.5 font-tactical text-xs font-bold tracking-widest text-white/70 uppercase transition-all hover:border-val-red hover:text-val-red hover:bg-val-red/10"
            >
              + {t('squad.slot.lock')}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Info: Player Name & Role Select */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/10 z-10">
        <input
          type="text"
          value={slot.name}
          maxLength={16}
          onChange={(e) => onUpdateName(slot.id, e.target.value)}
          placeholder={t('squad.slot.defaultName', { n: index + 1 })}
          aria-label={t('squad.slot.name')}
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-1.5 font-tactical text-sm tracking-wider text-val-offwhite placeholder-white/30 focus:border-val-red focus:outline-none focus:ring-1 focus:ring-val-red uppercase"
        />

        <RoleSelect
          id={`role-select-${slot.id}`}
          value={slot.role}
          onChange={(role) => onUpdateRole(slot.id, role)}
        />
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
