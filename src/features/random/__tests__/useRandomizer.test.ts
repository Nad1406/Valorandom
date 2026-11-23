import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mulberry32 } from '@/features/random/rng';
import { useRandomizer } from '@/features/random/useRandomizer';

function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

describe('useRandomizer Hook (P2-03)', () => {
  beforeEach(() => {
    mockReducedMotion(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    mockReducedMotion(false);
    vi.useRealTimers();
  });

  it('randomizes an item with animation delay and updates result', () => {
    const { result } = renderHook(() => useRandomizer<string>({ durationMs: 400 }));
    const pool = ['apple', 'banana', 'orange'];

    act(() => {
      result.current.randomize(pool, mulberry32(42));
    });

    expect(result.current.isAnimating).toBe(true);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(result.current.isAnimating).toBe(false);
    expect(result.current.result).not.toBeNull();
    expect(pool).toContain(result.current.result);
  });

  it('reroll uses the latest pool without needing arguments', () => {
    const { result } = renderHook(() => useRandomizer<string>({ durationMs: 200 }));
    const pool = ['valorant', 'overwatch', 'csgo'];

    act(() => {
      result.current.randomize(pool, mulberry32(1));
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    const firstResult = result.current.result;

    act(() => {
      result.current.reroll(mulberry32(2));
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(pool).toContain(result.current.result);
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

  it('resolves immediately in 0ms when prefers-reduced-motion is enabled', () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useRandomizer<string>({ durationMs: 500 }));
    const pool = ['jett', 'omen', 'sage'];

    act(() => {
      result.current.randomize(pool, mulberry32(7));
    });

    expect(result.current.isAnimating).toBe(false);
    expect(pool).toContain(result.current.result);
  });

  it('avoids consecutive duplicate results on interactive reroll when pool has > 1 item', () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useRandomizer<string>());
    const pool = ['a', 'b'];

    act(() => {
      result.current.randomize(pool);
    });
    let prev = result.current.result;
    for (let i = 0; i < 10; i += 1) {
      act(() => {
        result.current.reroll();
      });
      expect(result.current.result).not.toBe(prev);
      prev = result.current.result;
    }
  });

  it('clears pending timers cleanly on unmount during active roll', () => {
    const { result, unmount } = renderHook(() => useRandomizer<string>({ durationMs: 500 }));

    act(() => {
      result.current.randomize(['a', 'b', 'c']);
    });
    expect(result.current.isAnimating).toBe(true);

    expect(() => {
      unmount();
      vi.advanceTimersByTime(1000);
    }).not.toThrow();
  });
});
