import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetAudioBufferCaches } from '../audioBuffers';
import {
  getSoundEnabled,
  playConfirmSignal,
  playDataTick,
  playErrorSignal,
  playLockSignal,
  playTargetLock,
  playUiClick,
  playUiHover,
  preloadTacticalSounds,
  setSoundEnabled,
  unlockTacticalAudio,
} from '../tacticalSound';

describe('TacticalSound System', () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetAudioBufferCaches();
  });

  afterEach(() => {
    setSoundEnabled(true);
    resetAudioBufferCaches();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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
    expect(() => preloadTacticalSounds()).not.toThrow();
    expect(() => unlockTacticalAudio()).not.toThrow();
    expect(() => playUiHover()).not.toThrow();
    expect(() => playUiClick()).not.toThrow();
    expect(() => playDataTick(0.5)).not.toThrow();
    expect(() => playTargetLock()).not.toThrow();
    expect(() => playLockSignal(true)).not.toThrow();
    expect(() => playLockSignal(false)).not.toThrow();
    expect(() => playConfirmSignal()).not.toThrow();
    expect(() => playErrorSignal()).not.toThrow();
  });

  it('plays decoded CHOOSE and Confirmation slices and respects mute', async () => {
    const mockSource = {
      buffer: null as AudioBuffer | null,
      playbackRate: { value: 1 },
      connect: vi.fn(),
      start: vi.fn(),
    };
    const mockOscillator = {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
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
    const createBufferSource = vi.fn(() => mockSource);
    const decodeAudioData = vi.fn(async () => ({ duration: 4 } as AudioBuffer));

    class MockAudioContext {
      currentTime = 0;
      state = 'running';
      createBufferSource = createBufferSource;
      decodeAudioData = decodeAudioData;
      createOscillator = vi.fn(() => mockOscillator);
      createGain = vi.fn(() => mockGain);
      createBiquadFilter = vi.fn(() => mockFilter);
      destination = {};
      resume = vi.fn();
    }

    vi.stubGlobal('AudioContext', MockAudioContext);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(16),
      })),
    );

    setSoundEnabled(true);
    unlockTacticalAudio();
    await vi.waitFor(() => {
      expect(decodeAudioData).toHaveBeenCalledTimes(2);
    });

    playUiHover();
    playUiClick();
    playDataTick(0.5);
    playTargetLock();
    playLockSignal(true);
    playLockSignal(false);
    playConfirmSignal();
    playErrorSignal();

    expect(mockSource.start).toHaveBeenCalledWith(0, 1.52, 0.08);
    expect(mockSource.start).toHaveBeenCalledWith(0, 2.31, 0.5);
    expect(mockSource.start).toHaveBeenCalledWith(0, 2.38, 1.42);
    expect(mockSource.start).toHaveBeenCalledWith(0, 3.95, 0.48);

    const callsBeforeMute = createBufferSource.mock.calls.length;
    setSoundEnabled(false);
    playUiHover();
    playUiClick();
    playTargetLock();
    expect(createBufferSource.mock.calls.length).toBe(callsBeforeMute);
  });
});
