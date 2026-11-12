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
      className={`relative overflow-hidden flex flex-col p-4 transition-all duration-300 ${highlight ? 'border-val-red ring-1 ring-val-red shadow-glow' : ''} ${className}`}
      data-testid="weapon-card"
    >
      <div className="flex items-center justify-between z-10">
        <Badge variant="default">{categoryLabel}</Badge>
        <span className="text-xs font-mono font-semibold text-val-gold">
          {costLabel}
        </span>
      </div>

      <div className="relative my-3 h-48 w-full flex items-center justify-center overflow-hidden rounded-lg bg-bg-base/60 p-4">
        {!imgError && weapon.displayIcon ? (
          <img
            src={weapon.displayIcon}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105"
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

        <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-line/60 text-xs">
          {weapon.stats.fireRate !== null && (
            <div className="flex justify-between text-ink-muted">
              <span>{t('stats.fireRate')}:</span>
              <span className="font-mono text-ink font-semibold">
                {weapon.stats.fireRate}/s
              </span>
            </div>
          )}
          {weapon.stats.magazineSize !== null && (
            <div className="flex justify-between text-ink-muted">
              <span>{t('stats.magSize')}:</span>
              <span className="font-mono text-ink font-semibold">
                {weapon.stats.magazineSize}
              </span>
            </div>
          )}
          {weapon.stats.damageHead !== null && (
            <div className="flex justify-between text-ink-muted">
              <span>{t('stats.headDamage')}:</span>
              <span className="font-mono text-val-red font-semibold">
                {weapon.stats.damageHead.toFixed(0)}
              </span>
            </div>
          )}
          {weapon.stats.damageBody !== null && (
            <div className="flex justify-between text-ink-muted">
              <span>{t('stats.bodyDamage')}:</span>
              <span className="font-mono text-ink font-semibold">
                {weapon.stats.damageBody.toFixed(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
