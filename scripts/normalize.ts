import type { ApiAgent, ApiMap, ApiWeapon } from './apiSchemas';
import type {
  AbilitySlot,
  Agent,
  AgentAbility,
  GameMap,
  LocalizedText,
  Role,
  Weapon,
  WeaponCategory,
} from '../src/types/valorant';

const ROLE_BY_LABEL: Record<string, Role> = {
  duelist: 'duelist',
  initiator: 'initiator',
  controller: 'controller',
  sentinel: 'sentinel',
};

const CATEGORY_BY_KEY: Record<string, WeaponCategory> = {
  sidearm: 'sidearm', pistols: 'sidearm',
  smg: 'smg', smgs: 'smg',
  shotgun: 'shotgun', shotguns: 'shotgun',
  rifle: 'rifle', rifles: 'rifle',
  sniper: 'sniper', 'sniper-rifles': 'sniper',
  lmg: 'lmg', 'heavy-weapons': 'lmg',
  melee: 'melee',
};

const CATEGORY_BY_SLUG: Record<string, WeaponCategory> = {
  classic: 'sidearm', shorty: 'sidearm', frenzy: 'sidearm',
  ghost: 'sidearm', sheriff: 'sidearm', bandit: 'sidearm',
  stinger: 'smg', spectre: 'smg',
  bucky: 'shotgun', judge: 'shotgun',
  bulldog: 'rifle', guardian: 'rifle', phantom: 'rifle', vandal: 'rifle', warden: 'rifle',
  marshal: 'sniper', outlaw: 'sniper', operator: 'sniper',
  ares: 'lmg', odin: 'lmg', melee: 'melee',
};

