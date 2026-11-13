import { describe, expect, it } from 'vitest';
import { agents, maps, weapons } from '@/data';
import { filterAgents } from '@/features/random/filters';
import { mulberry32 } from '@/features/random/rng';
import {
  randomAgent,
  randomCombo,
  randomMap,
  randomWeapon,
} from '@/features/random/singleRandom';

describe('Single Random Pure Engine (AC-10.1, AC-10.3, AC-13.2, Ft-14)', () => {
  it('AC-10.1 returns exactly 1 item belonging to filtered pool', () => {
    const duelists = filterAgents(agents, { role: 'duelist' });
    const rng = mulberry32(111);

    const result = randomAgent(duelists, rng);
    expect(result).not.toBeNull();
    expect(duelists).toContainEqual(result);
    expect(result?.role).toBe('duelist');

    const weaponResult = randomWeapon(weapons, rng);
    expect(weaponResult).not.toBeNull();
    expect(weapons).toContainEqual(weaponResult);
  });

  it('AC-10.3 produces deterministic result chain with identical seed, and variance with different seeds', () => {
    const pool = agents.slice(0, 10);

    // Identical seeds yield identical result chain
    const chain1 = Array.from({ length: 20 }, () => randomAgent(pool, mulberry32(777)));
    const chain2 = Array.from({ length: 20 }, () => randomAgent(pool, mulberry32(777)));
    expect(chain1).toEqual(chain2);

    // Variance test: different seeds across 20 iterations produce at least 2 distinct items
    const distinctSet = new Set(
      Array.from({ length: 20 }, (_, idx) => randomAgent(pool, mulberry32(idx * 13 + 1))?.id),
    );
    expect(distinctSet.size).toBeGreaterThanOrEqual(2);
  });

  it('AC-13.2 supports deterministic re-roll sequences with Mulberry32', () => {
    const rng = mulberry32(2026);
    const rerolls1 = [
      randomMap(maps, rng)?.id,
      randomMap(maps, rng)?.id,
      randomMap(maps, rng)?.id,
    ];

    const replayRng = mulberry32(2026);
    const rerolls2 = [
      randomMap(maps, replayRng)?.id,
      randomMap(maps, replayRng)?.id,
      randomMap(maps, replayRng)?.id,
    ];

    expect(rerolls1).toEqual(rerolls2);
  });

  it('Ft-14 randomCombo draws 1 agent, 1 map, and 1 weapon simultaneously', () => {
    const rng = mulberry32(999);
    const combo = randomCombo(agents, maps, weapons, rng);

    expect(combo.agent).not.toBeNull();
    expect(combo.map).not.toBeNull();
    expect(combo.weapon).not.toBeNull();
    expect(agents).toContainEqual(combo.agent);
    expect(maps).toContainEqual(combo.map);
    expect(weapons).toContainEqual(combo.weapon);
  });

  it('Phase 3.5: randomizes strictly from customized selectedIds pool and returns null when empty', () => {
    const rng = mulberry32(12345);
    const chosenTwo = [agents[0]!, agents[1]!];
    const filtered = filterAgents(agents, {
      selectedIds: chosenTwo.map((a) => a.id),
    });

    const result = randomAgent(filtered, rng);
    expect(result).not.toBeNull();
    expect(chosenTwo.map((a) => a.id)).toContain(result?.id);

    const emptyResult = randomAgent([], rng);
    expect(emptyResult).toBeNull();
  });
});
