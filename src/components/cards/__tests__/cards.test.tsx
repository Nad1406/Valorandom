import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentCard, MapCard, WeaponCard } from '@/components/cards';
import { agents, maps, weapons } from '@/data';
import { I18nProvider } from '@/lib/i18n';

describe('Presentational Cards (P1-05)', () => {
  const renderWithI18n = (ui: React.ReactElement) => {
    return render(<I18nProvider>{ui}</I18nProvider>);
  };

  it('renders AgentCard with role, abilities, and fallback on image error', () => {
    const agent = agents[0];
    if (!agent) throw new Error('No agent found');

    renderWithI18n(<AgentCard agent={agent} highlight />);

    const card = screen.getByTestId('agent-card');
    expect(card).toBeInTheDocument();
    expect(screen.getByText(agent.displayName.vi)).toBeInTheDocument();

    const img = screen.getByAltText(agent.displayName.vi);
    fireEvent.error(img);
    expect(card).toBeInTheDocument();
  });

  it('renders MapCard with active badge, coordinates and sites', () => {
    const map = maps[0];
    if (!map) throw new Error('No map found');

    renderWithI18n(<MapCard map={map} />);

    expect(screen.getByTestId('map-card')).toBeInTheDocument();
    expect(screen.getByText(map.displayName.vi)).toBeInTheDocument();
    if (map.coordinates) {
      expect(screen.getByText(map.coordinates)).toBeInTheDocument();
    }
  });

  it('renders WeaponCard with category, cost and weapon stats', () => {
    const weapon = weapons.find((w) => w.cost > 0) ?? weapons[0];
    if (!weapon) throw new Error('No weapon found');

    renderWithI18n(<WeaponCard weapon={weapon} />);

    expect(screen.getByTestId('weapon-card')).toBeInTheDocument();
    expect(screen.getByText(weapon.displayName.vi)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${weapon.cost.toLocaleString()}`))).toBeInTheDocument();
  });
});
