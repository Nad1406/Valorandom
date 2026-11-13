import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSoundPreference } from '../useSoundPreference';
import { setSoundEnabled } from '@/lib/audio/tacticalSound';

describe('useSoundPreference hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setSoundEnabled(true);
  });

  it('initializes with soundEnabled true by default', () => {
    const { result } = renderHook(() => useSoundPreference());
    expect(result.current.soundEnabled).toBe(true);
  });

  it('toggles sound preference state', () => {
    const { result } = renderHook(() => useSoundPreference());

    act(() => {
      result.current.toggleSound();
    });

    expect(result.current.soundEnabled).toBe(false);

    act(() => {
      result.current.toggleSound();
    });

    expect(result.current.soundEnabled).toBe(true);
  });
});
