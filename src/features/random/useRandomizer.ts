import { useCallback, useRef, useState } from 'react';
import { createDefaultRng, pick, type Rng } from './rng';
import { useAnnounce } from '@/components/layout/LiveRegion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export interface UseRandomizerOptions<T> {
  durationMs?: number;
  onAnnounce?: (item: T) => string;
}

export function useRandomizer<T>(options?: UseRandomizerOptions<T>) {
  const durationMs = options?.durationMs ?? 400;
  const prefersReducedMotion = useReducedMotion();
  const announce = useAnnounce();

  const [result, setResult] = useState<T | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const lastPoolRef = useRef<readonly T[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const randomize = useCallback(
    (pool: readonly T[], customRng?: Rng) => {
      lastPoolRef.current = pool;
      if (pool.length === 0) {
        setResult(null);
        return;
      }

      const rng = customRng ?? createDefaultRng();
      const picked = pick(pool, rng);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (prefersReducedMotion) {
        setResult(picked);
        setIsAnimating(false);
      } else {
        setIsAnimating(true);
        timerRef.current = setTimeout(() => {
          setResult(picked);
          setIsAnimating(false);
        }, durationMs);
      }

      if (picked && options?.onAnnounce) {
        announce(options.onAnnounce(picked));
      }
    },
    [durationMs, prefersReducedMotion, announce, options],
  );

  const reroll = useCallback(
    (customRng?: Rng) => {
      randomize(lastPoolRef.current, customRng);
    },
    [randomize],
  );

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setResult(null);
    setIsAnimating(false);
  }, []);

  return {
    result,
    isAnimating,
    randomize,
    reroll,
    clear,
  };
}
