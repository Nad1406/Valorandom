import { describe, expect, it } from 'vitest';
import { en } from '@/lib/i18n/en';
import { vi } from '@/lib/i18n/vi';
import type { TranslationKey } from '@/lib/i18n';
import { SquadError } from '../squadRandom';
import { getSquadErrorMessage } from '../squadErrorHelper';

function createTranslator(dict: Record<TranslationKey, string>) {
  return (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = dict[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return text;
  };
}

describe('P3-09 / AC-25.1: Squad Error Localization Mapping', () => {
  const tVi = createTranslator(vi);
  const tEn = createTranslator(en);

  it('maps INVALID_SLOT_COUNT correctly', () => {
    const error = new SquadError('INVALID_SLOT_COUNT', { needed: 6 });
    expect(getSquadErrorMessage(error, tVi)).toBe('Số lượng slot phải từ 1 đến 5');
    expect(getSquadErrorMessage(error, tEn)).toBe('Slot count must be between 1 and 5');
  });

  it('maps INVALID_LOCK correctly', () => {
    const error = new SquadError('INVALID_LOCK', { agentId: 'jett' });
    expect(getSquadErrorMessage(error, tVi)).toBe(
      'Đặc vụ khóa không hợp lệ hoặc bị trùng lặp',
    );
    expect(getSquadErrorMessage(error, tEn)).toBe('Locked agent is invalid or duplicated');
  });

  it('maps INVALID_LOCK_ROLE with agent & role params', () => {
    const error = new SquadError('INVALID_LOCK_ROLE', {
      agentId: 'jett',
      role: 'controller',
    });
    expect(getSquadErrorMessage(error, tVi)).toBe(
      'Đặc vụ jett không thuộc role Controller',
    );
    expect(getSquadErrorMessage(error, tEn)).toBe(
      'Agent jett does not match role Controller',
    );
  });

  it('maps INSUFFICIENT_ROLE with needed, role, available count', () => {
    const error = new SquadError('INSUFFICIENT_ROLE', {
      needed: 10,
      role: 'sentinel',
      availableCount: 5,
    });
    expect(getSquadErrorMessage(error, tVi)).toBe(
      'Cần 10 Sentinel nhưng chỉ có 5 khả dụng',
    );
    expect(getSquadErrorMessage(error, tEn)).toBe(
      'Need 10 Sentinel but only 5 available',
    );
  });

  it('maps EXHAUSTED_POOL correctly', () => {
    const error = new SquadError('EXHAUSTED_POOL');
    expect(getSquadErrorMessage(error, tVi)).toBe(
      'Không còn đủ đặc vụ khả dụng để hoàn tất đội hình',
    );
    expect(getSquadErrorMessage(error, tEn)).toBe(
      'Not enough available agents to complete squad',
    );
  });

  it('maps unknown / non-SquadError fallback cleanly', () => {
    const error = new Error('Random failure');
    expect(getSquadErrorMessage(error, tVi)).toBe('Có lỗi xảy ra khi tạo đội hình');
    expect(getSquadErrorMessage(error, tEn)).toBe(
      'An error occurred while generating the squad',
    );
  });
});
