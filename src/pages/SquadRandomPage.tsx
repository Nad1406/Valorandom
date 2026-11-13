import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  SquadResultTable,
  SquadSlotRow,
  useSquad,
} from '@/features/squad';
import { useI18n } from '@/lib/i18n';

export const SquadRandomPage: React.FC = () => {
  const { t } = useI18n();
  const {
    slots,
    result,
    errorMessage,
    warningMessage,
    toastMessage,
    allLocked,
    allLockedAgentIds,
    canAddSlot,
    canRemoveSlot,
    randomize,
    shareSquad,
    updateName,
    updateRole,
    lockAgent,
    unlockAgent,
    addSlot,
    removeSlot,
    resetSquad,
  } = useSquad();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-val-text sm:text-3xl">
            {t('squad.title')}
          </h1>
          <p className="text-sm text-val-muted">{t('squad.desc')}</p>
        </div>

        <div className="mt-2 flex items-center gap-2 sm:mt-0">
          <Button variant="outline" size="sm" onClick={resetSquad}>
            {t('squad.reset')}
          </Button>
          <Button variant="secondary" size="sm" onClick={shareSquad}>
            📋 {t('squad.share')}
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-emerald-400"
        >
          ✓ {toastMessage}
        </div>
      )}

      {warningMessage && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-300"
        >
          ⚠️ {warningMessage}
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-val-red/50 bg-val-red/10 p-3 text-sm font-medium text-val-red"
        >
          ✕ {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span
            data-testid="slot-count"
            className="text-xs font-bold uppercase tracking-wider text-val-muted"
          >
            {slots.length} / 5 Slots
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={addSlot}
            disabled={!canAddSlot}
          >
            + {t('squad.addSlot')}
          </Button>
        </div>

        <div className="flex flex-col gap-2.5">
          {slots.map((slot, index) => (
            <SquadSlotRow
              key={slot.id}
              slot={slot}
              index={index}
              allLockedAgentIds={allLockedAgentIds}
              canRemove={canRemoveSlot}
              onUpdateName={updateName}
              onUpdateRole={updateRole}
              onLockAgent={lockAgent}
              onUnlockAgent={unlockAgent}
              onRemoveSlot={removeSlot}
            />
          ))}
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={randomize}
            disabled={allLocked}
            title={allLocked ? t('squad.allLocked') : undefined}
            className="w-full text-base font-bold uppercase tracking-wider"
          >
            {result ? t('squad.rerollSquad') : t('squad.randomSquad')}
          </Button>
          {allLocked && (
            <p className="text-center text-xs text-val-muted">
              🔒 {t('squad.allLocked')}
            </p>
          )}
        </div>
      </div>

      <div aria-live="polite" className="mt-4">
        {result && (
          <Card className="flex flex-col gap-4 border-val-border bg-val-bg/50 p-4">
            <h2 className="text-lg font-bold text-val-text">
              {t('squad.resultsTitle')}
            </h2>
            <SquadResultTable result={result} slots={slots} />
          </Card>
        )}
      </div>
    </div>
  );
};
