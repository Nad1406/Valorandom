import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { agents, maps, weapons } from '@/data';
import {
  AgentPanel,
  ComboPanel,
  MapPanel,
  WeaponPanel,
} from '@/features/random/components';
import { playUiClick } from '@/lib/audio/tacticalSound';
import { useI18n } from '@/lib/i18n';

type SingleTab = 'agent' | 'map' | 'weapon' | 'combo';

export const SingleRandomPage: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<SingleTab>('agent');

  const selectTab = (tab: SingleTab) => {
    if (tab !== activeTab) playUiClick();
    setActiveTab(tab);
  };

  const tabClass = (tab: SingleTab, tealAccent = false) => {
    const isActive = activeTab === tab;
    if (isActive && tealAccent) {
      return 'relative border border-val-teal bg-val-teal/15 text-val-teal shadow-glow-teal';
    }
    if (isActive) {
      return 'relative border border-val-red bg-val-red text-white shadow-glow';
    }
    return 'border border-white/12 bg-bg-elevated/80 text-ink-muted hover:text-val-offwhite hover:border-white/30 hover:bg-surface-hi';
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-white/12 pb-4">
        <div className="flex items-center gap-3">
          <span className="h-7 w-1 bg-val-red" aria-hidden="true" />
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight uppercase text-val-offwhite leading-none">
            {t('nav.single')}
          </h1>
        </div>
        <p className="text-ink-muted text-xs sm:text-sm font-sans pl-4 mt-1">
          {t('app.subtitle')}
        </p>
      </div>

      {/* Mode Tabs */}
      <div
        className="flex items-center gap-2 border-b border-white/12 pb-3 overflow-x-auto select-none"
        role="tablist"
        aria-label={t('nav.single')}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'agent'}
          onClick={() => selectTab('agent')}
          className={`px-4 py-2 rounded-sm text-sm sm:text-base font-tactical font-bold tracking-widest uppercase transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${tabClass('agent')}`}
        >
          {t('single.agent.title')} <span className="tabular-nums">({agents.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'map'}
          onClick={() => selectTab('map')}
          className={`px-4 py-2 rounded-sm text-sm sm:text-base font-tactical font-bold tracking-widest uppercase transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${tabClass('map')}`}
        >
          {t('single.map.title')} <span className="tabular-nums">({maps.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'weapon'}
          onClick={() => selectTab('weapon')}
          className={`px-4 py-2 rounded-sm text-sm sm:text-base font-tactical font-bold tracking-widest uppercase transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${tabClass('weapon')}`}
        >
          {t('single.weapon.title')} <span className="tabular-nums">({weapons.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'combo'}
          onClick={() => selectTab('combo')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm sm:text-base font-tactical font-bold tracking-widest uppercase transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-val-teal ${tabClass('combo', true)}`}
        >
          <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t('single.combo.title')}</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'agent' && <AgentPanel />}
      {activeTab === 'map' && <MapPanel />}
      {activeTab === 'weapon' && <WeaponPanel />}
      {activeTab === 'combo' && <ComboPanel />}
    </div>
  );
};
