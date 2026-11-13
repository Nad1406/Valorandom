import { useCallback, useRef, useState } from 'react';
import { createDefaultRng, pick, type Rng } from './rng';
import { useAnnounce } from '@/components/layout/LiveRegion';
import { playDataTick, playTargetLock } from '@/lib/audio/tacticalSound';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export interface UseRandomizerOptions<T> {
  durationMs?: number;
  onAnnounce?: (item: T) => string;
}

export function useRandomizer<T>(options?: UseRandomizerOptions<T>) {
  const durationMs = options?.durationMs ?? 1100;
  const prefersReducedMotion = useReducedMotion();
  const announce = useAnnounce();

  const [result, setResult] = useState<T | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [rollingItem, setRollingItem] = useState<T | null>(null);

  const lastPoolRef = useRef<readonly T[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const randomize = useCallback(
    (pool: readonly T[], customRng?: Rng) => {
      lastPoolRef.current = pool;
      if (pool.length === 0) {
        setResult(null);
        setRollingItem(null);
        setIsAnimating(false);
        return;
      }

      const rng = customRng ?? createDefaultRng();
      const picked = pick(pool, rng);

      clearTimers();
      setIsAnimating(true);
      const startTime = Date.now();

      if (prefersReducedMotion) {
        setRollingItem(picked);
        playDataTick(0.5);
      } else {
        playDataTick(0);
        // Roulette preview tick
        intervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1, elapsed / durationMs);
          const randIndex = Math.floor(Math.random() * pool.length);
          setRollingItem(pool[randIndex] ?? null);
          playDataTick(progress);
        }, 75);
      }

      // Final result resolve
      timerRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setResult(picked);
        setRollingItem(null);
        setIsAnimating(false);
        playTargetLock();
        if (picked && options?.onAnnounce) {
          announce(options.onAnnounce(picked));
        }
      }, durationMs);
    },
    [clearTimers, durationMs, prefersReducedMotion, announce, options],
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

  return {
    result,
    isAnimating,
    rollingItem,
    randomize,
    reroll,
    clear,
  };
}
