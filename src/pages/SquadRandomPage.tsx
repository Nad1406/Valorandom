import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useI18n } from '@/lib/i18n';
import type { SlotRole } from '@/types/valorant';

interface MockSlot {
  id: string;
  name: string;
  role: SlotRole;
}

const DEFAULT_SLOTS: MockSlot[] = [
  { id: '1', name: 'Player 1', role: 'duelist' },
  { id: '2', name: 'Player 2', role: 'initiator' },
  { id: '3', name: 'Player 3', role: 'controller' },
  { id: '4', name: 'Player 4', role: 'sentinel' },
  { id: '5', name: 'Player 5', role: 'flex' },
];

export const SquadRandomPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-wider uppercase text-ink">
          {t('squad.title')}
        </h1>
        <p className="text-ink-muted text-sm mt-1">{t('squad.desc')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display uppercase tracking-wider text-ink-muted">
              5 Slots
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled>
                {t('squad.lockAll')}
              </Button>
              <Button variant="outline" size="sm" disabled>
                {t('squad.share')}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {DEFAULT_SLOTS.map((slot, index) => (
              <Card
                key={slot.id}
                className="p-3.5 flex items-center justify-between gap-3 bg-surface border border-line"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-display font-bold text-ink-muted text-sm">
                    #{index + 1}
                  </span>
                  <span className="font-display font-semibold text-ink text-sm">
                    {t('squad.slot.defaultName', { n: index + 1 })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={slot.role}>{slot.role}</Badge>
                </div>
              </Card>
            ))}
          </div>

          <Button variant="primary" disabled size="lg" className="w-full mt-4">
            {t('common.random')} (Squad)
          </Button>
        </div>

        <Card className="p-6 lg:w-80 h-fit bg-surface-hi flex flex-col gap-3">
          <h3 className="font-display font-bold uppercase text-ink text-sm tracking-wider">
            {t('app.title')} Guide
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            {t('squad.desc')}
          </p>
        </Card>
      </div>
    </div>
  );
};
