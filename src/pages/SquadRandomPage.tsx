import React from 'react';
import { Button } from '@/components/ui/Button';
import { localize } from '@/data';
import {
  SquadMissingRolesAlert,
  SquadSlotRow,
  useSquad,
  type SlotDisplay,
} from '@/features/squad';
import { useI18n } from '@/lib/i18n';

type SquadApi = ReturnType<typeof useSquad>;

const SquadPageHeader: React.FC<Pick<SquadApi, 'resetSquad' | 'shareSquad'>> = ({
  resetSquad,
  shareSquad,
}) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 bg-val-red shadow-glow" />
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-val-offwhite sm:text-5xl">
            {t('squad.title')}
          </h1>
        </div>
        <p className="mt-1 pl-4 font-sans text-xs text-white/50 sm:text-sm">{t('squad.desc')}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={resetSquad}>
          {t('squad.reset')}
        </Button>
        <Button variant="secondary" size="sm" onClick={shareSquad}>
          📋 {t('squad.share')}
        </Button>
      </div>
    </div>
  );
};

const SquadAlerts: React.FC<
  Pick<SquadApi, 'toastMessage' | 'warningMessage' | 'errorMessage' | 'missingRoles'>
> = ({ toastMessage, warningMessage, errorMessage, missingRoles }) => (
  <>
    {toastMessage && (
      <div
        role="status"
        className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-center font-tactical text-sm font-bold tracking-wider text-emerald-400"
      >
        ✓ {toastMessage}
      </div>
    )}
    {warningMessage && (
      <div
        role="status"
        className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 font-tactical text-sm tracking-wider text-amber-300"
      >
        ⚠️ {warningMessage}
      </div>
    )}
    {errorMessage && (
      <div
        role="alert"
        className="rounded-lg border border-val-red/50 bg-val-red/10 p-3 font-tactical text-sm font-bold tracking-wider text-val-red"
      >
        ✕ {errorMessage}
      </div>
    )}
    <SquadMissingRolesAlert missingRoles={missingRoles} />
  </>
);

const SquadAnnouncer: React.FC<{ displays: readonly SlotDisplay[]; isRolling: boolean }> = ({
  displays,
  isRolling,
}) => {
  const { lang } = useI18n();
  const names = isRolling
    ? ''
    : displays
        .map((d) => (d.kind === 'rolled' || d.kind === 'locked' ? localize(d.agent.displayName, lang) : null))
        .filter((n): n is string => Boolean(n))
        .join(', ');
  return (
    <p aria-live="polite" className="sr-only" data-testid="squad-announcer">
      {names}
    </p>
  );
};

const SquadLaunchButton: React.FC<Pick<SquadApi, 'randomize' | 'allLocked' | 'isRolling' | 'result'>> = ({
  randomize,
  allLocked,
  isRolling,
  result,
}) => {
  const { t } = useI18n();
  return (
    <div className="mt-2 flex flex-col items-center justify-center gap-2">
      <button
        type="button"
        onClick={randomize}
        disabled={allLocked || isRolling}
        aria-busy={isRolling}
        title={allLocked ? t('squad.allLocked') : undefined}
        className="val-btn-match w-full max-w-md text-lg tracking-widest clip-tactical"
      >
        {result ? t('squad.rerollSquad') : t('squad.randomSquad')}
      </button>
      {allLocked && (
        <p className="font-tactical text-xs tracking-wider text-white/50">🔒 {t('squad.allLocked')}</p>
      )}
    </div>
  );
};

export const SquadRandomPage: React.FC = () => {
  const { t } = useI18n();
  const squad = useSquad();

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <SquadPageHeader resetSquad={squad.resetSquad} shareSquad={squad.shareSquad} />
      <SquadAlerts {...squad} />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span
            data-testid="slot-count"
            className="font-tactical text-xs font-bold uppercase tracking-widest text-val-teal"
          >
            {squad.slots.length} / 5 Slots
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={squad.addSlot}
            disabled={!squad.canAddSlot}
            className="font-tactical tracking-wider"
          >
            + {t('squad.addSlot')}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {squad.slots.map((slot, index) => (
            <SquadSlotRow
              key={slot.id}
              slot={slot}
              index={index}
              display={squad.slotDisplays[index] ?? { kind: 'empty' }}
              allLockedAgentIds={squad.allLockedAgentIds}
              canRemove={squad.canRemoveSlot}
              onUpdateName={squad.updateName}
              onUpdateRole={squad.updateRole}
              onLockAgent={squad.lockAgent}
              onUnlockAgent={squad.unlockAgent}
              onRemoveSlot={squad.removeSlot}
            />
          ))}
        </div>

        <SquadLaunchButton {...squad} />
        <SquadAnnouncer displays={squad.slotDisplays} isRolling={squad.isRolling} />
      </div>
    </div>
  );
};
