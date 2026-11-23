const SOUND_STORAGE_KEY = 'valorandom_sound_enabled';

let audioCtxInstance: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  try {
    if (!audioCtxInstance) {
      audioCtxInstance = new AudioContextClass();
    }
    if (audioCtxInstance.state === 'suspended') {
      void audioCtxInstance.resume();
    }
    return audioCtxInstance;
  } catch {
    return null;
  }
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

function clampProgress(val: number): number {
  if (val < 0) return 0;
  if (val > 1) return 1;
  return val;
}

interface ToneOptions {
  type: OscillatorType;
  startFreq: number;
  endFreq?: number;
  delay?: number;
  duration: number;
  peakGain: number;
  filterFreq?: number;
  filterType?: BiquadFilterType;
}

function scheduleTone(ctx: AudioContext, opts: ToneOptions): void {
  const start = ctx.currentTime + (opts.delay ?? 0);
  const stop = start + opts.duration;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = opts.type;
  osc.frequency.setValueAtTime(opts.startFreq, start);
  if (opts.endFreq !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(opts.endFreq, stop);
  }

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(opts.peakGain, start + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, stop);

  if (opts.filterFreq && typeof ctx.createBiquadFilter === 'function') {
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType ?? 'bandpass';
    filter.frequency.setValueAtTime(opts.filterFreq, start);
    osc.connect(filter);
    filter.connect(gain);
  } else {
    osc.connect(gain);
  }

  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(stop + 0.005);
}

function withSoundContext(fn: (ctx: AudioContext) => void): void {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    fn(ctx);
  } catch {
    // Graceful no-op in headless/restricted test environments
  }
}

/** Crisp Valorant HUD micro-switch click for tabs, filters, and controls. */
export function playUiClick(): void {
  withSoundContext((ctx) => {
    scheduleTone(ctx, {
      type: 'triangle',
      startFreq: 1750,
      endFreq: 980,
      duration: 0.022,
      peakGain: 0.045,
      filterFreq: 1400,
      filterType: 'highpass',
    });
    scheduleTone(ctx, {
      type: 'sine',
      startFreq: 320,
      endFreq: 140,
      duration: 0.018,
      peakGain: 0.03,
    });
  });
}

/** Digital telemetry scanner pulse synchronized with roulette ticks. */
export function playDataTick(progress = 0): void {
  withSoundContext((ctx) => {
    const baseFreq = 880 + clampProgress(progress) * 800;
    scheduleTone(ctx, {
      type: 'triangle',
      startFreq: baseFreq,
      endFreq: baseFreq * 1.18,
      duration: 0.026,
      peakGain: 0.065,
      filterFreq: baseFreq * 1.2,
      filterType: 'bandpass',
    });
    scheduleTone(ctx, {
      type: 'sine',
      startFreq: baseFreq * 1.5,
      duration: 0.018,
      peakGain: 0.025,
    });
  });
}

/** Valorant Agent Locked / Match Found crystalline digital signal. */
export function playTargetLock(): void {
  withSoundContext((ctx) => {
    // Tight mechanical sub-impact
    scheduleTone(ctx, {
      type: 'sine',
      startFreq: 135,
      endFreq: 52,
      duration: 0.055,
      peakGain: 0.08,
    });
    // Crisp metallic transient ping
    scheduleTone(ctx, {
      type: 'triangle',
      startFreq: 1760,
      endFreq: 1320,
      duration: 0.04,
      peakGain: 0.055,
      filterFreq: 1500,
      filterType: 'highpass',
    });
    // Staggered D5 -> A5 -> D6 tactical chord
    scheduleTone(ctx, { type: 'triangle', startFreq: 587.33, duration: 0.14, peakGain: 0.075 });
    scheduleTone(ctx, { type: 'sine', startFreq: 880, delay: 0.035, duration: 0.15, peakGain: 0.075 });
    scheduleTone(ctx, {
      type: 'triangle',
      startFreq: 1174.66,
      delay: 0.065,
      duration: 0.16,
      peakGain: 0.08,
    });
  });
}

/** Agent lock/unlock chime for Squad Lobby banners. */
export function playLockSignal(locked: boolean): void {
  withSoundContext((ctx) => {
    if (locked) {
      scheduleTone(ctx, { type: 'sine', startFreq: 150, endFreq: 65, duration: 0.035, peakGain: 0.06 });
      scheduleTone(ctx, { type: 'triangle', startFreq: 660, endFreq: 990, duration: 0.09, peakGain: 0.07 });
    } else {
      scheduleTone(ctx, { type: 'triangle', startFreq: 880, endFreq: 520, duration: 0.075, peakGain: 0.06 });
    }
  });
}

/** Clean teal confirmation double-blip for share copy & unmute. */
export function playConfirmSignal(): void {
  withSoundContext((ctx) => {
    scheduleTone(ctx, { type: 'sine', startFreq: 880, duration: 0.045, peakGain: 0.06 });
    scheduleTone(ctx, { type: 'triangle', startFreq: 1318.5, delay: 0.045, duration: 0.065, peakGain: 0.07 });
  });
}

/** Low digital rejection double-pulse for validation/clipboard errors. */
export function playErrorSignal(): void {
  withSoundContext((ctx) => {
    scheduleTone(ctx, { type: 'sawtooth', startFreq: 210, endFreq: 160, duration: 0.055, peakGain: 0.045, filterFreq: 600, filterType: 'lowpass' });
    scheduleTone(ctx, { type: 'sawtooth', startFreq: 185, endFreq: 140, delay: 0.07, duration: 0.07, peakGain: 0.045, filterFreq: 550, filterType: 'lowpass' });
  });
}
