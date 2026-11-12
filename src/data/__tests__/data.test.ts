import { describe, expect, it } from 'vitest';
import agentsData from '@/data/agents.json';
import mapsData from '@/data/maps.json';
import metaData from '@/data/meta.json';
import weaponsData from '@/data/weapons.json';
import { ROLES, WEAPON_CATEGORIES } from '@/types/valorant';

describe('Data Integrity (AC-02.1)', () => {
  it('AC-02.1 ensures all agent IDs are unique and roles belong to ROLES enum', () => {
    const ids = new Set<string>();
    expect(agentsData.items.length).toBeGreaterThanOrEqual(25);

    for (const agent of agentsData.items) {
      expect(ids.has(agent.id)).toBe(false);
      ids.add(agent.id);
      expect(ROLES).toContain(agent.role);
      expect(agent.isPlayable).toBe(true);
      expect(agent.displayName.en.trim().length).toBeGreaterThan(0);
      expect(agent.displayName.vi.trim().length).toBeGreaterThan(0);
      expect(agent.roleName.en.trim().length).toBeGreaterThan(0);
      expect(agent.roleName.vi.trim().length).toBeGreaterThan(0);
    }
  });

  it('AC-02.1 ensures all map IDs are unique and active maps are properly flagged', () => {
    const ids = new Set<string>();
    expect(mapsData.items.length).toBeGreaterThanOrEqual(10);

    const activeMaps = mapsData.items.filter((map) => map.active);
    expect(activeMaps.length).toBeGreaterThan(0);

    for (const map of mapsData.items) {
      expect(ids.has(map.id)).toBe(false);
      ids.add(map.id);
      expect(map.displayName.en.trim().length).toBeGreaterThan(0);
      expect(map.displayName.vi.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(map.sites)).toBe(true);
    }
  });

  it('AC-02.1 ensures all weapon IDs are unique and category belongs to WEAPON_CATEGORIES', () => {
    const ids = new Set<string>();
    expect(weaponsData.items.length).toBeGreaterThanOrEqual(18);

    for (const weapon of weaponsData.items) {
      expect(ids.has(weapon.id)).toBe(false);
      ids.add(weapon.id);
      expect(WEAPON_CATEGORIES).toContain(weapon.category);
      expect(weapon.cost).toBeGreaterThanOrEqual(0);
      expect(weapon.displayName.en.trim().length).toBeGreaterThan(0);
      expect(weapon.displayName.vi.trim().length).toBeGreaterThan(0);
    }
  });

  it('AC-02.1 ensures metadata counts match static JSON collections', () => {
    expect(metaData.source).toBe('valorant-api.com');
    expect(metaData.counts.agents).toBe(agentsData.items.length);
    expect(metaData.counts.maps).toBe(mapsData.items.length);
    expect(metaData.counts.weapons).toBe(weaponsData.items.length);
  });
});
