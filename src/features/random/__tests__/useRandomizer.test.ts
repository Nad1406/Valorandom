import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mulberry32 } from '@/features/random/rng';
import { useRandomizer } from '@/features/random/useRandomizer';

describe('useRandomizer Hook (P2-03)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('randomizes an item with animation delay and updates result', () => {
    const { result } = renderHook(() =>
      useRandomizer<string>({ durationMs: 400 }),
    );

    const pool = ['apple', 'banana', 'orange'];
    const rng = mulberry32(42);

    act(() => {
      result.current.randomize(pool, rng);
    });

    expect(result.current.isAnimating).toBe(true);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.isAnimating).toBe(false);
    expect(result.current.result).not.toBeNull();
    expect(pool).toContain(result.current.result);
  });

  it('reroll uses the latest pool without needing arguments', () => {
    const { result } = renderHook(() =>
      useRandomizer<string>({ durationMs: 200 }),
    );

    const pool = ['valorant', 'overwatch', 'csgo'];
    act(() => {
      result.current.randomize(pool, mulberry32(1));
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    const firstResult = result.current.result;

    act(() => {
      result.current.reroll(mulberry32(2));
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(pool).toContain(result.current.result);
    expect(result.current.result).toBeDefined();
    expect(firstResult).toBeDefined();
  });

  it('handles empty pool safely by setting result to null', () => {
    const { result } = renderHook(() => useRandomizer<string>());

    act(() => {
      result.current.randomize([]);
    });

    expect(result.current.result).toBeNull();
    expect(result.current.isAnimating).toBe(false);
  });
});
