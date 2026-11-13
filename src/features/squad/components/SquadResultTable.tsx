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
          className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-sm font-tactical tracking-wider text-amber-300"
        >
          ⚠️ {t('squad.warning.missingRoles', { roles: missingRoleNames })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {slots.map((slot, idx) => {
          const agent = result.bySlot[slot.id];
          if (!agent) return null;

          const delayStyle = prefersReducedMotion
            ? undefined
            : { animationDelay: `${idx * 80}ms` };

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
  const colorClass = ROLE_COLORS[agent.role] ?? 'bg-white/10 text-white border-white/20';
  const isLocked = Boolean(slot.lockedAgentId);

  return (
    <div
      style={style}
      className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-[#121C26] p-4 transition-all duration-300 animate-fade-up hover:border-val-red/60 shadow-tactical clip-corner-tl"
    >
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="truncate font-tactical text-sm font-bold tracking-wider text-val-offwhite uppercase">
            {slot.name || t('squad.slot.defaultName', { n: index + 1 })}
          </div>
          {isLocked && (
            <span
              title={t('squad.slot.lock')}
              className="rounded bg-val-red/20 px-1.5 py-0.5 font-tactical text-[10px] font-bold tracking-widest text-val-red border border-val-red/40"
            >
              🔒 LOCKED
            </span>
          )}
        </div>

        <div className="relative my-3 flex justify-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-val-teal/60 shadow-glow-teal bg-[#18222D]">
            <img
              src={agent.fullPortrait || agent.displayIcon}
              alt={agentName}
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        <div className="text-center font-display text-2xl font-black uppercase tracking-wider text-val-offwhite">
          {agentName}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-white/10 pt-2.5 text-xs font-tactical">
        <div className="flex items-center justify-between">
          <span className="text-white/50 tracking-wider uppercase">{t('squad.assignedRole')}:</span>
          <span
            className={`rounded border px-2 py-0.5 font-bold uppercase tracking-wider ${colorClass}`}
          >
            {t(`role.${agent.role}`)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/40">
          <span className="tracking-wider uppercase">{t('squad.slot.role')}:</span>
          <span className="uppercase font-bold text-white/70">{t(`role.${slot.role}`)}</span>
        </div>
      </div>
    </div>
  );
};
