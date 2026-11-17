import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { SlotDisplay } from '@/features/squad/slotDisplay';
import { useI18n } from '@/lib/i18n';
import type { SquadRole, SquadSlot } from '@/types/squad';
import { AgentPickerPopover } from './AgentPickerPopover';
import { RoleSelect } from './RoleSelect';
import { SquadSlotStage } from './SquadSlotStage';

interface SquadSlotRowProps {
  slot: SquadSlot;
  index: number;
  display: SlotDisplay;
  allLockedAgentIds: readonly string[];
  canRemove: boolean;
  onUpdateName: (id: string, name: string) => void;
  onUpdateRole: (id: string, role: SquadRole) => void;
  onLockAgent: (id: string, agentId: string) => void;
  onUnlockAgent: (id: string) => void;
  onRemoveSlot: (id: string) => void;
}

const CARD_STATE_CLASS: Record<SlotDisplay['kind'], string> = {
  empty: 'border-white/15 hover:border-val-red/50',
  rolling: 'border-val-red/60 shadow-glow',
  rolled: 'border-white/25 hover:border-val-red/60',
  locked: 'border-val-teal shadow-glow-teal',
};

type SlotSectionProps = Pick<
  SquadSlotRowProps,
  'slot' | 'index' | 'canRemove' | 'onRemoveSlot' | 'onUpdateName' | 'onUpdateRole'
>;

const SlotHeader: React.FC<SlotSectionProps> = ({ slot, index, canRemove, onRemoveSlot }) => {
  const { t } = useI18n();
  return (
    <div className="z-10 flex items-center justify-between border-b border-white/10 pb-2">
      <span className="font-tactical text-xs font-bold uppercase tracking-widest text-val-teal">
        // SLOT 0{index + 1}
      </span>
      <button
        type="button"
        onClick={() => onRemoveSlot(slot.id)}
        disabled={!canRemove}
        aria-label={t('squad.slot.remove')}
        title={t('squad.slot.remove')}
        className="rounded p-1 text-white/40 transition-colors hover:bg-val-red/10 hover:text-val-red focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red disabled:cursor-not-allowed disabled:opacity-20"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

const SlotFooter: React.FC<SlotSectionProps> = ({ slot, index, onUpdateName, onUpdateRole }) => {
  const { t } = useI18n();
  return (
    <div className="z-10 flex flex-col gap-2 border-t border-white/10 pt-2">
      <input
        type="text"
        value={slot.name}
        maxLength={16}
        onChange={(e) => onUpdateName(slot.id, e.target.value)}
        placeholder={t('squad.slot.defaultName', { n: index + 1 })}
        aria-label={t('squad.slot.name')}
        className="w-full rounded border border-white/15 bg-black/40 px-3 py-1.5 font-tactical text-sm uppercase tracking-wider text-val-offwhite placeholder-white/30 focus:border-val-red focus:outline-none focus:ring-1 focus:ring-val-red"
      />
      <RoleSelect
        id={`role-select-${slot.id}`}
        value={slot.role}
        onChange={(role) => onUpdateRole(slot.id, role)}
      />
    </div>
  );
};

export const SquadSlotRow: React.FC<SquadSlotRowProps> = (props) => {
  const { slot, display, allLockedAgentIds, onLockAgent, onUnlockAgent } = props;
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div
      data-testid="squad-slot"
      className={`relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-xl border bg-[#0F1923]/90 p-4 shadow-tactical transition-all clip-corner-tl ${CARD_STATE_CLASS[display.kind]}`}
    >
      <SlotHeader {...props} />

      <div className="relative my-3 flex min-h-[220px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-white/[0.03] to-black/30">
        <SquadSlotStage
          display={display}
          onOpenPicker={() => setIsPickerOpen(true)}
          onLock={(agentId) => onLockAgent(slot.id, agentId)}
          onUnlock={() => onUnlockAgent(slot.id)}
        />
      </div>

      <SlotFooter {...props} />

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
