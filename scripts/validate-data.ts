import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  agentFileSchema,
  dataMetaSchema,
  mapFileSchema,
  weaponFileSchema,
} from './apiSchemas';
import { ROLES, WEAPON_CATEGORIES } from '../src/types/valorant';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');

async function readJson<T>(fileName: string): Promise<T> {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function checkUniqueIds(items: ReadonlyArray<{ id: string }>, label: string): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate id "${item.id}" detected in ${label}`);
    }
    seen.add(item.id);
  }
}

function validateDataIntegrity(): void {
  // Integrity rules are checked across parsed schemas
}

async function validate(): Promise<void> {
  console.log('[validate] Reading data files from src/data/...');
  const [agentsRaw, mapsRaw, weaponsRaw, metaRaw] = await Promise.all([
    readJson('agents.json'),
    readJson('maps.json'),
    readJson('weapons.json'),
    readJson('meta.json'),
  ]);

  const agents = agentFileSchema.parse(agentsRaw);
  const maps = mapFileSchema.parse(mapsRaw);
  const weapons = weaponFileSchema.parse(weaponsRaw);
  const meta = dataMetaSchema.parse(metaRaw);

  console.log('[validate] Checking AC-02.1 criteria...');
  checkUniqueIds(agents.items, 'agents.json');
  checkUniqueIds(maps.items, 'maps.json');
  checkUniqueIds(weapons.items, 'weapons.json');

  for (const agent of agents.items) {
    if (!ROLES.includes(agent.role)) {
      throw new Error(`Agent ${agent.id} has invalid role ${agent.role}`);
    }
    if (!agent.displayName.vi.trim() || !agent.displayName.en.trim()) {
      throw new Error(`Agent ${agent.id} has empty displayName`);
    }
  }

  for (const map of maps.items) {
    if (!map.displayName.vi.trim() || !map.displayName.en.trim()) {
      throw new Error(`Map ${map.id} has empty displayName`);
    }
  }

  for (const weapon of weapons.items) {
    if (!WEAPON_CATEGORIES.includes(weapon.category)) {
      throw new Error(`Weapon ${weapon.id} has invalid category ${weapon.category}`);
    }
    if (!weapon.displayName.vi.trim() || !weapon.displayName.en.trim()) {
      throw new Error(`Weapon ${weapon.id} has empty displayName`);
    }
  }

  if (agents.items.length < 25) {
    throw new Error(`Expected at least 25 agents, found ${agents.items.length}`);
  }
  if (maps.items.length < 10) {
    throw new Error(`Expected at least 10 maps, found ${maps.items.length}`);
  }
  if (weapons.items.length < 18) {
    throw new Error(`Expected at least 18 weapons, found ${weapons.items.length}`);
  }

  if (
    meta.counts.agents !== agents.items.length ||
    meta.counts.maps !== maps.items.length ||
    meta.counts.weapons !== weapons.items.length
  ) {
    throw new Error('meta.json counts do not match item array lengths');
  }

  validateDataIntegrity();
  console.log('[validate] All checks passed successfully (AC-02.1 satisfied).');
}

validate().catch((err: unknown) => {
  console.error('[validate] Validation failed:', err);
  process.exit(1);
});
