import React from 'react';
import { localize } from '@/data';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useI18n } from '@/lib/i18n';
import type { SquadResult, SquadSlot } from '@/types/squad';
import type { Agent, SlotRole } from '@/types/valorant';

interface SquadResultTableProps {
  result: SquadResult;
  slots: readonly SquadSlot[];
}

const ROLE_COLORS: Record<string, string> = {
  duelist: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  initiator: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  controller: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  sentinel: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
};

export const SquadResultTable: React.FC<SquadResultTableProps> = ({
  result,
  slots,
}) => {
  const { lang, t } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const missingRoles = result.warnings
    .filter((w) => w.code === 'TEAM_MISSING_ROLE' && w.role)
    .map((w) => w.role as SlotRole);

  const missingRoleNames = missingRoles
    .map((r) => t(`role.${r}`))
    .join(', ');

  return (
    <div className="flex flex-col gap-4">
      {missingRoles.length > 0 && (
        <div
          role="status"
          className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-sm text-amber-300"
        >
          ⚠️ {t('squad.warning.missingRoles', { roles: missingRoleNames })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {slots.map((slot, idx) => {
          const agent = result.bySlot[slot.id];
          if (!agent) return null;

          const delayStyle = prefersReducedMotion
            ? undefined
            : { animationDelay: `${idx * 60}ms` };

          return (
            <SquadResultCard
              key={slot.id}
              slot={slot}
              agent={agent}
              index={idx}
              lang={lang}
              style={delayStyle}
            />
          );
        })}
      </div>
    </div>
  );
};

interface SquadResultCardProps {
  slot: SquadSlot;
  agent: Agent;
  index: number;
  lang: 'vi' | 'en';
  style?: React.CSSProperties;
}

const SquadResultCard: React.FC<SquadResultCardProps> = ({
  slot,
  agent,
  index,
  lang,
  style,
}) => {
  const { t } = useI18n();
  const agentName = localize(agent.displayName, lang);
  const colorClass = ROLE_COLORS[agent.role] ?? 'bg-val-border text-val-text';
  const isLocked = Boolean(slot.lockedAgentId);

  return (
    <div
      style={style}
      className="flex flex-col justify-between overflow-hidden rounded-xl border border-val-border bg-val-surface p-4 transition-all animate-fadeIn hover:border-val-text/30"
    >
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-val-border/60 pb-2">
          <div className="truncate font-semibold text-val-text">
            {slot.name || t('squad.slot.defaultName', { n: index + 1 })}
          </div>
          {isLocked && (
            <span
              title={t('squad.slot.lock')}
              className="rounded bg-val-red/20 px-1.5 py-0.5 text-[10px] font-bold text-val-red"
            >
              🔒 LOCKED
            </span>
          )}
        </div>

        <div className="relative my-3 flex justify-center">
          <img
            src={agent.displayIcon}
            alt={agentName}
            className="h-20 w-20 rounded-lg object-cover ring-2 ring-val-border"
          />
        </div>

        <div className="text-center font-bold text-val-text">{agentName}</div>
      </div>

      <div className="mt-3 flex flex-col gap-1 border-t border-val-border/60 pt-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-val-muted">{t('squad.assignedRole')}:</span>
          <span
            className={`rounded border px-2 py-0.5 font-medium capitalize ${colorClass}`}
          >
            {t(`role.${agent.role}`)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-val-muted">
          <span>{t('squad.slot.role')}:</span>
          <span>{t(`role.${slot.role}`)}</span>
        </div>
      </div>
    </div>
  );
};
