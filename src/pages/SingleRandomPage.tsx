import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { agents, maps, weapons } from '@/data';
import {
  AgentPanel,
  ComboPanel,
  MapPanel,
  WeaponPanel,
} from '@/features/random/components';
import { useI18n } from '@/lib/i18n';

type SingleTab = 'agent' | 'map' | 'weapon' | 'combo';

export const SingleRandomPage: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<SingleTab>('agent');

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-wider uppercase text-ink">
          {t('nav.single')}
        </h1>
        <p className="text-ink-muted text-sm mt-1">{t('app.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-2 border-b border-line pb-3 overflow-x-auto select-none"
        role="tablist"
        aria-label={t('nav.single')}
      >
        <Button
          variant={activeTab === 'agent' ? 'primary' : 'ghost'}
          size="sm"
          role="tab"
          aria-selected={activeTab === 'agent'}
          onClick={() => setActiveTab('agent')}
        >
          {t('single.agent.title')} ({agents.length})
        </Button>
        <Button
          variant={activeTab === 'map' ? 'primary' : 'ghost'}
          size="sm"
          role="tab"
          aria-selected={activeTab === 'map'}
          onClick={() => setActiveTab('map')}
        >
          {t('single.map.title')} ({maps.length})
        </Button>
        <Button
          variant={activeTab === 'weapon' ? 'primary' : 'ghost'}
          size="sm"
          role="tab"
          aria-selected={activeTab === 'weapon'}
          onClick={() => setActiveTab('weapon')}
        >
          {t('single.weapon.title')} ({weapons.length})
        </Button>
        <Button
          variant={activeTab === 'combo' ? 'secondary' : 'ghost'}
          size="sm"
          role="tab"
          aria-selected={activeTab === 'combo'}
          onClick={() => setActiveTab('combo')}
        >
          ✨ {t('single.combo.title')}
        </Button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'agent' && <AgentPanel />}
      {activeTab === 'map' && <MapPanel />}
      {activeTab === 'weapon' && <WeaponPanel />}
      {activeTab === 'combo' && <ComboPanel />}
    </div>
  );
};
