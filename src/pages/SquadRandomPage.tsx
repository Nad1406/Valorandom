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
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 bg-val-red shadow-glow" />
            <h1 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-val-offwhite">
              {t('squad.title')}
            </h1>
          </div>
          <p className="text-white/50 text-xs sm:text-sm font-sans pl-4 mt-1">
            {t('squad.desc')}
          </p>
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

      {/* Toast & Error Alerts */}
      {toastMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-center text-sm font-tactical font-bold tracking-wider text-emerald-400"
        >
          ✓ {toastMessage}
        </div>
      )}

      {warningMessage && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 text-sm font-tactical tracking-wider text-amber-300"
        >
          ⚠️ {warningMessage}
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-val-red/50 bg-val-red/10 p-3 text-sm font-tactical font-bold tracking-wider text-val-red"
        >
          ✕ {errorMessage}
        </div>
      )}

      {/* 5-Slot Lobby Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span
            data-testid="slot-count"
            className="font-tactical text-xs font-bold tracking-widest uppercase text-val-teal"
          >
            {slots.length} / 5 Slots
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={addSlot}
            disabled={!canAddSlot}
            className="font-tactical tracking-wider"
          >
            + {t('squad.addSlot')}
          </Button>
        </div>

        {/* Vertical Lobby Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

        {/* Centered FIND MATCH / LOCK IN Button */}
        <div className="mt-4 flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={randomize}
            disabled={allLocked}
            title={allLocked ? t('squad.allLocked') : undefined}
            className="val-btn-match w-full max-w-md text-lg tracking-widest clip-tactical"
          >
            {result ? t('squad.rerollSquad') : t('squad.randomSquad')}
          </button>
          {allLocked && (
            <p className="font-tactical text-xs text-white/50 tracking-wider">
              🔒 {t('squad.allLocked')}
            </p>
          )}
        </div>
      </div>

      {/* Result Display */}
      <div aria-live="polite" className="mt-2">
        {result && (
          <Card className="flex flex-col gap-4 border-white/15 bg-[#0F1923]/95 p-5 clip-corner-tl">
            <h2 className="font-display font-black text-2xl uppercase tracking-wider text-val-offwhite">
              {t('squad.resultsTitle')}
            </h2>
            <SquadResultTable result={result} slots={slots} />
          </Card>
        )}
      </div>
    </div>
  );
};
