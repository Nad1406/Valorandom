import { describe, expect, it } from 'vitest';
import { agents, maps, weapons } from '@/data';
import {
  filterAgents,
  filterMaps,
  filterWeapons,
} from '@/features/random/filters';

describe('Filters Pure Logic (AC-10.2, AC-11.1, AC-12.1, AC-04.1)', () => {
  it('AC-10.2 filters agents strictly by role: 100% of results are duelists', () => {
    const duelists = filterAgents(agents, { role: 'duelist' });
    expect(duelists.length).toBeGreaterThan(0);
    for (const a of duelists) {
      expect(a.role).toBe('duelist');
    }

    const allAgents = filterAgents(agents, { role: 'all' });
    expect(allAgents.length).toBe(agents.length);
  });

  it('AC-11.1 filters maps by active rotation only', () => {
    const activeMaps = filterMaps(maps, { activeOnly: true });
    expect(activeMaps.length).toBeGreaterThan(0);
    for (const m of activeMaps) {
      expect(m.active).toBe(true);
    }

    const allMaps = filterMaps(maps, { activeOnly: false });
    expect(allMaps.length).toBe(maps.length);
  });

  it('AC-12.1 filters weapons across at least 3 distinct category/cost combinations', () => {
    // Combination 1: Rifles only
    const rifles = filterWeapons(weapons, { category: 'rifle' });
    expect(rifles.length).toBeGreaterThan(0);
    for (const w of rifles) {
      expect(w.category).toBe('rifle');
    }

    // Combination 2: Cost between 0 and 1000
    const budget = filterWeapons(weapons, { costMin: 0, costMax: 1000 });
    expect(budget.length).toBeGreaterThan(0);
    for (const w of budget) {
      expect(w.cost).toBeGreaterThanOrEqual(0);
      expect(w.cost).toBeLessThanOrEqual(1000);
    }

    // Combination 3: Sidearms with max cost 500
    const cheapSidearms = filterWeapons(weapons, {
      category: 'sidearm',
      costMax: 500,
    });
    expect(cheapSidearms.length).toBeGreaterThan(0);
    for (const w of cheapSidearms) {
      expect(w.category).toBe('sidearm');
      expect(w.cost).toBeLessThanOrEqual(500);
    }
  });

  it('AC-04.1 returns empty array without throwing when filters yield empty pool', () => {
    // Impossible cost range
    const emptyWeapons = filterWeapons(weapons, {
      costMin: 99999,
      costMax: 100000,
    });
    expect(Array.isArray(emptyWeapons)).toBe(true);
    expect(emptyWeapons).toHaveLength(0);
  });
});
