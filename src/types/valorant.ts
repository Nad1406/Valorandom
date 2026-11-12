export const ROLES = ['duelist', 'initiator', 'controller', 'sentinel'] as const;
export type Role = (typeof ROLES)[number];

export type SlotRole = Role | 'flex';

export const SLOT_ROLES = [...ROLES, 'flex'] as const;

export const WEAPON_CATEGORIES = [
  'sidearm',
  'smg',
  'shotgun',
  'rifle',
  'sniper',
  'lmg',
  'melee',
] as const;
export type WeaponCategory = (typeof WEAPON_CATEGORIES)[number];

export type Lang = 'vi' | 'en';

export interface LocalizedText {
  en: string;
  vi: string;
}

export type AbilitySlot = 'ability1' | 'ability2' | 'grenade' | 'ultimate' | 'passive';

export interface AgentAbility {
  slot: AbilitySlot;
  displayName: LocalizedText;
  displayIcon: string;
}

export interface Agent {
  id: string;
  slug: string;
  displayName: LocalizedText;
  role: Role;
  roleName: LocalizedText;
  description: LocalizedText;
  fullPortrait: string;
  displayIcon: string;
  background: string;
  isPlayable: boolean;
  abilities: AgentAbility[];
}

export interface GameMap {
  id: string;
  slug: string;
  displayName: LocalizedText;
  coordinates: string | null;
  sites: string[];
  splash: string;
  listViewIcon: string;
  active: boolean;
}

export interface WeaponStats {
  fireRate: number | null;
  magazineSize: number | null;
  reloadTimeSeconds: number | null;
  damageHead: number | null;
  damageBody: number | null;
}

export interface Weapon {
  id: string;
  slug: string;
  displayName: LocalizedText;
  category: WeaponCategory;
  cost: number;
  displayIcon: string;
  killStreamIcon: string | null;
  stats: WeaponStats;
}

export interface DataMeta {
  generatedAt: string;
  dataVersion: string;
  source: 'valorant-api.com';
  counts: { agents: number; maps: number; weapons: number };
}

export interface DataFile<T> {
  meta: { generatedAt: string; dataVersion: string };
  items: T[];
}

export const ROLE_ICON_LABEL: Record<SlotRole, string> = {
  duelist: 'Duelist',
  initiator: 'Initiator',
  controller: 'Controller',
  sentinel: 'Sentinel',
  flex: 'Flex',
};
