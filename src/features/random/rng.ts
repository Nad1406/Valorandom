export type Rng = () => number;

/**
 * Mulberry32 is a simple, high-quality 32-bit PRNG.
 * Given the same seed, it produces the exact same sequence of numbers in [0, 1).
 */
export function mulberry32(seed: number): Rng {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Default non-deterministic RNG using Web Crypto API when available,
 * falling back to Math.random() for environments without crypto.
 */
export function createDefaultRng(): Rng {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const buffer = new Uint32Array(1);
    return () => {
      crypto.getRandomValues(buffer);
      const val = buffer[0];
      return (val !== undefined ? val : 0) / 4294967296;
    };
  }
  return () => Math.random();
}

/**
 * Fisher-Yates immutable shuffle algorithm using injected Rng.
 */
export function shuffle<T>(array: readonly T[], rng: Rng): T[] {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const temp = result[i];
    const target = result[j];
    if (temp !== undefined && target !== undefined) {
      result[i] = target;
      result[j] = temp;
    }
  }
  return result;
}

/**
 * Pick a random element from a readonly array using injected Rng.
 * Returns null if the array is empty.
 */
export function pick<T>(array: readonly T[], rng: Rng): T | null {
  if (array.length === 0) return null;
  const index = Math.floor(rng() * array.length);
  return array[index] ?? null;
}
