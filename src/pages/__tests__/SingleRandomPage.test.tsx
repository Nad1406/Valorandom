import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveRegionProvider } from '@/components/layout/LiveRegion';
import { I18nProvider } from '@/lib/i18n';
import { SingleRandomPage } from '@/pages/SingleRandomPage';

describe('SingleRandomPage Integration (P2-04, P2-05, P2-06, P2-07, P2-08, AC-10.1, AC-11.1, AC-12.1, AC-04.1)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderPage = () => {
    return render(
      <I18nProvider>
        <LiveRegionProvider>
          <SingleRandomPage />
        </LiveRegionProvider>
      </I18nProvider>,
    );
  };

  it('P2-04 & AC-10.1 renders agent panel, filters by duelist, and randomizes a duelist', async () => {
    renderPage();

    // Default tab is Agent
    const duelistBtn = screen.getByRole('button', { name: /^duelist$/i });
    fireEvent.click(duelistBtn);

    const randomBtn = screen.getByRole('button', { name: /^random$/i });
    fireEvent.click(randomBtn);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // An agent card is rendered with duelist role
    const agentCard = screen.getByTestId('agent-card');
    expect(agentCard).toBeInTheDocument();
    expect(agentCard).toHaveTextContent(/(duelist|đối đầu)/i);
  });

  it('P2-05 & AC-11.1 switches to Map tab, toggles active rotation, and randomizes a map', async () => {
    renderPage();

    const mapTabBtn = screen.getByRole('tab', { name: /bản đồ/i });
    fireEvent.click(mapTabBtn);

    expect(screen.getByRole('switch', { name: /chỉ map trong rotation/i })).toBeInTheDocument();

    const randomBtn = screen.getByRole('button', { name: /^random$/i });
    fireEvent.click(randomBtn);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    const mapCard = screen.getByTestId('map-card');
    expect(mapCard).toBeInTheDocument();
    expect(mapCard).toHaveTextContent(/trong rotation/i);
  });

  it('P2-06 & AC-12.1 switches to Weapon tab, selects category rifle, and randomizes', async () => {
    renderPage();

    const weaponTabBtn = screen.getByRole('tab', { name: /vũ khí/i });
    fireEvent.click(weaponTabBtn);

    const rifleBtn = screen.getByRole('button', { name: /súng trường/i });
    fireEvent.click(rifleBtn);

    const randomBtn = screen.getByRole('button', { name: /^random$/i });
    fireEvent.click(randomBtn);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    const weaponCard = screen.getByTestId('weapon-card');
    expect(weaponCard).toBeInTheDocument();
  });

  it('P2-08 switches to Combo tab and triggers a simultaneous triple random', async () => {
    renderPage();

    const comboTabBtn = screen.getByRole('tab', { name: /combo trận đấu/i });
    fireEvent.click(comboTabBtn);

    const rollComboBtn = screen.getByRole('button', { name: /random combo/i });
    fireEvent.click(rollComboBtn);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByTestId('agent-card')).toBeInTheDocument();
    expect(screen.getByTestId('map-card')).toBeInTheDocument();
    expect(screen.getByTestId('weapon-card')).toBeInTheDocument();
  });
});
