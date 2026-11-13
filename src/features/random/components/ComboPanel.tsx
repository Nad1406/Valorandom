import React, { useState } from 'react';
import { AgentCard } from '@/components/cards/AgentCard';
import { MapCard } from '@/components/cards/MapCard';
import { WeaponCard } from '@/components/cards/WeaponCard';
import { Card } from '@/components/ui/Card';
import { agents, maps, weapons } from '@/data';
import { createDefaultRng } from '@/features/random/rng';
import { randomCombo, type ComboResult } from '@/features/random/singleRandom';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useI18n } from '@/lib/i18n';

export const ComboPanel: React.FC = () => {
  const { t } = useI18n();
  const prefersReducedMotion = useReducedMotion();
  const [combo, setCombo] = useState<ComboResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRollCombo = () => {
    if (prefersReducedMotion) {
      const rng = createDefaultRng();
      const res = randomCombo(agents, maps, weapons, rng);
      setCombo(res);
      return;
    }

    setIsSpinning(true);
    setTimeout(() => {
      const rng = createDefaultRng();
      const res = randomCombo(agents, maps, weapons, rng);
      setCombo(res);
      setIsSpinning(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 bg-[#0F1923]/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 clip-corner-tl">
        <div>
          <h2 className="font-display font-black text-3xl uppercase tracking-wider text-val-offwhite">
            {t('single.combo.title')}
          </h2>
          <p className="text-xs text-white/50 mt-1 font-sans">{t('single.combo.desc')}</p>
        </div>
        <button
          type="button"
          disabled={isSpinning}
          onClick={handleRollCombo}
          className="val-btn-match w-full sm:w-auto text-base tracking-widest clip-tactical"
        >
          {isSpinning
            ? t('single.scanning')
            : combo
              ? t('common.reroll')
              : t('single.combo.button')}
        </button>
      </Card>

      {combo ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
          {combo.agent && <AgentCard agent={combo.agent} highlight />}
          {combo.map && <MapCard map={combo.map} highlight />}
          {combo.weapon && <WeaponCard weapon={combo.weapon} highlight />}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30">
          {agents[0] && <AgentCard agent={agents[0]} />}
          {maps[0] && <MapCard map={maps[0]} />}
          {weapons[0] && <WeaponCard weapon={weapons[0]} />}
        </div>
      )}
    </div>
  );
};
