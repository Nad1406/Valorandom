import type {
  Agent,
  DataMeta,
  GameMap,
  Lang,
  LocalizedText,
  Role,
  Weapon,
  WeaponCategory,
} from '@/types/valorant';
import agentsFile from './agents.json';
import mapsFile from './maps.json';
import metaFile from './meta.json';
import weaponsFile from './weapons.json';

export const dataMeta: DataMeta = Object.freeze(metaFile as DataMeta);

export const agents: readonly Agent[] = Object.freeze(
  (agentsFile.items as Agent[]).slice(),
);

export const maps: readonly GameMap[] = Object.freeze(
  (mapsFile.items as GameMap[]).slice(),
);

export const weapons: readonly Weapon[] = Object.freeze(
  (weaponsFile.items as Weapon[]).slice(),
);

export const agentById: ReadonlyMap<string, Agent> = new Map(
  agents.map((agent) => [agent.id, agent]),
);

export const mapById: ReadonlyMap<string, GameMap> = new Map(
  maps.map((map) => [map.id, map]),
);

export const weaponById: ReadonlyMap<string, Weapon> = new Map(
  weapons.map((weapon) => [weapon.id, weapon]),
);

const initialRolesRecord = (): Record<Role, Agent[]> => ({
  duelist: [],
  initiator: [],
  controller: [],
  sentinel: [],
});

const groupedRoles = agents.reduce<Record<Role, Agent[]>>((acc, agent) => {
  acc[agent.role].push(agent);
  return acc;
}, initialRolesRecord());

export const agentsByRole: Readonly<Record<Role, readonly Agent[]>> = Object.freeze({
  duelist: Object.freeze(groupedRoles.duelist),
  initiator: Object.freeze(groupedRoles.initiator),
  controller: Object.freeze(groupedRoles.controller),
  sentinel: Object.freeze(groupedRoles.sentinel),
});

const initialCategoriesRecord = (): Record<WeaponCategory, Weapon[]> => ({
  sidearm: [],
  smg: [],
  shotgun: [],
  rifle: [],
  sniper: [],
  lmg: [],
  melee: [],
});

const groupedWeapons = weapons.reduce<Record<WeaponCategory, Weapon[]>>((acc, weapon) => {
  acc[weapon.category].push(weapon);
  return acc;
}, initialCategoriesRecord());

export const weaponsByCategory: Readonly<Record<WeaponCategory, readonly Weapon[]>> =
  Object.freeze({
    sidearm: Object.freeze(groupedWeapons.sidearm),
    smg: Object.freeze(groupedWeapons.smg),
    shotgun: Object.freeze(groupedWeapons.shotgun),
    rifle: Object.freeze(groupedWeapons.rifle),
    sniper: Object.freeze(groupedWeapons.sniper),
    lmg: Object.freeze(groupedWeapons.lmg),
    melee: Object.freeze(groupedWeapons.melee),
  });

export function localize(text: LocalizedText | null | undefined, lang: Lang): string {
  if (!text) return '';
  const chosen = text[lang]?.trim();
  if (chosen && chosen.length > 0) return chosen;
  return text.en?.trim() ?? '';
}
