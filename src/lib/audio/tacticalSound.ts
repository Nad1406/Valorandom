import {
  playBufferSlice,
  preloadAudioBuffers,
  unlockAudioBuffers,
} from './audioBuffers';
import { scheduleTone, withSynthContext } from './synthFallback';

const SOUND_STORAGE_KEY = 'valorandom_sound_enabled';
const VOLUME_STORAGE_KEY = 'valorandom_sound_volume';
const DEFAULT_VOLUME = 0.8;

function clampUnit(val: number): number {
  if (Number.isNaN(val)) return DEFAULT_VOLUME;
  if (val < 0) return 0;
  if (val > 1) return 1;
  return val;
}

export function getSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(SOUND_STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
    window.dispatchEvent(
      new CustomEvent<boolean>('valorandom-sound-change', { detail: enabled }),
    );
  } catch {
    // No-op on storage quota or access restriction
  }
}

export function getSoundVolume(): number {
  if (typeof window === 'undefined') return DEFAULT_VOLUME;
  try {
    const raw = window.localStorage.getItem(VOLUME_STORAGE_KEY);
    if (raw === null) return DEFAULT_VOLUME;
    return clampUnit(Number(raw));
  } catch {
    return DEFAULT_VOLUME;
  }
}

export function setSoundVolume(volume: number): void {
  if (typeof window === 'undefined') return;
  const clamped = clampUnit(volume);
  try {
    window.localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
    window.dispatchEvent(
      new CustomEvent<number>('valorandom-volume-change', { detail: clamped }),
    );
  } catch {
    // No-op on storage quota or access restriction
  }
}

function getEffectiveVolume(): number {
  if (!getSoundEnabled()) return 0;
  return getSoundVolume();
}

export function preloadTacticalSounds(): void {
  if (!getSoundEnabled()) return;
  preloadAudioBuffers();
}

export function unlockTacticalAudio(): void {
  if (!getSoundEnabled()) return;
  unlockAudioBuffers();
}

/** Plays the crisp Valorant CHOOSE hover tick when hovering interactive UI elements. */
export function playUiHover(): void {
  const vol = getEffectiveVolume();
  if (vol <= 0) return;
  try {
    playBufferSlice('choose', {
      offset: 1.52,
      duration: 0.08,
      gain: 3.6 * vol,
      requireRunning: true,
    });
  } catch {
    // Graceful no-op in headless/restricted test environments
  }
}

/** Plays the Valorant CHOOSE selection sound when clicking buttons, tabs, or filters. */
export function playUiClick(): void {
  const vol = getEffectiveVolume();
  if (vol <= 0) return;
  try {
    if (playBufferSlice('choose', { offset: 2.31, duration: 0.5, gain: 2.6 * vol })) return;
  } catch {
    // Fall back to synthesized switch click below
  }
  withSynthContext(true, (ctx) => {
    scheduleTone(ctx, {
      type: 'triangle',
      startFreq: 1750,
      endFreq: 980,
      duration: 0.022,
      peakGain: 0.045 * vol,
      filterFreq: 1400,
      filterType: 'highpass',
    });
  });
}

/** Plays the CHOOSE tick pulse scaled by roulette scan progress. */
export function playDataTick(progress = 0): void {
  const vol = getEffectiveVolume();
  if (vol <= 0) return;
  const clamped = clampUnit(progress);
  try {
    if (
      playBufferSlice('choose', {
        offset: 1.52,
        duration: 0.08,
        gain: 3.0 * vol,
        playbackRate: 0.95 + clamped * 0.35,
      })
    ) {
      return;
    }
  } catch {
    // Fall back to synthesized telemetry blip below
  }
  withSynthContext(true, (ctx) => {
    const baseFreq = 880 + clamped * 800;
    scheduleTone(ctx, {
      type: 'triangle',
      startFreq: baseFreq,
      endFreq: baseFreq * 1.18,
      duration: 0.026,
      peakGain: 0.06 * vol,
      filterFreq: baseFreq * 1.2,
      filterType: 'bandpass',
    });
  });
}

/** Plays the Valorant Confirmation audio when a random draw resolves. */
export function playTargetLock(): void {
  const vol = getEffectiveVolume();
  if (vol <= 0) return;
  try {
    if (playBufferSlice('confirmation', { offset: 2.38, duration: 1.42, gain: 5.2 * vol })) return;
  } catch {
    // Fall back to synthesized lock chord below
  }
  withSynthContext(true, (ctx) => {
    scheduleTone(ctx, { type: 'triangle', startFreq: 587.33, duration: 0.14, peakGain: 0.075 * vol });
    scheduleTone(ctx, { type: 'sine', startFreq: 880, delay: 0.035, duration: 0.15, peakGain: 0.075 * vol });
  });
}

/** Plays the CHOOSE lock/unlock burst for Squad Lobby agent locks. */
export function playLockSignal(locked: boolean): void {
  const vol = getEffectiveVolume();
  if (vol <= 0) return;
  try {
    const slice = locked
      ? { offset: 3.95, duration: 0.48, gain: 2.8 * vol, playbackRate: 1.06 }
      : { offset: 2.31, duration: 0.35, gain: 2.2 * vol, playbackRate: 0.88 };
    if (playBufferSlice('choose', slice)) return;
  } catch {
    // Fall back to synthesized lock tone below
  }
  withSynthContext(true, (ctx) => {
    scheduleTone(ctx, {
      type: 'triangle',
      startFreq: locked ? 660 : 880,
      endFreq: locked ? 990 : 520,
      duration: 0.085,
      peakGain: 0.065 * vol,
    });
  });
}

/** Plays the Confirmation chime for Share Copy Text and sound unmute feedback. */
export function playConfirmSignal(): void {
  const vol = getEffectiveVolume();
  if (vol <= 0) return;
  try {
    if (
      playBufferSlice('confirmation', {
        offset: 2.38,
        duration: 0.9,
        gain: 3.8 * vol,
        playbackRate: 1.05,
      })
    ) {
      return;
    }
  } catch {
    // Fall back to synthesized confirmation blip below
  }
  withSynthContext(true, (ctx) => {
    scheduleTone(ctx, { type: 'sine', startFreq: 880, duration: 0.045, peakGain: 0.06 * vol });
    scheduleTone(ctx, { type: 'triangle', startFreq: 1318.5, delay: 0.045, duration: 0.065, peakGain: 0.07 * vol });
  });
}

/** Low digital rejection double-pulse for validation/clipboard errors. */
export function playErrorSignal(): void {
  const vol = getEffectiveVolume();
  if (vol <= 0) return;
  withSynthContext(true, (ctx) => {
    scheduleTone(ctx, {
      type: 'sawtooth',
      startFreq: 210,
      endFreq: 160,
      duration: 0.055,
      peakGain: 0.045 * vol,
      filterFreq: 600,
      filterType: 'lowpass',
    });
    scheduleTone(ctx, {
      type: 'sawtooth',
      startFreq: 185,
      endFreq: 140,
      delay: 0.07,
      duration: 0.07,
      peakGain: 0.045 * vol,
      filterFreq: 550,
      filterType: 'lowpass',
    });
  });
}
