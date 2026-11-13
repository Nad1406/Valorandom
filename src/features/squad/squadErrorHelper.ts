import type { TranslationKey } from '@/lib/i18n';
import { SquadError } from './squadRandom';

export function getSquadErrorMessage(
  error: unknown,
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
): string {
  if (!(error instanceof SquadError)) {
    return t('squad.error.unknown');
  }

  const details = error.details;

  switch (error.code) {
    case 'INVALID_SLOT_COUNT':
      return t('squad.error.invalidSlotCount');

    case 'INVALID_LOCK':
      return t('squad.error.invalidLock');

    case 'INVALID_LOCK_ROLE': {
      const roleStr = details?.role ? t(`role.${details.role}` as TranslationKey) : '';
      return t('squad.error.invalidLockRole', {
        agent: details?.agentId ?? '',
        role: roleStr,
      });
    }

    case 'INSUFFICIENT_ROLE': {
      const roleStr = details?.role ? t(`role.${details.role}` as TranslationKey) : '';
      return t('squad.error.insufficientRole', {
        needed: details?.needed ?? 0,
        role: roleStr,
        count: details?.availableCount ?? 0,
      });
    }

    case 'EXHAUSTED_POOL':
      return t('squad.error.exhaustedPool');

    default:
      return t('squad.error.unknown');
  }
}
