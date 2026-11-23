import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AgentCard } from '@/components/cards/AgentCard';
import { MapCard } from '@/components/cards/MapCard';
import { WeaponCard } from '@/components/cards/WeaponCard';
import { Card } from '@/components/ui/Card';
import { agents, maps, weapons } from '@/data';
import { createDefaultRng } from '@/features/random/rng';
import { randomCombo, type ComboResult } from '@/features/random/singleRandom';
import { playDataTick, playTargetLock } from '@/lib/audio/tacticalSound';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useI18n } from '@/lib/i18n';

const COMBO_ROLL_DURATION_MS = 480;

export const ComboPanel: React.FC = () => {
  const { t } = useI18n();
  const prefersReducedMotion = useReducedMotion();
  const [combo, setCombo] = useState<ComboResult | null>(null);
  const [rollingCombo, setRollingCombo] = useState<ComboResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const handleRollCombo = () => {
    clearTimer();
    const rng = createDefaultRng();
    const finalCombo = randomCombo(agents, maps, weapons, rng);

    if (prefersReducedMotion) {
      setCombo(finalCombo);
      setRollingCombo(null);
      setIsSpinning(false);
      playTargetLock();
      return;
    }

    let elapsed = 0;
    setIsSpinning(true);

    const tick = () => {
      const progress = elapsed / COMBO_ROLL_DURATION_MS;
      if (progress >= 1) {
        timerRef.current = null;
        setCombo(finalCombo);
        setRollingCombo(null);
        setIsSpinning(false);
        playTargetLock();
        return;
      }
      setRollingCombo(randomCombo(agents, maps, weapons, rng));
      playDataTick(progress);
      const delay = 45 + 95 * progress * progress;
      elapsed += delay;
      timerRef.current = setTimeout(tick, delay);
    };
    tick();
  };

  const shownCombo = rollingCombo ?? combo;

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 bg-bg-elevated/95 border border-white/12 flex flex-col sm:flex-row items-center justify-between gap-4 clip-corner-tl">
        <div>
          <h2 className="font-display font-black text-3xl uppercase tracking-wider text-val-offwhite leading-none">
            {t('single.combo.title')}
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1.5 font-sans">
            {t('single.combo.desc')}
          </p>
        </div>
        <button
          type="button"
          disabled={isSpinning}
          onClick={handleRollCombo}
          className="val-btn-match w-full sm:w-auto text-base tracking-widest clip-tactical shrink-0"
        >
          {isSpinning
            ? t('single.scanning')
            : combo
              ? t('common.reroll')
              : t('single.combo.button')}
        </button>
      </Card>

      {shownCombo ? (
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${
            isSpinning ? 'opacity-65' : 'animate-fade-up motion-reduce:animate-none'
          }`}
        >
          {shownCombo.agent && <AgentCard agent={shownCombo.agent} highlight={!isSpinning} />}
          {shownCombo.map && <MapCard map={shownCombo.map} highlight={!isSpinning} />}
          {shownCombo.weapon && <WeaponCard weapon={shownCombo.weapon} highlight={!isSpinning} />}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-45 transition-opacity">
          {agents[0] && <AgentCard agent={agents[0]} />}
          {maps[0] && <MapCard map={maps[0]} />}
          {weapons[0] && <WeaponCard weapon={weapons[0]} />}
        </div>
      )}
    </div>
  );
};
