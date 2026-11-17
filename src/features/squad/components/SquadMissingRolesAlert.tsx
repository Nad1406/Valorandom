import React from 'react';
import { useI18n } from '@/lib/i18n';
import type { Role } from '@/types/valorant';

interface SquadMissingRolesAlertProps {
  missingRoles: readonly Role[];
}

/** Warns when the rolled squad lacks one or more core roles (Ft-26). */
export const SquadMissingRolesAlert: React.FC<SquadMissingRolesAlertProps> = ({ missingRoles }) => {
  const { t } = useI18n();
  if (missingRoles.length === 0) return null;

  const roles = missingRoles.map((r) => t(`role.${r}`)).join(', ');
  return (
    <div
      role="status"
      className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-tactical tracking-wider text-amber-300"
    >
      ⚠️ {t('squad.warning.missingRoles', { roles })}
    </div>
  );
};
