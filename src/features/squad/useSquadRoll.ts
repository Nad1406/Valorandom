import { useCallback, useEffect, useRef, useState } from 'react';
import { agents } from '@/data';
import { createDefaultRng } from '@/features/random/rng';
import { playDataTick, playTargetLock } from '@/lib/audio/tacticalSound';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { SquadSlot } from '@/types/squad';
import type { Agent } from '@/types/valorant';
import { buildRollingFrame, rollTickDelay } from './slotDisplay';

export const SQUAD_ROLL_DURATION_MS = 1100;

/**
 * Drives the in-banner roulette preview for unlocked squad slots.
 * With reduced motion enabled the roll resolves synchronously (0ms).
 */
export function useSquadRoll(durationMs: number = SQUAD_ROLL_DURATION_MS) {
  const prefersReducedMotion = useReducedMotion();
  const [rollingBySlot, setRollingBySlot] = useState<Record<string, Agent>>({});
  const [isRolling, setIsRolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelRoll = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setRollingBySlot({});
    setIsRolling(false);
  }, []);

  useEffect(() => cancelRoll, [cancelRoll]);

  const startRoll = useCallback(
    (slots: readonly SquadSlot[], onResolve: () => void) => {
      cancelRoll();
      const hasUnlocked = slots.some((s) => !s.lockedAgentId);
      if (prefersReducedMotion || !hasUnlocked) {
        onResolve();
        playTargetLock();
        return;
      }

      const rng = createDefaultRng();
      let elapsed = 0;
      setIsRolling(true);

      const tick = () => {
        const progress = elapsed / durationMs;
        if (progress >= 1) {
          timerRef.current = null;
          setRollingBySlot({});
          setIsRolling(false);
          onResolve();
          playTargetLock();
          return;
        }
        setRollingBySlot(buildRollingFrame(slots, agents, rng));
        playDataTick(progress);
        const delay = rollTickDelay(progress);
        elapsed += delay;
        timerRef.current = setTimeout(tick, delay);
      };
      tick();
    },
    [cancelRoll, durationMs, prefersReducedMotion],
  );

  return { rollingBySlot, isRolling, startRoll, cancelRoll };
}
