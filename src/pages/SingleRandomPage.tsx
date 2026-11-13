import React, { useState } from 'react';
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
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 bg-val-red shadow-glow" />
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight uppercase text-val-offwhite">
            {t('nav.single')}
          </h1>
        </div>
        <p className="text-white/50 text-xs sm:text-sm font-sans pl-4">
          {t('app.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto select-none"
        role="tablist"
        aria-label={t('nav.single')}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'agent'}
          onClick={() => setActiveTab('agent')}
          className={`px-4 py-2 rounded text-sm sm:text-base font-tactical font-bold tracking-widest uppercase transition-all ${
            activeTab === 'agent'
              ? 'bg-val-red text-white shadow-glow'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          {t('single.agent.title')} ({agents.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'map'}
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded text-sm sm:text-base font-tactical font-bold tracking-widest uppercase transition-all ${
            activeTab === 'map'
              ? 'bg-val-red text-white shadow-glow'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          {t('single.map.title')} ({maps.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'weapon'}
          onClick={() => setActiveTab('weapon')}
          className={`px-4 py-2 rounded text-sm sm:text-base font-tactical font-bold tracking-widest uppercase transition-all ${
            activeTab === 'weapon'
              ? 'bg-val-red text-white shadow-glow'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          {t('single.weapon.title')} ({weapons.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'combo'}
          onClick={() => setActiveTab('combo')}
          className={`px-4 py-2 rounded text-sm sm:text-base font-tactical font-bold tracking-widest uppercase transition-all ${
            activeTab === 'combo'
              ? 'bg-val-teal text-[#0F1923] shadow-glow-teal font-extrabold'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          ✨ {t('single.combo.title')}
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
