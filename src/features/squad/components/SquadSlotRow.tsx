import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { SlotDisplay } from '@/features/squad/slotDisplay';
import { playUiClick } from '@/lib/audio/tacticalSound';
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
  rolling: 'border-val-red/70 shadow-glow',
  rolled: 'border-white/25 hover:border-val-red/60',
  locked: 'border-val-teal shadow-glow-teal',
};

const TOP_BAR_CLASS: Record<SlotDisplay['kind'], string> = {
  empty: 'bg-white/10',
  rolling: 'bg-val-red',
  rolled: 'bg-white/30',
  locked: 'bg-val-teal',
};

type SlotSectionProps = Pick<
  SquadSlotRowProps,
  'slot' | 'index' | 'canRemove' | 'onRemoveSlot' | 'onUpdateName' | 'onUpdateRole'
>;

const SlotHeader: React.FC<SlotSectionProps> = ({ slot, index, canRemove, onRemoveSlot }) => {
  const { t } = useI18n();
  return (
    <div className="z-10 flex items-center justify-between border-b border-white/10 pb-2">
      <span className="font-tactical text-xs font-bold uppercase tracking-widest text-val-teal tabular-nums">
        SLOT 0{index + 1}
      </span>
      <button
        type="button"
        onClick={() => onRemoveSlot(slot.id)}
        disabled={!canRemove}
        aria-label={t('squad.slot.remove')}
        title={t('squad.slot.remove')}
        className="rounded-sm p-1 text-ink-muted transition-colors hover:bg-val-red/10 hover:text-val-red focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red disabled:cursor-not-allowed disabled:opacity-25"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

const SlotFooter: React.FC<SlotSectionProps> = ({ slot, index, onUpdateName, onUpdateRole }) => {
  const { t } = useI18n();
  return (
    <div className="z-10 flex flex-col gap-2 border-t border-white/10 pt-2.5">
      <input
        type="text"
        value={slot.name}
        maxLength={16}
        onChange={(e) => onUpdateName(slot.id, e.target.value)}
        placeholder={t('squad.slot.defaultName', { n: index + 1 })}
        aria-label={t('squad.slot.name')}
        className="w-full rounded-sm border border-white/15 bg-bg-base px-3 py-1.5 font-tactical text-sm font-semibold uppercase tracking-wider text-val-offwhite placeholder-ink-muted/70 focus:border-val-red focus:outline-none focus:ring-1 focus:ring-val-red"
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
      className={`relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-sm border bg-bg-elevated/95 p-4 shadow-tactical transition-colors clip-corner-tl ${CARD_STATE_CLASS[display.kind]}`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${TOP_BAR_CLASS[display.kind]}`} />

      <SlotHeader {...props} />

      <div className="relative my-3 flex min-h-[220px] flex-1 flex-col items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-bg-base/80">
        <SquadSlotStage
          display={display}
          onOpenPicker={() => {
            playUiClick();
            setIsPickerOpen(true);
          }}
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
