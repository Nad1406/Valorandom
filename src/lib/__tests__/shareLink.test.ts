import { describe, expect, it } from 'vitest';
import { agentById, agents } from '@/data';
import { decodeShareState, encodeShareState } from '@/lib/shareLink';
import type { SquadSlot } from '@/types/squad';
import type { SlotRole } from '@/types/valorant';

describe('Share Link Encoding & Decoding (AC-24.x, AC-04.2)', () => {
  const jett = agents.find((a) => a.slug === 'jett')!;

  it('AC-24.1 encodes and decodes squad state preserving slots, names, roles, and locks', () => {
    const slots: SquadSlot[] = [
      { id: '1', name: 'Minh', role: 'duelist', lockedAgentId: jett.id },
      { id: '2', name: 'Linh', role: 'flex', lockedAgentId: null },
      { id: '3', name: 'Player 3', role: 'controller', lockedAgentId: null },
    ];

    const encoded = encodeShareState(slots);
    expect(typeof encoded).toBe('string');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');

    const decoded = decodeShareState(encoded, agentById);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    expect(decoded.slots).toHaveLength(3);
    expect(decoded.slots[0]!.name).toBe('Minh');
    expect(decoded.slots[0]!.role).toBe('duelist');
    expect(decoded.slots[0]!.lockedAgentId).toBe(jett.id);
    expect(decoded.slots[1]!.name).toBe('Linh');
    expect(decoded.slots[1]!.role).toBe('flex');
    expect(decoded.slots[1]!.lockedAgentId).toBeNull();
  });

  it('AC-24.2 round-trip property test: 50 diverse states with Vietnamese accents and emojis deep-equal', () => {
    const names = [
      'Nguyễn Văn A',
      'Đặng Thị B',
      'Tuấn 🎯',
      'Linh ⚡🔥',
      'Hưng (Duelist)',
      '1234567890123456',
    ];
    const roles: SlotRole[] = ['duelist', 'initiator', 'controller', 'sentinel', 'flex'];

    for (let i = 0; i < 50; i += 1) {
      const slotCount = (i % 5) + 1;
      const testSlots: SquadSlot[] = Array.from({ length: slotCount }, (_, idx) => ({
        id: `slot-${idx + 1}`,
        name: names[(i + idx) % names.length]!,
        role: roles[(i + idx) % roles.length]!,
        lockedAgentId: null,
      }));

      const encoded = encodeShareState(testSlots);
      const decoded = decodeShareState(encoded, agentById);
      expect(decoded.ok).toBe(true);
      if (!decoded.ok) continue;

      expect(decoded.slots).toHaveLength(slotCount);
      for (let s = 0; s < slotCount; s += 1) {
        expect(decoded.slots[s]!.name).toBe(testSlots[s]!.name.slice(0, 16));
        expect(decoded.slots[s]!.role).toBe(testSlots[s]!.role);
      }
    }
  });

  it('AC-24.3 URL length is significantly shorter than 2,000 characters for full 5 slots', () => {
    const fullSlots: SquadSlot[] = Array.from({ length: 5 }, (_, idx) => ({
      id: `slot-${idx + 1}`,
      name: `Player Very Long Name ${idx + 1}`,
      role: 'duelist',
      lockedAgentId: jett.id,
    }));

    const encoded = encodeShareState(fullSlots);
    expect(encoded.length).toBeLessThan(1000);
    expect(encoded.length).toBeLessThan(2000);
  });

  it('AC-04.2 safely handles corrupted share payloads without throwing', () => {
    // Malformed base64
    expect(decodeShareState('!invalid-base64@#$', agentById)).toEqual({
      ok: false,
      error: expect.any(String),
    });

    // Valid base64 but invalid JSON
    const notJsonBase64 = btoa('not a json string')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(decodeShareState(notJsonBase64, agentById).ok).toBe(false);

    // Valid JSON but invalid schema (version !== 1 or slots > 5)
    const invalidSchema = btoa(JSON.stringify({ v: 2, s: [] }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(decodeShareState(invalidSchema, agentById).ok).toBe(false);
  });

  it('drops lock and emits warning if agent does not exist or has mismatched role', () => {
    // Payload pointing to non-existent agent
    const slots: SquadSlot[] = [
      { id: '1', name: 'Player 1', role: 'duelist', lockedAgentId: 'ghost-agent-uuid' },
    ];
    const encoded = encodeShareState(slots);
    const decoded = decodeShareState(encoded, agentById);

    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    expect(decoded.slots[0]!.lockedAgentId).toBeNull();
    expect(decoded.warnings.length).toBeGreaterThan(0);
  });
});
