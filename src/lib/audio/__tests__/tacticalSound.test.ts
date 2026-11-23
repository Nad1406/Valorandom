import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getSoundEnabled,
  playConfirmSignal,
  playDataTick,
  playErrorSignal,
  playLockSignal,
  playTargetLock,
  playUiClick,
  setSoundEnabled,
} from '../tacticalSound';

describe('TacticalSound System', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    setSoundEnabled(true);
    vi.restoreAllMocks();
  });

  it('getSoundEnabled defaults to true', () => {
    expect(getSoundEnabled()).toBe(true);
  });

  it('setSoundEnabled updates state and dispatches custom event', () => {
    const handler = vi.fn();
    window.addEventListener('valorandom-sound-change', handler);

    setSoundEnabled(false);
    expect(getSoundEnabled()).toBe(false);
    expect(handler).toHaveBeenCalled();

    window.removeEventListener('valorandom-sound-change', handler);
  });

  it('safely no-ops all SFX in headless environment without AudioContext', () => {
    expect(() => playUiClick()).not.toThrow();
    expect(() => playDataTick(0.5)).not.toThrow();
    expect(() => playTargetLock()).not.toThrow();
    expect(() => playLockSignal(true)).not.toThrow();
    expect(() => playLockSignal(false)).not.toThrow();
    expect(() => playConfirmSignal()).not.toThrow();
    expect(() => playErrorSignal()).not.toThrow();
  });

  it('plays all digital signal SFX via mocked AudioContext and respects mute', () => {
    const mockOscillator = {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    const mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    const mockFilter = {
      type: 'bandpass',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
    };

    const createOscillator = vi.fn(() => mockOscillator);

    class MockAudioContext {
      currentTime = 0;
      state = 'running';
      createOscillator = createOscillator;
      createGain = vi.fn(() => mockGain);
      createBiquadFilter = vi.fn(() => mockFilter);
      destination = {};
      resume = vi.fn();
    }

    vi.stubGlobal('AudioContext', MockAudioContext);

    setSoundEnabled(true);
    playUiClick();
    playDataTick(0.2);
    playTargetLock();
    playLockSignal(true);
    playLockSignal(false);
    playConfirmSignal();
    playErrorSignal();
    expect(createOscillator).toHaveBeenCalled();

    const callsWhenEnabled = createOscillator.mock.calls.length;
    setSoundEnabled(false);
    playUiClick();
    playDataTick(0.8);
    playTargetLock();
    expect(createOscillator.mock.calls.length).toBe(callsWhenEnabled);
  });
});
