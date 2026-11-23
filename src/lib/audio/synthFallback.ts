import { getAudioContext } from './audioBuffers';

export interface ToneOptions {
  type: OscillatorType;
  startFreq: number;
  endFreq?: number;
  delay?: number;
  duration: number;
  peakGain: number;
  filterFreq?: number;
  filterType?: BiquadFilterType;
}

export function scheduleTone(ctx: AudioContext, opts: ToneOptions): void {
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

export function withSynthContext(enabled: boolean, fn: (ctx: AudioContext) => void): void {
  if (!enabled) return;
  const ctx = getAudioContext(true);
  if (!ctx) return;
  try {
    fn(ctx);
  } catch {
    // Graceful no-op in headless/restricted test environments
  }
}
