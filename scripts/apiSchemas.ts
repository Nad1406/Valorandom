import { z } from 'zod';

/** ---------- Upstream valorant-api.com response schemas (subset we consume) ---------- */

export const apiResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    status: z.number(),
    data: z.array(item),
  });

export const apiLocalizedSchema = z.object({
  'en-US': z.string().nullish(),
  'vi-VN': z.string().nullish(),
});

export const apiAgentSchema = z.object({
  uuid: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().nullish(),
  displayIcon: z.string().nullish(),
  fullPortrait: z.string().nullish(),
  background: z.string().nullish(),
  isPlayableCharacter: z.boolean().nullish(),
  role: z
    .object({
      displayName: z.string().nullish(),
      displayIcon: z.string().nullish(),
    })
    .nullish(),
  abilities: z
    .array(
      z.object({
        slot: z.string().nullish(),
        displayName: z.string().nullish(),
        displayIcon: z.string().nullish(),
      }),
    )
    .nullish(),
});

export const apiMapSchema = z.object({
  uuid: z.string().min(1),
  displayName: z.string().min(1),
  coordinates: z.string().nullish(),
  splash: z.string().nullish(),
  listViewIcon: z.string().nullish(),
  tacticalDescription: z.string().nullish(),
});

export const apiWeaponSchema = z.object({
  uuid: z.string().min(1),
  displayName: z.string().min(1),
  displayIcon: z.string().nullish(),
  killStreamIcon: z.string().nullish(),
  shopData: z
    .object({
      cost: z.number().nullish(),
      category: z.string().nullish(),
      shopOrderPriority: z.number().nullish(),
    })
    .nullish(),
  weaponStats: z
    .object({
      fireRate: z.number().nullish(),
      magazineSize: z.number().nullish(),
      reloadTimeSeconds: z.number().nullish(),
    })
    .nullish(),
  damageRanges: z
    .array(
      z.object({
        headDamage: z.number().nullish(),
        bodyDamage: z.number().nullish(),
      }),
    )
    .nullish(),
});

/** ---------- Committed data file schemas (source of truth for validate + tests) ---------- */

export const localizedTextSchema = z.object({
  en: z.string().min(1),
  vi: z.string().min(1),
});

export const roleSchema = z.enum(['duelist', 'initiator', 'controller', 'sentinel']);

export const weaponCategorySchema = z.enum([
  'sidearm',
  'smg',
  'shotgun',
  'rifle',
  'sniper',
  'lmg',
  'melee',
]);

export const abilitySlotSchema = z.enum(['ability1', 'ability2', 'grenade', 'ultimate', 'passive']);

export const agentFileSchema = z.object({
  meta: z.object({ generatedAt: z.string(), dataVersion: z.string() }),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        slug: z.string().min(1),
        displayName: localizedTextSchema,
        role: roleSchema,
        roleName: localizedTextSchema,
        description: localizedTextSchema,
        fullPortrait: z.string(),
        displayIcon: z.string(),
        background: z.string(),
        isPlayable: z.literal(true),
        abilities: z.array(
          z.object({
            slot: abilitySlotSchema,
            displayName: localizedTextSchema,
            displayIcon: z.string(),
          }),
        ),
      }),
    )
    .min(1),
});

export const mapFileSchema = z.object({
  meta: z.object({ generatedAt: z.string(), dataVersion: z.string() }),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        slug: z.string().min(1),
        displayName: localizedTextSchema,
        coordinates: z.string().nullable(),
        sites: z.array(z.string()),
        splash: z.string(),
        listViewIcon: z.string(),
        active: z.boolean(),
      }),
    )
    .min(1),
});

export const weaponFileSchema = z.object({
  meta: z.object({ generatedAt: z.string(), dataVersion: z.string() }),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        slug: z.string().min(1),
        displayName: localizedTextSchema,
        category: weaponCategorySchema,
        cost: z.number().min(0),
        displayIcon: z.string(),
        killStreamIcon: z.string().nullable(),
        stats: z.object({
          fireRate: z.number().nullable(),
          magazineSize: z.number().nullable(),
          reloadTimeSeconds: z.number().nullable(),
          damageHead: z.number().nullable(),
          damageBody: z.number().nullable(),
        }),
      }),
    )
    .min(1),
});

export const mapRotationSchema = z.object({
  activeSlugs: z.array(z.string().min(1)),
});

export type ApiAgent = z.infer<typeof apiAgentSchema>;
export type ApiMap = z.infer<typeof apiMapSchema>;
export type ApiWeapon = z.infer<typeof apiWeaponSchema>;
export type CommittedAgentFile = z.infer<typeof agentFileSchema>;
export type CommittedMapFile = z.infer<typeof mapFileSchema>;
export type CommittedWeaponFile = z.infer<typeof weaponFileSchema>;
