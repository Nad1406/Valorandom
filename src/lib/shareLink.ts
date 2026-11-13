import { z } from 'zod';
import type { SquadSlot } from '@/types/squad';
import type { Agent, SlotRole } from '@/types/valorant';
import { SLOT_ROLES } from '@/types/valorant';

export const shareSlotSchema = z.object({
  n: z.string().max(16),
  r: z.enum(SLOT_ROLES),
  l: z.string().nullable(),
});

export const sharePayloadSchema = z.object({
  v: z.literal(1),
  s: z.array(shareSlotSchema).min(1).max(5),
});

export type ShareSlot = z.infer<typeof shareSlotSchema>;
export type SharePayload = z.infer<typeof sharePayloadSchema>;

export type DecodeShareResult =
  | { ok: true; slots: SquadSlot[]; warnings: string[] }
  | { ok: false; error: string };

function uint8ToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUint8(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeShareState(slots: readonly SquadSlot[]): string {
  const payload: SharePayload = {
    v: 1,
    s: slots.slice(0, 5).map((slot, idx) => ({
      n: (slot.name.trim() || `Player ${idx + 1}`).slice(0, 16),
      r: slot.role,
      l: slot.lockedAgentId,
    })),
  };
  const json = JSON.stringify(payload);
  const utf8Bytes = new TextEncoder().encode(json);
  return uint8ToBase64Url(utf8Bytes);
}

export function decodeShareState(
  payloadStr: string,
  agentMap: ReadonlyMap<string, Agent>,
): DecodeShareResult {
  try {
    const bytes = base64UrlToUint8(payloadStr);
    const json = new TextDecoder().decode(bytes);
    const rawParsed: unknown = JSON.parse(json);
    const verified = sharePayloadSchema.safeParse(rawParsed);

    if (!verified.success) {
      return { ok: false, error: 'INVALID_PAYLOAD_SCHEMA' };
    }

    const warnings: string[] = [];
    const slots: SquadSlot[] = verified.data.s.map((item, idx) => {
      let lockedAgentId = item.l;
      if (lockedAgentId) {
        const agent = agentMap.get(lockedAgentId);
        if (!agent || (item.r !== 'flex' && agent.role !== item.r)) {
          lockedAgentId = null;
          warnings.push(`LOCK_DROPPED_SLOT_${idx + 1}`);
        }
      }
      return {
        id: `slot-${idx + 1}`,
        name: item.n || `Player ${idx + 1}`,
        role: item.r as SlotRole,
        lockedAgentId,
      };
    });

    return { ok: true, slots, warnings };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'DECODE_FAILED',
    };
  }
}
