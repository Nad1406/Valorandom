import React from 'react';
import { AlertTriangle } from 'lucide-react';
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
      className="flex items-center gap-2 rounded-sm border border-val-gold/50 bg-val-gold/10 p-3 font-tactical text-sm tracking-wider text-val-gold"
    >
      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{t('squad.warning.missingRoles', { roles })}</span>
    </div>
  );
};
