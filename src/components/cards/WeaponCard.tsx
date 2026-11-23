import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { localize } from '@/data';
import { useI18n } from '@/lib/i18n';
import type { Weapon } from '@/types/valorant';

export interface WeaponCardProps {
  weapon: Weapon;
  highlight?: boolean;
  className?: string;
}

function clampPercent(value: number, max: number): number {
  if (max <= 0) return 0;
  const pct = (value / max) * 100;
  if (pct < 4) return 4;
  if (pct > 100) return 100;
  return pct;
}

interface StatBarRowProps {
  label: string;
  valueText: string;
  percent: number;
  highlightRed?: boolean;
}

const StatBarRow: React.FC<StatBarRowProps> = ({
  label,
  valueText,
  percent,
  highlightRed = false,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between font-tactical text-xs tracking-wider uppercase">
      <span className="text-ink-muted">{label}</span>
      <span
        className={`font-mono font-bold tabular-nums ${
          highlightRed ? 'text-val-red' : 'text-val-offwhite'
        }`}
      >
        {valueText}
      </span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-sm bg-bg-base border border-white/10">
      <div
        className={`h-full ${highlightRed ? 'bg-val-red' : 'bg-val-teal'}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

export const WeaponCard: React.FC<WeaponCardProps> = ({
  weapon,
  highlight = false,
  className = '',
}) => {
  const { lang, t } = useI18n();
  const [imgError, setImgError] = useState(false);

  const displayName = localize(weapon.displayName, lang);
  const costLabel =
    weapon.cost === 0 ? t('common.free') : `${weapon.cost.toLocaleString()} creds`;
  const categoryLabel = t(`weapon.category.${weapon.category}` as const);
  const { fireRate, magazineSize, damageHead, damageBody, reloadTimeSeconds } = weapon.stats;

  return (
    <Card
      variant={highlight ? 'interactive' : 'elevated'}
      className={`relative overflow-hidden flex flex-col p-5 transition-colors duration-200 clip-corner-tl border-white/15 bg-bg-elevated/95 ${
        highlight ? 'border-val-red ring-1 ring-val-red/70 shadow-glow' : ''
      } ${className}`}
      data-testid="weapon-card"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-val-gold" />

      <div
        aria-hidden="true"
        data-watermark={displayName}
        className="val-watermark pointer-events-none absolute -right-3 -top-6 select-none font-display text-8xl sm:text-9xl font-black uppercase text-white/[0.035] leading-none"
      />

      <div className="flex items-center justify-between gap-2 z-10">
        <Badge variant="default">{categoryLabel}</Badge>
        <span className="font-tactical text-sm font-bold tracking-widest uppercase text-val-gold tabular-nums">
          {costLabel}
        </span>
      </div>

      <div className="relative my-4 h-52 sm:h-60 w-full flex items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-bg-base/80 bg-tactical-grid p-5">
        {!imgError && weapon.displayIcon ? (
          <img
            src={weapon.displayIcon}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
        ) : (
          <div className="flex items-center justify-center text-ink-muted font-display text-lg">
            {displayName}
          </div>
        )}
      </div>

      <div className="z-10 mt-auto">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-val-offwhite uppercase leading-none">
            {displayName}
          </h3>
          {reloadTimeSeconds !== null && (
            <span className="font-mono text-xs text-ink-muted tabular-nums">
              {t('card.reload')}: {reloadTimeSeconds.toFixed(1)}s
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3 border-t border-white/10">
          {fireRate !== null && (
            <StatBarRow
              label={t('stats.fireRate')}
              valueText={`${fireRate}/s`}
              percent={clampPercent(fireRate, 16)}
            />
          )}
          {magazineSize !== null && (
            <StatBarRow
              label={t('stats.magSize')}
              valueText={`${magazineSize}`}
              percent={clampPercent(magazineSize, 100)}
            />
          )}
          {damageHead !== null && (
            <StatBarRow
              label={t('stats.headDamage')}
              valueText={damageHead.toFixed(0)}
              percent={clampPercent(damageHead, 255)}
              highlightRed
            />
          )}
          {damageBody !== null && (
            <StatBarRow
              label={t('stats.bodyDamage')}
              valueText={damageBody.toFixed(0)}
              percent={clampPercent(damageBody, 150)}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
