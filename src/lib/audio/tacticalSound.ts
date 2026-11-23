import {
  playBufferSlice,
  preloadAudioBuffers,
  unlockAudioBuffers,
} from './audioBuffers';
import { scheduleTone, withSynthContext } from './synthFallback';

const SOUND_STORAGE_KEY = 'valorandom_sound_enabled';

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

export function preloadTacticalSounds(): void {
  if (!getSoundEnabled()) return;
  preloadAudioBuffers();
}

export function unlockTacticalAudio(): void {
  if (!getSoundEnabled()) return;
  unlockAudioBuffers();
}

function clampProgress(val: number): number {
  if (val < 0) return 0;
  if (val > 1) return 1;
  return val;
}

/** Plays the crisp Valorant CHOOSE hover tick when hovering interactive UI elements. */
export function playUiHover(): void {
  if (!getSoundEnabled()) return;
  try {
    playBufferSlice('choose', {
      offset: 1.52,
      duration: 0.08,
      gain: 3.6,
      requireRunning: true,
    });
  } catch {
    // Graceful no-op in headless/restricted test environments
  }
}

/** Plays the Valorant CHOOSE selection sound when clicking buttons, tabs, or filters. */
export function playUiClick(): void {
  if (!getSoundEnabled()) return;
  try {
    if (playBufferSlice('choose', { offset: 2.31, duration: 0.5, gain: 2.6 })) return;
  } catch {
    // Fall back to synthesized switch click below
  }
  withSynthContext(true, (ctx) => {
    scheduleTone(ctx, {
      type: 'triangle',
      startFreq: 1750,
      endFreq: 980,
      duration: 0.022,
      peakGain: 0.045,
      filterFreq: 1400,
      filterType: 'highpass',
    });
  });
}

/** Plays the CHOOSE tick pulse scaled by roulette scan progress. */
export function playDataTick(progress = 0): void {
  if (!getSoundEnabled()) return;
  const clamped = clampProgress(progress);
  try {
    if (
      playBufferSlice('choose', {
        offset: 1.52,
        duration: 0.08,
        gain: 3.0,
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
      peakGain: 0.06,
      filterFreq: baseFreq * 1.2,
      filterType: 'bandpass',
    });
  });
}

/** Plays the Valorant Confirmation audio when a random draw resolves. */
export function playTargetLock(): void {
  if (!getSoundEnabled()) return;
  try {
    if (playBufferSlice('confirmation', { offset: 2.38, duration: 1.42, gain: 5.2 })) return;
  } catch {
    // Fall back to synthesized lock chord below
  }
  withSynthContext(true, (ctx) => {
    scheduleTone(ctx, { type: 'triangle', startFreq: 587.33, duration: 0.14, peakGain: 0.075 });
    scheduleTone(ctx, { type: 'sine', startFreq: 880, delay: 0.035, duration: 0.15, peakGain: 0.075 });
  });
}

/** Plays the CHOOSE lock/unlock burst for Squad Lobby agent locks. */
export function playLockSignal(locked: boolean): void {
  if (!getSoundEnabled()) return;
  try {
    const slice = locked
      ? { offset: 3.95, duration: 0.48, gain: 2.8, playbackRate: 1.06 }
      : { offset: 2.31, duration: 0.35, gain: 2.2, playbackRate: 0.88 };
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
      peakGain: 0.065,
    });
  });
}

/** Plays the Confirmation chime for Share Copy Text and sound unmute feedback. */
export function playConfirmSignal(): void {
  if (!getSoundEnabled()) return;
  try {
    if (
      playBufferSlice('confirmation', {
        offset: 2.38,
        duration: 0.9,
        gain: 3.8,
        playbackRate: 1.05,
      })
    ) {
      return;
    }
  } catch {
    // Fall back to synthesized confirmation blip below
  }
  withSynthContext(true, (ctx) => {
    scheduleTone(ctx, { type: 'sine', startFreq: 880, duration: 0.045, peakGain: 0.06 });
    scheduleTone(ctx, { type: 'triangle', startFreq: 1318.5, delay: 0.045, duration: 0.065, peakGain: 0.07 });
  });
}

/** Low digital rejection double-pulse for validation/clipboard errors. */
export function playErrorSignal(): void {
  withSynthContext(getSoundEnabled(), (ctx) => {
    scheduleTone(ctx, {
      type: 'sawtooth',
      startFreq: 210,
      endFreq: 160,
      duration: 0.055,
      peakGain: 0.045,
      filterFreq: 600,
      filterType: 'lowpass',
    });
    scheduleTone(ctx, {
      type: 'sawtooth',
      startFreq: 185,
      endFreq: 140,
      delay: 0.07,
      duration: 0.07,
      peakGain: 0.045,
      filterFreq: 550,
      filterType: 'lowpass',
    });
  });
}
