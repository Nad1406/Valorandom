import React, { useState } from 'react';
import { AgentCard } from '@/components/cards/AgentCard';
import { MapCard } from '@/components/cards/MapCard';
import { WeaponCard } from '@/components/cards/WeaponCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { agents, maps, weapons } from '@/data';
import { useI18n } from '@/lib/i18n';

type SingleTab = 'agent' | 'map' | 'weapon';

export const SingleRandomPage: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<SingleTab>('agent');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-wider uppercase text-ink">
          {t('nav.single')}
        </h1>
        <p className="text-ink-muted text-sm mt-1">{t('app.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <Button
          variant={activeTab === 'agent' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('agent')}
        >
          {t('single.agent.title')} ({agents.length})
        </Button>
        <Button
          variant={activeTab === 'map' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('map')}
        >
          {t('single.map.title')} ({maps.length})
        </Button>
        <Button
          variant={activeTab === 'weapon' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('weapon')}
        >
          {t('single.weapon.title')} ({weapons.length})
        </Button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'agent' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col gap-4 lg:col-span-1">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider text-ink">
              {t('single.agent.title')}
            </h2>
            <p className="text-sm text-ink-muted">{t('single.agent.desc')}</p>
            <div className="flex items-center justify-between text-xs text-ink-muted pt-4 border-t border-line">
              <span>{t('single.filter.poolCount', { count: agents.length })}</span>
              <Badge variant="duelist">30 Agents</Badge>
            </div>
            <Button variant="primary" disabled className="w-full mt-2">
              {t('common.random')}
            </Button>
          </Card>
          <div className="lg:col-span-2">
            {agents[0] && <AgentCard agent={agents[0]} highlight />}
          </div>
        </div>
      )}

      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col gap-4 lg:col-span-1">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider text-ink">
              {t('single.map.title')}
            </h2>
            <p className="text-sm text-ink-muted">{t('single.map.desc')}</p>
            <div className="flex items-center justify-between text-xs text-ink-muted pt-4 border-t border-line">
              <span>{t('single.filter.poolCount', { count: maps.length })}</span>
              <Badge variant="accent">27 Maps</Badge>
            </div>
            <Button variant="primary" disabled className="w-full mt-2">
              {t('common.random')}
            </Button>
          </Card>
          <div className="lg:col-span-2">
            {maps[0] && <MapCard map={maps[0]} highlight />}
          </div>
        </div>
      )}

      {activeTab === 'weapon' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col gap-4 lg:col-span-1">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider text-ink">
              {t('single.weapon.title')}
            </h2>
            <p className="text-sm text-ink-muted">{t('single.weapon.desc')}</p>
            <div className="flex items-center justify-between text-xs text-ink-muted pt-4 border-t border-line">
              <span>{t('single.filter.poolCount', { count: weapons.length })}</span>
              <Badge variant="default">21 Weapons</Badge>
            </div>
            <Button variant="primary" disabled className="w-full mt-2">
              {t('common.random')}
            </Button>
          </Card>
          <div className="lg:col-span-2">
            {weapons[0] && <WeaponCard weapon={weapons[0]} highlight />}
          </div>
        </div>
      )}
    </div>
  );
};
