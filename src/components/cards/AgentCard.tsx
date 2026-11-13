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
  const [selectedAbilitySlot, setSelectedAbilitySlot] = useState<string | null>(null);

  const displayName = localize(agent.displayName, lang);
  const roleName = localize(agent.roleName, lang);
  const description = localize(agent.description, lang);
  const imageSrc = !imgError && agent.fullPortrait ? agent.fullPortrait : agent.displayIcon;

  const activeAbility = agent.abilities.find((a) => a.slot === selectedAbilitySlot);

  return (
    <Card
      variant={highlight ? 'interactive' : 'elevated'}
      className={`relative overflow-hidden flex flex-col p-5 transition-all duration-300 clip-corner-tl border-white/15 bg-[#0F1923]/90 ${
        highlight ? 'border-val-red ring-1 ring-val-red shadow-glow' : ''
      } ${className}`}
      data-testid="agent-card"
    >
      {/* Huge Background Watermark Name */}
      <div
        aria-hidden="true"
        data-watermark={displayName}
        className="val-watermark pointer-events-none absolute -right-4 -top-8 select-none font-display text-8xl sm:text-9xl font-black uppercase text-white/[0.04] leading-none"
      />

      {/* Header Info */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Badge variant={agent.role}>{roleName}</Badge>
          <span className="font-mono text-xs text-white/40">// #{agent.slug.toUpperCase()}</span>
        </div>
        <span className="font-tactical text-xs font-bold tracking-widest text-val-teal uppercase">
          INITIATED
        </span>
      </div>

      {/* Main Agent Portrait Stage */}
      <div className="relative my-4 h-64 sm:h-72 w-full flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white/[0.03] to-black/40">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center text-ink-muted font-display text-lg">
            {displayName}
          </div>
        )}
      </div>

      {/* Agent Name & Bio */}
      <div className="z-10 mt-auto">
        <h3 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-val-offwhite uppercase">
          {displayName}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-white/60 line-clamp-2 font-sans leading-relaxed">
            {description}
          </p>
        )}

        {/* Interactive Abilities */}
        {agent.abilities.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-tactical font-bold uppercase tracking-widest text-white/50">
                // ABILITIES ({agent.abilities.length})
              </span>
              {activeAbility && (
                <span className="text-[11px] font-tactical font-bold uppercase tracking-wider text-val-teal">
                  {localize(activeAbility.displayName, lang)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {agent.abilities.map((ability) => {
                const abilityName = localize(ability.displayName, lang);
                const isSelected = selectedAbilitySlot === ability.slot;
                return (
                  <button
                    key={ability.slot}
                    type="button"
                    onClick={() =>
                      setSelectedAbilitySlot(isSelected ? null : ability.slot)
                    }
                    className={`relative flex h-10 w-10 items-center justify-center rounded-lg border p-1.5 transition-all ${
                      isSelected
                        ? 'border-val-teal bg-[#1E2633] ring-1 ring-val-teal shadow-glow-teal scale-105'
                        : 'border-white/15 bg-[#18222D] hover:border-val-teal/60 hover:bg-[#1E2633]'
                    }`}
                    title={`${ability.slot.toUpperCase()}: ${abilityName}`}
                  >
                    {ability.displayIcon ? (
                      <img
                        src={ability.displayIcon}
                        alt={abilityName}
                        loading="lazy"
                        className="h-full w-full object-contain brightness-110 drop-shadow"
                      />
                    ) : (
                      <span className="text-xs font-bold uppercase text-white/90">
                        {ability.slot[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
