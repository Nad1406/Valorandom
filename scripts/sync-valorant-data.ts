import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { z } from 'zod';
import {
  agentFileSchema,
  apiAgentSchema,
  apiMapSchema,
  apiResponseSchema,
  apiWeaponSchema,
  dataMetaSchema,
  mapFileSchema,
  mapRotationSchema,
  weaponFileSchema,
} from './apiSchemas';
import { buildAgentFile, buildMapFile, buildWeaponFile } from './normalize';
import type { DataMeta } from '../src/types/valorant';

const API_BASE = 'https://valorant-api.com/v1';
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 2;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.resolve(ROOT_DIR, 'src', 'data');
const ROTATION_FILE = path.resolve(__dirname, 'map-rotation.json');

async function fetchWithRetry<T extends z.ZodTypeAny>(
  url: string,
  schema: T,
): Promise<Array<z.infer<T>>> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1)));
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} from ${url}`);
      }
      const rawJson: unknown = await res.json();
      const parsed = apiResponseSchema(schema).parse(rawJson);
      return parsed.data;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${MAX_RETRIES + 1} attempts: ${lastError?.message}`);
}

async function loadActiveSlugs(): Promise<string[]> {
  const content = await fs.readFile(ROTATION_FILE, 'utf-8');
  const parsed = mapRotationSchema.parse(JSON.parse(content));
  return parsed.activeSlugs;
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  const json = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(filePath, json, 'utf-8');
}

async function sync(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const dataVersion = `valorant-api-${today}`;

  console.log(`[sync] Starting Valorant data sync for date ${today}...`);
  await fs.mkdir(DATA_DIR, { recursive: true });

  const activeSlugs = await loadActiveSlugs();

  console.log('[sync] Fetching 6 endpoints in parallel...');
  const [agentsEn, agentsVi, mapsEn, mapsVi, weaponsEn, weaponsVi] = await Promise.all([
    fetchWithRetry(`${API_BASE}/agents?isPlayableCharacter=true&language=en-US`, apiAgentSchema),
    fetchWithRetry(`${API_BASE}/agents?isPlayableCharacter=true&language=vi-VN`, apiAgentSchema),
    fetchWithRetry(`${API_BASE}/maps?language=en-US`, apiMapSchema),
    fetchWithRetry(`${API_BASE}/maps?language=vi-VN`, apiMapSchema),
    fetchWithRetry(`${API_BASE}/weapons?language=en-US`, apiWeaponSchema),
    fetchWithRetry(`${API_BASE}/weapons?language=vi-VN`, apiWeaponSchema),
  ]);

  console.log('[sync] Normalizing and validating data...');
  const agentFile = agentFileSchema.parse(
    buildAgentFile(agentsEn, agentsVi, today, dataVersion),
  );
  const mapFile = mapFileSchema.parse(
    buildMapFile(mapsEn, mapsVi, activeSlugs, today, dataVersion),
  );
  const weaponFile = weaponFileSchema.parse(
    buildWeaponFile(weaponsEn, weaponsVi, today, dataVersion),
  );

  const meta: DataMeta = {
    generatedAt: today,
    dataVersion,
    source: 'valorant-api.com',
    counts: {
      agents: agentFile.items.length,
      maps: mapFile.items.length,
      weapons: weaponFile.items.length,
    },
  };
  dataMetaSchema.parse(meta);

  console.log('[sync] Writing files to src/data/...');
  await Promise.all([
    writeJsonFile(path.join(DATA_DIR, 'agents.json'), agentFile),
    writeJsonFile(path.join(DATA_DIR, 'maps.json'), mapFile),
    writeJsonFile(path.join(DATA_DIR, 'weapons.json'), weaponFile),
    writeJsonFile(path.join(DATA_DIR, 'meta.json'), meta),
  ]);

  console.log(
    `[sync] Success: ${meta.counts.agents} agents, ${meta.counts.maps} maps, ${meta.counts.weapons} weapons saved.`,
  );
}

sync().catch((err: unknown) => {
  console.error('[sync] Sync failed:', err);
  process.exit(1);
});
