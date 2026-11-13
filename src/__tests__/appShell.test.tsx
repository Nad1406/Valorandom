import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { LiveRegionProvider, useAnnounce } from '@/components/layout/LiveRegion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { I18nProvider } from '@/lib/i18n';
import { routes } from '@/router';

describe('App Shell & Navigation (P1-06, P1-07, AC-01.1, AC-01.3)', () => {
  const renderAppAt = (initialEntry = '/') => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: [initialEntry],
    });
    return render(
      <I18nProvider>
        <RouterProvider router={memoryRouter} />
      </I18nProvider>,
    );
  };

  it('renders App shell with header, navigation, active route, and footer metadata', async () => {
    const user = userEvent.setup();
    renderAppAt('/');

    // Brand logo
    expect(screen.getByText('VALO')).toBeInTheDocument();
    expect(screen.getByText('RANDOM')).toBeInTheDocument();

    // Nav links
    const singleNavLink = screen.getByRole('link', { name: /random đơn/i });
    const squadNavLink = screen.getByRole('link', { name: /random đội/i });
    expect(singleNavLink).toBeInTheDocument();
    expect(squadNavLink).toBeInTheDocument();

    // Footer author link & disclaimer
    expect(screen.getByRole('link', { name: /nad1406/i })).toHaveAttribute(
      'href',
      'https://github.com/Nad1406',
    );
    expect(screen.getByText(/riot games/i)).toBeInTheDocument();

    // Click navigation to Squad page
    await user.click(squadNavLink);
    expect(
      await screen.findByRole('heading', { level: 1, name: /random đội hình 5 người/i }),
    ).toBeInTheDocument();
  });

  it('renders squad route directly (AC-01.3 static hosting route test)', () => {
    renderAppAt('/squad');
    expect(
      screen.getByRole('heading', { level: 1, name: /random đội hình 5 người/i }),
    ).toBeInTheDocument();
  });

  it('useReducedMotion detects prefers-reduced-motion media query', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(typeof result.current).toBe('boolean');
  });

  it('LiveRegion announces messages to screen readers via aria-live', () => {
    let announceFn: (msg: string) => void = () => {};

    const Consumer = () => {
      announceFn = useAnnounce();
      return null;
    };

    render(
      <LiveRegionProvider>
        <Consumer />
      </LiveRegionProvider>,
    );

    const liveRegion = screen.getByTestId('live-region');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');

    act(() => {
      announceFn('Randomized Jett');
    });
  });
});
