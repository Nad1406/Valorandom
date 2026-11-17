import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@/lib/i18n';
import { SquadRandomPage } from '@/pages/SquadRandomPage';

function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

describe('SquadRandomPage Component Tests (Phase 3)', () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    mockReducedMotion(true);
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    Object.assign(navigator, { clipboard: originalClipboard });
    vi.useRealTimers();
  });

  const renderSquadPage = (initialUrl = '/squad') => {
    return render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <I18nProvider>
          <SquadRandomPage />
        </I18nProvider>
      </MemoryRouter>,
    );
  };

  const getAgentStates = () =>
    screen.queryAllByTestId('slot-agent').map((el) => el.getAttribute('data-state'));

  it('AC-20.1: renders initial 5 slots and allows adding / removing slots', () => {
    renderSquadPage();

    expect(screen.getByText('5 / 5 Slots')).toBeInTheDocument();
    const addBtn = screen.getByRole('button', { name: /\+ thêm người chơi/i });
    expect(addBtn).toBeDisabled();

    const removeButtons = screen.getAllByRole('button', { name: /xóa slot/i });
    expect(removeButtons).toHaveLength(5);
    fireEvent.click(removeButtons[4]!);

    expect(screen.getByText('4 / 5 Slots')).toBeInTheDocument();
    expect(addBtn).toBeEnabled();

    fireEvent.click(addBtn);
    expect(screen.getByText('5 / 5 Slots')).toBeInTheDocument();
  });

  it('AC-21.1 & AC-21.4: Random Squad renders 5 unique agents inside the slot banners', () => {
    renderSquadPage();

    fireEvent.click(screen.getByRole('button', { name: /random đội hình/i }));

    expect(getAgentStates()).toEqual(['rolled', 'rolled', 'rolled', 'rolled', 'rolled']);
    const names = screen
      .getAllByTestId('squad-slot')
      .map((slot) => within(slot).getByRole('img').getAttribute('alt'));
    expect(new Set(names).size).toBe(5);
    expect(screen.queryByText(/đội hình đã random/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /random lại/i })).toBeInTheDocument();
  });

  it('AC-23.1 & AC-23.3: locks an agent, verifies picker filters, and randomizes with locked agent preserved', () => {
    renderSquadPage();

    const lockButtons = screen.getAllByRole('button', { name: /\+ khóa đặc vụ/i });
    fireEvent.click(lockButtons[0]!);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /jett/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mở khóa jett/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /random đội hình/i }));

    expect(getAgentStates()).toEqual(['locked', 'rolled', 'rolled', 'rolled', 'rolled']);
    expect(screen.getByText('Đã khóa')).toBeInTheDocument();
    expect(screen.getAllByAltText('Jett')).toHaveLength(1);
  });

  it('AC-23.4: locks a rolled agent from its banner and keeps it on re-roll', () => {
    renderSquadPage();
    fireEvent.click(screen.getByRole('button', { name: /random đội hình/i }));

    const firstSlot = screen.getAllByTestId('squad-slot')[0]!;
    const agentName = within(firstSlot).getByRole('img').getAttribute('alt')!;
    fireEvent.click(within(firstSlot).getByRole('button', { name: `Khóa ${agentName}` }));

    expect(getAgentStates()[0]).toBe('locked');
    fireEvent.click(screen.getByRole('button', { name: /random lại/i }));

    const slotAfter = screen.getAllByTestId('squad-slot')[0]!;
    expect(within(slotAfter).getByRole('img')).toHaveAttribute('alt', agentName);
    expect(getAgentStates()[0]).toBe('locked');
  });

  it('AC-21.5: unlocked slots show a rolling preview before resolving (locked slots skipped)', () => {
    mockReducedMotion(false);
    vi.useFakeTimers();
    renderSquadPage();

    fireEvent.click(screen.getAllByRole('button', { name: /\+ khóa đặc vụ/i })[0]!);
    fireEvent.click(screen.getByRole('button', { name: /jett/i }));
    fireEvent.click(screen.getByRole('button', { name: /random đội hình/i }));

    expect(getAgentStates()).toEqual(['locked', 'rolling', 'rolling', 'rolling', 'rolling']);
    expect(screen.getByRole('button', { name: /random đội hình/i })).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(getAgentStates()).toEqual(['locked', 'rolled', 'rolled', 'rolled', 'rolled']);
  });

  it('AC-23.2: locking all slots disables random button', () => {
    renderSquadPage();

    for (let i = 0; i < 4; i++) {
      const currentRemoveButtons = screen.getAllByRole('button', { name: /xóa slot/i });
      fireEvent.click(currentRemoveButtons[currentRemoveButtons.length - 1]!);
    }
    expect(screen.getByText('1 / 5 Slots')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /\+ khóa đặc vụ/i }));
    fireEvent.click(screen.getByRole('button', { name: /jett/i }));

    expect(screen.getByRole('button', { name: /random đội hình/i })).toBeDisabled();
    expect(screen.getByText(/tất cả slot đã được khóa/i)).toBeInTheDocument();
  });

  it('AC-24.1: sharing squad copies rolled squad text to clipboard and displays toast', async () => {
    renderSquadPage();
    fireEvent.click(screen.getByRole('button', { name: /random đội hình/i }));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /chia sẻ/i }));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringMatching(/^Player 1 ➔ /));
    expect(screen.getByText(/đã sao chép/i)).toBeInTheDocument();
  });

  it('AC-04.2 & P3-08: displays error banner when URL has invalid share query', () => {
    renderSquadPage('/squad?s=invalid-broken-base64');

    expect(screen.getByText(/link chia sẻ không hợp lệ hoặc đã hết hạn/i)).toBeInTheDocument();
  });
});
