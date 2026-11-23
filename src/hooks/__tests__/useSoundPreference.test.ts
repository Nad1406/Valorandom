import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSoundPreference } from '../useSoundPreference';
import { setSoundEnabled, setSoundVolume } from '@/lib/audio/tacticalSound';

describe('useSoundPreference hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setSoundEnabled(true);
    setSoundVolume(0.8);
  });

  it('initializes with soundEnabled true and volume 0.8 by default', () => {
    const { result } = renderHook(() => useSoundPreference());
    expect(result.current.soundEnabled).toBe(true);
    expect(result.current.volume).toBe(0.8);
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

  it('updates volume and syncs mute state at 0%', () => {
    const { result } = renderHook(() => useSoundPreference());

    act(() => {
      result.current.setVolume(0);
    });
    expect(result.current.volume).toBe(0);
    expect(result.current.soundEnabled).toBe(false);

    act(() => {
      result.current.setVolume(0.45);
    });
    expect(result.current.volume).toBe(0.45);
    expect(result.current.soundEnabled).toBe(true);
  });
});
