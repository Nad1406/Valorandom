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
  const categoryKey = `weapon.category.${weapon.category}` as const;
  const categoryLabel = t(categoryKey);

  return (
    <Card
      variant={highlight ? 'interactive' : 'elevated'}
      className={`relative overflow-hidden flex flex-col p-5 transition-all duration-300 clip-corner-tl border-white/15 bg-[#0F1923]/90 ${
        highlight ? 'border-val-red ring-1 ring-val-red shadow-glow' : ''
      } ${className}`}
      data-testid="weapon-card"
    >
      {/* Huge Background Watermark Name */}
      <div
        aria-hidden="true"
        data-watermark={displayName}
        className="val-watermark pointer-events-none absolute -right-4 -top-8 select-none font-display text-8xl sm:text-9xl font-black uppercase text-white/[0.04] leading-none"
      />

      <div className="flex items-center justify-between z-10">
        <Badge variant="default">{categoryLabel}</Badge>
        <span className="font-tactical text-sm font-bold tracking-wider text-val-gold">
          {costLabel}
        </span>
      </div>

      <div className="relative my-4 h-56 sm:h-64 w-full flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white/[0.03] to-black/40 p-4">
        {!imgError && weapon.displayIcon ? (
          <img
            src={weapon.displayIcon}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center text-ink-muted font-display text-lg">
            {displayName}
          </div>
        )}
      </div>

      <div className="z-10 mt-auto">
        <h3 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-val-offwhite uppercase">
          {displayName}
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
          {weapon.stats.fireRate !== null && (
            <div className="flex justify-between font-tactical text-sm text-white/50">
              <span>{t('stats.fireRate')}:</span>
              <span className="font-mono text-val-offwhite font-bold">
                {weapon.stats.fireRate}/s
              </span>
            </div>
          )}
          {weapon.stats.magazineSize !== null && (
            <div className="flex justify-between font-tactical text-sm text-white/50">
              <span>{t('stats.magSize')}:</span>
              <span className="font-mono text-val-offwhite font-bold">
                {weapon.stats.magazineSize}
              </span>
            </div>
          )}
          {weapon.stats.damageHead !== null && (
            <div className="flex justify-between font-tactical text-sm text-white/50">
              <span>{t('stats.headDamage')}:</span>
              <span className="font-mono text-val-red font-bold">
                {weapon.stats.damageHead.toFixed(0)}
              </span>
            </div>
          )}
          {weapon.stats.damageBody !== null && (
            <div className="flex justify-between font-tactical text-sm text-white/50">
              <span>{t('stats.bodyDamage')}:</span>
              <span className="font-mono text-val-offwhite font-bold">
                {weapon.stats.damageBody.toFixed(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