const ABILITY_SLOTS: Record<string, AbilitySlot> = {
  ability1: 'ability1', ability2: 'ability2',
  grenade: 'grenade', ultimate: 'ultimate', passive: 'passive',
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function pickText(primary: string | null | undefined, fallback: string): string {
  const value = primary?.trim();
  return value && value.length > 0 ? value : fallback;
}

function localized(en: string, vi: string | null | undefined): LocalizedText {
  return { en, vi: pickText(vi, en) };
}

export function normalizeRole(roleLabel: string | null | undefined): Role {
  const key = slugify(pickText(roleLabel, ''));
  const role = ROLE_BY_LABEL[key];
  if (!role) {
    throw new Error(`Unknown agent role "${roleLabel ?? ''}" — update normalizeRole().`);
  }
  return role;
}

export function normalizeWeaponCategory(
  shopCategory: string | null | undefined,
  slug: string,
): WeaponCategory {
  if (shopCategory) {
    const rawKey = slugify(shopCategory.split('::').pop() ?? '');
    const matched = CATEGORY_BY_KEY[rawKey];
    if (matched) return matched;
  }
  const fallback = CATEGORY_BY_SLUG[slug];
  if (!fallback) {
    throw new Error(`Unknown weapon category for "${slug}" — update CATEGORY_BY_SLUG.`);
  }
  return fallback;
}

function normalizeAbilities(agent: ApiAgent): AgentAbility[] {
  return (agent.abilities ?? [])
    .map((ability) => {
      const slot = ABILITY_SLOTS[slugify(ability.slot ?? '')];
      const name = ability.displayName?.trim();
      if (!slot || !name) return null;
      return {
        slot,
        displayName: { en: name, vi: name },
        displayIcon: ability.displayIcon ?? '',
      } satisfies AgentAbility;
    })
    .filter((ability): ability is AgentAbility => ability !== null);
}

export function normalizeAgent(agent: ApiAgent, viAgent: ApiAgent | undefined): Agent {
  const role = normalizeRole(agent.role?.displayName);
  const viRoleLabel = viAgent?.role?.displayName ?? agent.role?.displayName ?? '';
  return {
    id: agent.uuid,
    slug: slugify(agent.displayName),
    displayName: localized(agent.displayName, viAgent?.displayName),
    role,
    roleName: localized(agent.role?.displayName ?? role, viRoleLabel),
    description: localized(agent.description ?? '', viAgent?.description),
    fullPortrait: agent.fullPortrait ?? '',
    displayIcon: agent.displayIcon ?? '',
    background: agent.background ?? '',
    isPlayable: true,
    abilities: normalizeAbilities(agent),
  };
}

const SITE_PATTERN = /\b([ABC])\s*(?:Site|site)\b/g;

export function parseSites(tacticalDescription: string | null | undefined): string[] {
  if (!tacticalDescription) return [];
  const found = new Set<string>();
  for (const match of tacticalDescription.matchAll(SITE_PATTERN)) {
    if (match[1]) found.add(match[1]);
  }
  if (found.size === 0) {
    for (const match of tacticalDescription.matchAll(/\b([ABC])\b/g)) {
      if (match[1]) found.add(match[1]);
    }
  }
  return [...found].sort();
}

export function normalizeMap(
  map: ApiMap,
  viMap: ApiMap | undefined,
  activeSlugs: readonly string[],
): GameMap {
  const slug = slugify(map.displayName);
  return {
    id: map.uuid,
    slug,
    displayName: localized(map.displayName, viMap?.displayName),
    coordinates: map.coordinates ?? null,
    sites: parseSites(map.tacticalDescription),
    splash: map.splash ?? '',
    listViewIcon: map.listViewIcon ?? '',
    active: activeSlugs.includes(slug),
  };
}

function normalizeWeaponName(name: string): string {
  return name.replace(/^EEquippableCategory::/, '');
}

export function normalizeWeapon(weapon: ApiWeapon, viWeapon: ApiWeapon | undefined): Weapon {
  const slug = slugify(normalizeWeaponName(weapon.displayName));
  const category = normalizeWeaponCategory(weapon.shopData?.category, slug);
  const firstRange = weapon.damageRanges?.[0];
  const stats = weapon.weaponStats;
  const cost = category === 'melee' ? 0 : Math.max(0, weapon.shopData?.cost ?? 0);
  return {
    id: weapon.uuid,
    slug,
    displayName: localized(
      normalizeWeaponName(weapon.displayName),
      viWeapon ? normalizeWeaponName(viWeapon.displayName) : undefined,
    ),
    category,
    cost,
    displayIcon: weapon.displayIcon ?? '',
    killStreamIcon: weapon.killStreamIcon ?? null,
    stats: {
      fireRate: stats?.fireRate ?? null,
      magazineSize: stats?.magazineSize ?? null,
      reloadTimeSeconds: stats?.reloadTimeSeconds ?? null,
      damageHead: firstRange?.headDamage ?? null,
      damageBody: firstRange?.bodyDamage ?? null,
    },
  };
}

function bySlugAndId(a: { id: string; slug: string }, b: { id: string; slug: string }): number {
  return a.slug.localeCompare(b.slug, 'en') || a.id.localeCompare(b.id, 'en');
}

export function buildAgentFile(
  en: ApiAgent[],
  vi: ApiAgent[],
  generatedAt: string,
  dataVersion: string,
) {
  const viById = new Map(vi.map((item) => [item.uuid, item]));
  const items = en
    .filter((agent) => agent.isPlayableCharacter !== false)
    .map((agent) => normalizeAgent(agent, viById.get(agent.uuid)))
    .sort(bySlugAndId);
  return { meta: { generatedAt, dataVersion }, items };
}

export const STANDARD_5V5_MAP_SLUGS: ReadonlySet<string> = new Set([
  'abyss', 'ascent', 'bind', 'breeze', 'corrode', 'fracture',
  'haven', 'icebox', 'lotus', 'pearl', 'split', 'summit', 'sunset',
]);

export function buildMapFile(
  en: ApiMap[],
  vi: ApiMap[],
  activeSlugs: readonly string[],
  generatedAt: string,
  dataVersion: string,
) {
  const viById = new Map(vi.map((item) => [item.uuid, item]));
  const items = en
    .filter((map) => {
      if (!map.displayName?.trim()) return false;
      const slug = slugify(map.displayName);
      return STANDARD_5V5_MAP_SLUGS.has(slug);
    })
    .map((map) => normalizeMap(map, viById.get(map.uuid), activeSlugs))
    .sort(bySlugAndId);
  return { meta: { generatedAt, dataVersion }, items };
}

export function buildWeaponFile(
  en: ApiWeapon[],
  vi: ApiWeapon[],
  generatedAt: string,
  dataVersion: string,
) {
  const viById = new Map(vi.map((item) => [item.uuid, item]));
  const items = en
    .map((weapon) => normalizeWeapon(weapon, viById.get(weapon.uuid)))
    .filter((weapon) => weapon.slug.length > 0)
    .sort(bySlugAndId);
  return { meta: { generatedAt, dataVersion }, items };
}
