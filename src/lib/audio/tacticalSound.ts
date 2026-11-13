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
    const stored = window.localStorage.getItem(SOUND_STORAGE_KEY);
    return stored !== 'false';
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
    // no-op on storage quota or access restriction
  }
}

function clampProgress(val: number): number {
  if (val < 0) return 0;
  if (val > 1) return 1;
  return val;
}

export function playDataTick(progress = 0): void {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const clampedProgress = clampProgress(progress);
    const freq = 800 + clampedProgress * 500;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 0.025);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {
    // Graceful no-op in headless/restricted test environments
  }
}

export function playTargetLock(): void {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Tone 1: Initial digital ping (659Hz / E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.09, now + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.065);

    // Tone 2: Tactical confirmation tone (1046Hz -> 1318Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1046.5, now + 0.035);
    osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12);
    gain2.gain.setValueAtTime(0.001, now + 0.035);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.045);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.035);
    osc2.stop(now + 0.16);

    // Tone 3: Soft mechanical latch thud (180Hz -> 60Hz)
    const oscLatch = ctx.createOscillator();
    const gainLatch = ctx.createGain();
    oscLatch.type = 'sine';
    oscLatch.frequency.setValueAtTime(180, now);
    oscLatch.frequency.exponentialRampToValueAtTime(60, now + 0.03);
    gainLatch.gain.setValueAtTime(0.05, now);
    gainLatch.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
    oscLatch.connect(gainLatch);
    gainLatch.connect(ctx.destination);
    oscLatch.start(now);
    oscLatch.stop(now + 0.04);
  } catch {
    // Graceful no-op in headless/restricted test environments
  }
}
