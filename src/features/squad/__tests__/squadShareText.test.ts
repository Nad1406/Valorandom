import { describe, expect, it } from 'vitest';
import { formatSquadShareText } from '../squadShareText';
import type { SquadResult, SquadSlot } from '@/types/squad';
import type { Agent } from '@/types/valorant';

describe('formatSquadShareText', () => {
  const dummySlots: SquadSlot[] = [
    { id: 'slot-1', name: 'Ace', role: 'duelist', lockedAgentId: 'jett-uuid' },
    { id: 'slot-2', name: '', role: 'flex', lockedAgentId: null },
  ];

  const mockAgentJett: Agent = {
    id: 'jett-uuid',
    slug: 'jett',
    displayName: { en: 'Jett', vi: 'Jett' },
    role: 'duelist',
    roleName: { en: 'Duelist', vi: 'Đối Đầu' },
    description: { en: '', vi: '' },
    fullPortrait: '',
    displayIcon: '',
    background: '',
    isPlayable: true,
    abilities: [],
  };

  const mockAgentOmen: Agent = {
    id: 'omen-uuid',
    slug: 'omen',
    displayName: { en: 'Omen', vi: 'Omen' },
    role: 'controller',
    roleName: { en: 'Controller', vi: 'Kiểm Soát' },
    description: { en: '', vi: '' },
    fullPortrait: '',
    displayIcon: '',
    background: '',
    isPlayable: true,
    abilities: [],
  };

  it('formats squad configuration without url when result is null', () => {
    const text = formatSquadShareText({
      slots: dummySlots,
      result: null,
      lang: 'vi',
    });

    expect(text).toContain('VALORANDOM');
    expect(text).toContain('1. Ace — Role: duelist');
    expect(text).toContain('2. Người chơi 2 — Role: flex');
    expect(text).not.toContain('http');
    expect(text).not.toContain('🔗');
  });

  it('formats randomized squad result with assigned agents and no url', () => {
    const result: SquadResult = {
      bySlot: {
        'slot-1': mockAgentJett,
        'slot-2': mockAgentOmen,
      },
      order: ['slot-1', 'slot-2'],
      warnings: [],
    };

    const text = formatSquadShareText({
      slots: dummySlots,
      result,
      lang: 'vi',
    });

    expect(text).toContain('VALORANDOM — Đội hình 5 người');
    expect(text).toContain('1. Ace ➔ Jett (Đối Đầu) 🔒');
    expect(text).toContain('2. Người chơi 2 ➔ Omen (Kiểm Soát)');
    expect(text).not.toContain('http');
    expect(text).not.toContain('🔗');
  });
});
