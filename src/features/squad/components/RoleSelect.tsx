import React from 'react';
import { useI18n, type TranslationKey } from '@/lib/i18n';
import type { SquadRole } from '@/types/squad';

interface RoleSelectProps {
  id: string;
  value: SquadRole;
  onChange: (role: SquadRole) => void;
  disabled?: boolean;
  label?: string;
}

const SQUAD_ROLE_OPTIONS: readonly SquadRole[] = [
  'flex',
  'duelist',
  'initiator',
  'controller',
  'sentinel',
];

export const RoleSelect: React.FC<RoleSelectProps> = ({
  id,
  value,
  onChange,
  disabled = false,
  label,
}) => {
  const { t } = useI18n();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as SquadRole);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-val-muted">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-label={label ?? t('squad.slot.role')}
        className="rounded-lg border border-val-border bg-val-surface px-3 py-2 text-sm text-val-text transition-colors hover:border-val-red/50 focus:border-val-red focus:outline-none focus:ring-1 focus:ring-val-red disabled:cursor-not-allowed disabled:opacity-50"
      >
        {SQUAD_ROLE_OPTIONS.map((role) => (
          <option key={role} value={role}>
            {t(`role.${role}` as TranslationKey)}
          </option>
        ))}
      </select>
    </div>
  );
};
