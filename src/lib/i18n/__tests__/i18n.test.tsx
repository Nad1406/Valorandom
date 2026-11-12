import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { en, I18nProvider, useI18n, vi } from '@/lib/i18n';

describe('i18n System (AC-01.2)', () => {
  it('AC-01.2 ensures strict 1:1 key parity between Vietnamese and English dictionaries', () => {
    const viKeys = Object.keys(vi).sort();
    const enKeys = Object.keys(en).sort();
    expect(viKeys).toEqual(enKeys);
    expect(viKeys.length).toBeGreaterThanOrEqual(40);
  });

  it('interpolates placeholders correctly', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
    });

    const interpolated = result.current.t('squad.slot.defaultName', { n: 4 });
    expect(interpolated).toBe('Người chơi 4');
  });

  it('AC-01.2 switches language, updates document.documentElement.lang, and persists to localStorage', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const { lang, toggleLang, t } = useI18n();
      return (
        <div>
          <span data-testid="title">{t('nav.single')}</span>
          <span data-testid="lang">{lang}</span>
          <button type="button" onClick={toggleLang}>
            Toggle
          </button>
        </div>
      );
    };

    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    );

    expect(screen.getByTestId('title')).toHaveTextContent('Random đơn');
    expect(screen.getByTestId('lang')).toHaveTextContent('vi');
    expect(document.documentElement.lang).toBe('vi');

    await user.click(screen.getByRole('button', { name: /toggle/i }));

    expect(screen.getByTestId('title')).toHaveTextContent('Single Random');
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem('valorandom.lang')).toBe('en');
  });
});
