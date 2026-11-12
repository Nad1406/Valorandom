import { describe, expect, it } from 'vitest';
import { createDefaultRng, mulberry32, pick, shuffle } from '@/features/random/rng';

describe('RNG Engine (P2-01, AC-13.2)', () => {
  it('AC-13.2 ensures Mulberry32 produces deterministic sequences with identical seed', () => {
    const seed = 1337;
    const rng1 = mulberry32(seed);
    const rng2 = mulberry32(seed);

    const seq1 = Array.from({ length: 100 }, () => rng1());
    const seq2 = Array.from({ length: 100 }, () => rng2());

    expect(seq1).toEqual(seq2);
    for (const val of seq1) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(999);

    const val1 = rng1();
    const val2 = rng2();
    expect(val1).not.toBe(val2);
  });

  it('default RNG produces numbers strictly within [0, 1)', () => {
    const defaultRng = createDefaultRng();
    for (let i = 0; i < 50; i += 1) {
      const val = defaultRng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it('shuffle does not mutate original array and preserves all elements', () => {
    const original = ['jett', 'raze', 'reyna', 'sova', 'omen'];
    const rng = mulberry32(12345);

    const shuffled = shuffle(original, rng);

    expect(original).toEqual(['jett', 'raze', 'reyna', 'sova', 'omen']);
    expect(shuffled).toHaveLength(original.length);
    expect(new Set(shuffled)).toEqual(new Set(original));
  });

  it('pick returns null on empty array and an element from array otherwise', () => {
    const rng = mulberry32(54321);
    expect(pick([], rng)).toBeNull();

    const items = ['ascent', 'bind', 'haven', 'split'];
    const chosen = pick(items, rng);
    expect(chosen).not.toBeNull();
    expect(items).toContain(chosen);
  });
});
