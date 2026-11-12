import React, { useState } from 'react';
import { AgentCard } from '@/components/cards/AgentCard';
import { MapCard } from '@/components/cards/MapCard';
import { WeaponCard } from '@/components/cards/WeaponCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { agents, maps, weapons } from '@/data';
import { createDefaultRng } from '@/features/random/rng';
import { randomCombo, type ComboResult } from '@/features/random/singleRandom';
import { useI18n } from '@/lib/i18n';

export const ComboPanel: React.FC = () => {
  const { t } = useI18n();
  const [combo, setCombo] = useState<ComboResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRollCombo = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const rng = createDefaultRng();
      const res = randomCombo(agents, maps, weapons, rng);
      setCombo(res);
      setIsSpinning(false);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 bg-surface-hi flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl uppercase tracking-wider text-ink">
            {t('single.combo.title')}
          </h2>
          <p className="text-sm text-ink-muted mt-1">{t('single.combo.desc')}</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          loading={isSpinning}
          onClick={handleRollCombo}
          className="w-full sm:w-auto"
        >
          {combo ? t('common.reroll') : t('single.combo.button')}
        </Button>
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
