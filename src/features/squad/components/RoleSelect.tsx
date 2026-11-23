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
        <label htmlFor={id} className="text-xs font-tactical font-bold tracking-wider uppercase text-ink-muted">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-label={label ?? t('squad.slot.role')}
        className="w-full rounded-sm border border-white/15 bg-bg-base px-3 py-1.5 font-tactical text-sm font-semibold uppercase tracking-wider text-val-offwhite transition-colors hover:border-val-red/60 focus:border-val-red focus:outline-none focus:ring-1 focus:ring-val-red disabled:cursor-not-allowed disabled:opacity-45"
      >
        {SQUAD_ROLE_OPTIONS.map((role) => (
          <option key={role} value={role} className="bg-bg-elevated text-val-offwhite">
            {t(`role.${role}` as TranslationKey)}
          </option>
        ))}
      </select>
    </div>
  );
};
