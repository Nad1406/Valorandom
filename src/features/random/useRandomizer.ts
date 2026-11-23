import { useCallback, useEffect, useRef, useState } from 'react';
import { createDefaultRng, pick, type Rng } from './rng';
import { useAnnounce } from '@/components/layout/LiveRegion';
import { playDataTick, playTargetLock } from '@/lib/audio/tacticalSound';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export interface UseRandomizerOptions<T> {
  durationMs?: number;
  onAnnounce?: (item: T) => string;
}

function getTickDelay(progress: number): number {
  const p = progress < 0 ? 0 : progress > 1 ? 1 : progress;
  return 45 + 90 * p * p;
}

function selectTarget<T>(pool: readonly T[], prevResult: T | null, customRng?: Rng): T | null {
  if (customRng) {
    return pick(pool, customRng);
  }
  const rng = createDefaultRng();
  if (pool.length > 1 && prevResult !== null) {
    const freshPool = pool.filter((item) => item !== prevResult);
    if (freshPool.length > 0) return pick(freshPool, rng);
  }
  return pick(pool, rng);
}

export function useRandomizer<T>(options?: UseRandomizerOptions<T>) {
  const durationMs = options?.durationMs ?? 480;
  const prefersReducedMotion = useReducedMotion();
  const announce = useAnnounce();

  const [result, setResult] = useState<T | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [rollingItem, setRollingItem] = useState<T | null>(null);

  const lastPoolRef = useRef<readonly T[]>([]);
  const resultRef = useRef<T | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  resultRef.current = result;

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const finishRoll = useCallback(
    (picked: T | null) => {
      clearTimers();
      setResult(picked);
      setRollingItem(null);
      setIsAnimating(false);
      playTargetLock();
      if (picked && options?.onAnnounce) {
        announce(options.onAnnounce(picked));
      }
    },
    [clearTimers, announce, options],
  );

  const randomize = useCallback(
    (pool: readonly T[], customRng?: Rng) => {
      lastPoolRef.current = pool;
      clearTimers();
      if (pool.length === 0) {
        setResult(null);
        setRollingItem(null);
        setIsAnimating(false);
        return;
      }

      const picked = selectTarget(pool, resultRef.current, customRng);
      if (prefersReducedMotion || durationMs <= 0) {
        finishRoll(picked);
        return;
      }

      const previewRng = customRng ?? createDefaultRng();
      let elapsed = 0;
      setIsAnimating(true);

      const tick = () => {
        const progress = elapsed / durationMs;
        if (progress >= 1) {
          finishRoll(picked);
          return;
        }
        setRollingItem(pick(pool, previewRng));
        playDataTick(progress);
        const delay = getTickDelay(progress);
        elapsed += delay;
        timerRef.current = setTimeout(tick, delay);
      };
      tick();
    },
    [clearTimers, durationMs, finishRoll, prefersReducedMotion],
  );

  const reroll = useCallback(
    (customRng?: Rng) => {
      randomize(lastPoolRef.current, customRng);
    },
    [randomize],
  );

  const clear = useCallback(() => {
    clearTimers();
    setResult(null);
    setRollingItem(null);
    setIsAnimating(false);
  }, [clearTimers]);

  return { result, isAnimating, rollingItem, randomize, reroll, clear };
}
