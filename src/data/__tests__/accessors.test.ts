import { describe, expect, it } from 'vitest';
import {
  agentById,
  agents,
  agentsByRole,
  dataMeta,
  localize,
  mapById,
  maps,
  weaponById,
  weapons,
  weaponsByCategory,
} from '@/data';
import { ROLES, WEAPON_CATEGORIES } from '@/types/valorant';

describe('Data Accessors (P1-02)', () => {
  it('exposes frozen collections and metadata', () => {
    expect(agents.length).toBeGreaterThanOrEqual(25);
    expect(maps.length).toBeGreaterThanOrEqual(10);
    expect(weapons.length).toBeGreaterThanOrEqual(18);
    expect(dataMeta.source).toBe('valorant-api.com');
  });

  it('allows fast O(1) lookups by id', () => {
    const firstAgent = agents[0];
    if (!firstAgent) throw new Error('No agents available');
    expect(agentById.get(firstAgent.id)).toEqual(firstAgent);

    const firstMap = maps[0];
    if (!firstMap) throw new Error('No maps available');
    expect(mapById.get(firstMap.id)).toEqual(firstMap);

    const firstWeapon = weapons[0];
    if (!firstWeapon) throw new Error('No weapons available');
    expect(weaponById.get(firstWeapon.id)).toEqual(firstWeapon);
  });

  it('groups agents by role matching total agent count', () => {
    let totalFromRoles = 0;
    for (const role of ROLES) {
      const group = agentsByRole[role];
      expect(Array.isArray(group)).toBe(true);
      expect(group.length).toBeGreaterThan(0);
      for (const a of group) {
        expect(a.role).toBe(role);
      }
      totalFromRoles += group.length;
    }
    expect(totalFromRoles).toBe(agents.length);
  });

  it('groups weapons by category matching total weapon count', () => {
    let totalFromCategories = 0;
    for (const cat of WEAPON_CATEGORIES) {
      const group = weaponsByCategory[cat];
      expect(Array.isArray(group)).toBe(true);
      for (const w of group) {
        expect(w.category).toBe(cat);
      }
      totalFromCategories += group.length;
    }
    expect(totalFromCategories).toBe(weapons.length);
  });

  it('localizes text accurately with English fallback', () => {
    expect(localize({ en: 'Jett', vi: 'Jett' }, 'vi')).toBe('Jett');
    expect(localize({ en: 'Duelist', vi: 'Đối đầu' }, 'vi')).toBe('Đối đầu');
    expect(localize({ en: 'Duelist', vi: 'Đối đầu' }, 'en')).toBe('Duelist');
    expect(localize({ en: 'Only En', vi: '' }, 'vi')).toBe('Only En');
    expect(localize(null, 'vi')).toBe('');
  });
});
