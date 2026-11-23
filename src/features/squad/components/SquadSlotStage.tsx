import React from 'react';
import { Lock, RefreshCw, Unlock } from 'lucide-react';
import { localize } from '@/data';
import type { SlotDisplay } from '@/features/squad/slotDisplay';
import { useI18n } from '@/lib/i18n';
import type { Agent } from '@/types/valorant';
import { ROLE_STYLES } from './roleStyles';

interface SquadSlotStageProps {
  display: SlotDisplay;
  onOpenPicker: () => void;
  onLock: (agentId: string) => void;
  onUnlock: () => void;
}

const ACTION_BTN =
  'inline-flex items-center gap-1 rounded-sm border px-2 py-1 font-tactical text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red';

const EmptyStage: React.FC<{ onOpenPicker: () => void }> = ({ onOpenPicker }) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center gap-3.5 text-center p-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-dashed border-white/20 bg-bg-elevated/60 font-display text-4xl font-black text-ink-muted clip-chamfer-sm">
        ?
      </div>
      <button
        type="button"
        onClick={onOpenPicker}
        className="rounded-sm border border-dashed border-white/25 bg-bg-elevated/60 px-3 py-1.5 font-tactical text-xs font-bold uppercase tracking-widest text-val-offwhite transition-colors hover:border-val-red hover:bg-val-red/10 hover:text-val-red focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red"
      >
        + {t('squad.slot.lock')}
      </button>
    </div>
  );
};

interface StageActionsProps {
  kind: 'rolled' | 'locked';
  agent: Agent;
  agentName: string;
  onOpenPicker: () => void;
  onLock: (agentId: string) => void;
  onUnlock: () => void;
}

const StageActions: React.FC<StageActionsProps> = (props) => {
  const { kind, agent, agentName, onOpenPicker, onLock, onUnlock } = props;
  const { t } = useI18n();

  if (kind === 'locked') {
    return (
      <button
        type="button"
        onClick={onUnlock}
        aria-label={`${t('squad.slot.unlock')} ${agentName}`}
        className={`${ACTION_BTN} border-val-teal/70 bg-bg-base/80 text-val-teal hover:bg-val-teal/20`}
      >
        <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
        {t('squad.slot.unlock')}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpenPicker}
        aria-label={t('squad.slot.change')}
        title={t('squad.slot.change')}
        className={`${ACTION_BTN} border-white/25 bg-bg-base/80 text-ink-muted hover:border-white/45 hover:text-val-offwhite`}
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onLock(agent.id)}
        aria-label={`${t('squad.slot.lockShort')} ${agentName}`}
        className={`${ACTION_BTN} border-white/25 bg-bg-base/80 text-val-offwhite hover:border-val-red hover:text-val-red`}
      >
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        {t('squad.slot.lockShort')}
      </button>
    </>
  );
};

const StageCaption: React.FC<{ agent: Agent; agentName: string; isRolling: boolean }> = ({
  agent,
  agentName,
  isRolling,
}) => {
  const { t } = useI18n();
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 bg-gradient-to-t from-bg-base/95 via-bg-base/65 to-transparent p-3 pt-8">
      {isRolling ? (
        <span className="font-tactical text-xs font-bold uppercase tracking-widest text-val-red">
          {t('squad.slot.rolling')}
        </span>
      ) : (
        <span
          className={`rounded-sm border px-1.5 py-0.5 font-tactical text-[10px] font-bold uppercase tracking-widest ${ROLE_STYLES[agent.role].badge}`}
        >
          {t(`role.${agent.role}`)}
        </span>
      )}
      <span
        aria-hidden={isRolling ? true : undefined}
        className={`font-display text-3xl font-black uppercase leading-none tracking-tight ${
          isRolling ? 'text-ink-muted' : 'text-val-offwhite'
        }`}
      >
        {agentName}
      </span>
    </div>
  );
};

type AgentDisplay = Exclude<SlotDisplay, { kind: 'empty' }>;

const AgentStage: React.FC<Omit<SquadSlotStageProps, 'display'> & { display: AgentDisplay }> = ({
  display,
  onOpenPicker,
  onLock,
  onUnlock,
}) => {
  const { lang, t } = useI18n();
  const { agent, kind } = display;
  const agentName = localize(agent.displayName, lang);
  const isRolling = kind === 'rolling';

  return (
    <div className="absolute inset-0" data-testid="slot-agent" data-state={kind}>
      <div
        className={`absolute inset-0 bg-gradient-to-b ${ROLE_STYLES[agent.role].glow} via-transparent to-bg-base/90`}
      />
      <img
        src={agent.fullPortrait || agent.displayIcon}
        alt={isRolling ? '' : agentName}
        aria-hidden={isRolling ? true : undefined}
        className={`absolute inset-0 h-full w-full object-cover object-[50%_12%] ${
          isRolling ? 'opacity-55' : 'animate-fade-up motion-reduce:animate-none'
        }`}
      />
      {isRolling && (
        <span className="pointer-events-none absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-transparent via-val-red/40 to-transparent animate-scan motion-reduce:animate-none" />
      )}
      {kind === 'locked' && (
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm border border-val-teal/70 bg-bg-base/85 px-1.5 py-0.5 font-tactical text-[10px] font-bold uppercase tracking-widest text-val-teal">
          <Lock className="h-3 w-3" aria-hidden="true" />
          {t('squad.slot.locked')}
        </span>
      )}
      {kind !== 'rolling' && (
        <div className="absolute right-2 top-2 flex items-center gap-1">
          <StageActions
            kind={kind}
            agent={agent}
            agentName={agentName}
            onOpenPicker={onOpenPicker}
            onLock={onLock}
            onUnlock={onUnlock}
          />
        </div>
      )}
      <StageCaption agent={agent} agentName={agentName} isRolling={isRolling} />
    </div>
  );
};

export const SquadSlotStage: React.FC<SquadSlotStageProps> = (props) => {
  if (props.display.kind === 'empty') {
    return <EmptyStage onOpenPicker={props.onOpenPicker} />;
  }
  return <AgentStage {...props} display={props.display} />;
};
