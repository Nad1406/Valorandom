import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { localize } from '@/data';
import { playUiClick } from '@/lib/audio/tacticalSound';
import { useI18n } from '@/lib/i18n';
import type { Agent, Role } from '@/types/valorant';

export interface AgentCardProps {
  agent: Agent;
  highlight?: boolean;
  className?: string;
}

const ROLE_ACCENT_HEX: Record<Role, string> = {
  duelist: '#FF4655',
  initiator: '#F5C453',
  controller: '#8B7CF6',
  sentinel: '#00E5C0',
};

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  highlight = false,
  className = '',
}) => {
  const { lang, t } = useI18n();
  const [imgError, setImgError] = useState(false);
  const [selectedAbilitySlot, setSelectedAbilitySlot] = useState<string | null>(null);

  const displayName = localize(agent.displayName, lang);
  const roleName = localize(agent.roleName, lang);
  const description = localize(agent.description, lang);
  const imageSrc = !imgError && agent.fullPortrait ? agent.fullPortrait : agent.displayIcon;
  const activeAbility = agent.abilities.find((a) => a.slot === selectedAbilitySlot);
  const roleHex = ROLE_ACCENT_HEX[agent.role];
  const accentStyle = { '--role-color': roleHex } as React.CSSProperties;

  return (
    <Card
      variant={highlight ? 'interactive' : 'elevated'}
      style={accentStyle}
      className={`relative overflow-hidden flex flex-col p-5 transition-colors duration-200 clip-corner-tl border-white/15 bg-bg-elevated/95 ${
        highlight ? 'border-val-red ring-1 ring-val-red/70 shadow-glow' : ''
      } ${className}`}
      data-testid="agent-card"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
        style={{ backgroundColor: 'var(--role-color)' }}
      />

      <div
        aria-hidden="true"
        data-watermark={displayName}
        className="val-watermark pointer-events-none absolute -right-3 -top-6 select-none font-display text-8xl sm:text-9xl font-black uppercase text-white/[0.035] leading-none"
      />

      {/* Dossier header */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <Badge variant={agent.role}>{roleName}</Badge>
          <span className="font-mono text-xs text-ink-muted tabular-nums">
            #{agent.slug.toUpperCase()}
          </span>
        </div>
        <span
          className={`font-tactical text-xs font-bold tracking-widest uppercase ${
            highlight ? 'text-val-teal' : 'text-ink-muted'
          }`}
        >
          {highlight ? t('card.status.locked') : t('card.status.ready')}
        </span>
      </div>

      {/* Portrait showcase stage */}
      <div className="relative my-4 h-64 sm:h-72 w-full flex items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-bg-base/75">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, var(--role-color), transparent 70%)',
          }}
        />
        {!imgError && agent.background && (
          <img
            src={agent.background}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-[0.08]"
          />
        )}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
        ) : (
          <div className="relative z-10 flex items-center justify-center text-ink-muted font-display text-lg">
            {displayName}
          </div>
        )}
      </div>

      {/* Name, bio & abilities dock */}
      <div className="z-10 mt-auto">
        <h3 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-val-offwhite uppercase leading-none">
          {displayName}
        </h3>
        {description && (
          <p className="mt-2 text-xs sm:text-sm text-ink-muted line-clamp-2 font-sans leading-relaxed">
            {description}
          </p>
        )}

        {agent.abilities.length > 0 && (
          <div className="mt-4 flex flex-col gap-2.5 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-tactical font-bold uppercase tracking-widest text-ink-muted">
                {t('card.abilities')} ({agent.abilities.length})
              </span>
              <span className="text-xs font-tactical font-bold uppercase tracking-wider text-val-teal truncate">
                {activeAbility
                  ? localize(activeAbility.displayName, lang)
                  : t('card.abilityHint')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {agent.abilities.map((ability) => {
                const abilityName = localize(ability.displayName, lang);
                const isSelected = selectedAbilitySlot === ability.slot;
                return (
                  <button
                    key={ability.slot}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      playUiClick();
                      setSelectedAbilitySlot(isSelected ? null : ability.slot);
                    }}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-sm border p-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
                      isSelected
                        ? 'border-val-teal bg-surface-hi ring-1 ring-val-teal'
                        : 'border-white/15 bg-bg-base/80 hover:border-val-teal/60 hover:bg-surface-hi'
                    }`}
                    title={`${ability.slot.toUpperCase()}: ${abilityName}`}
                  >
                    {ability.displayIcon ? (
                      <img
                        src={ability.displayIcon}
                        alt={abilityName}
                        loading="lazy"
                        className="h-full w-full object-contain brightness-110"
                      />
                    ) : (
                      <span className="text-xs font-bold uppercase text-val-offwhite">
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
