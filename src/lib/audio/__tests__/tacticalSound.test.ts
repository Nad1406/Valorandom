import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getSoundEnabled,
  playDataTick,
  playTargetLock,
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

  it('playDataTick and playTargetLock safely no-op in headless environment without AudioContext', () => {
    expect(() => playDataTick(0.5)).not.toThrow();
    expect(() => playTargetLock()).not.toThrow();
  });

  it('plays sounds when mocked AudioContext is provided', () => {
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

    class MockAudioContext {
      currentTime = 0;
      state = 'running';
      createOscillator = vi.fn(() => mockOscillator);
      createGain = vi.fn(() => mockGain);
      destination = {};
      resume = vi.fn();
    }

    vi.stubGlobal('AudioContext', MockAudioContext);

    setSoundEnabled(true);
    expect(() => playDataTick(0.2)).not.toThrow();
    expect(() => playTargetLock()).not.toThrow();

    // When sound is disabled, sound methods do not play
    setSoundEnabled(false);
    expect(() => playDataTick(0.8)).not.toThrow();
  });
});
