import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { localize } from '@/data';
import { useI18n } from '@/lib/i18n';
import type { Agent } from '@/types/valorant';

export interface AgentCardProps {
  agent: Agent;
  highlight?: boolean;
  className?: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  highlight = false,
  className = '',
}) => {
  const { lang } = useI18n();
  const [imgError, setImgError] = useState(false);

  const displayName = localize(agent.displayName, lang);
  const roleName = localize(agent.roleName, lang);
  const imageSrc = !imgError && agent.fullPortrait ? agent.fullPortrait : agent.displayIcon;

  return (
    <Card
      variant={highlight ? 'interactive' : 'elevated'}
      className={`relative overflow-hidden flex flex-col p-4 transition-all duration-300 ${highlight ? 'border-val-red ring-1 ring-val-red shadow-glow' : ''} ${className}`}
      data-testid="agent-card"
    >
      <div className="flex items-center justify-between z-10">
        <Badge variant={agent.role}>{roleName}</Badge>
        <span className="text-xs font-mono text-ink-muted">#{agent.slug}</span>
      </div>

      <div className="relative my-3 h-48 w-full flex items-center justify-center overflow-hidden rounded-lg bg-bg-base/60">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center text-ink-muted font-display text-sm">
            {displayName}
          </div>
        )}
      </div>

      <div className="z-10 mt-auto">
        <h3 className="font-display text-2xl font-bold tracking-wider text-ink uppercase">
          {displayName}
        </h3>

        {agent.abilities.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5 pt-2.5 border-t border-line/60">
            <span className="text-[11px] font-display uppercase tracking-wider text-ink-muted">
              Abilities
            </span>
            <div className="flex items-center gap-2">
              {agent.abilities.map((ability) => {
                const abilityName = localize(ability.displayName, lang);
                return (
                  <div
                    key={ability.slot}
                    className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-[#1E2633] p-1.5 shadow-sm transition-all hover:border-val-teal/60 hover:bg-[#263143]"
                    title={`${ability.slot.toUpperCase()}: ${abilityName}`}
                  >
                    {ability.displayIcon ? (
                      <img
                        src={ability.displayIcon}
                        alt={abilityName}
                        loading="lazy"
                        className="h-full w-full object-contain opacity-95 brightness-110 drop-shadow transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-xs font-bold uppercase text-white/90">
                        {ability.slot[0]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
