export type SoundKey = 'choose' | 'confirmation';

export interface SlicePlayOptions {
  offset: number;
  duration: number;
  gain: number;
  playbackRate?: number;
  requireRunning?: boolean;
}

const SOUND_KEYS: readonly SoundKey[] = ['choose', 'confirmation'];

let audioCtxInstance: AudioContext | null = null;
const rawBytesCache = new Map<SoundKey, ArrayBuffer>();
const decodedCache = new Map<SoundKey, AudioBuffer>();
const fetchPending = new Map<SoundKey, Promise<void>>();
const decodePending = new Map<SoundKey, Promise<void>>();

export function getAudioContext(allowCreate = true): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  try {
    if (!audioCtxInstance && allowCreate) {
      audioCtxInstance = new AudioContextClass();
    }
    if (audioCtxInstance && allowCreate && audioCtxInstance.state === 'suspended') {
      void audioCtxInstance.resume();
    }
    return audioCtxInstance;
  } catch {
    return null;
  }
}

function ensureDecoded(key: SoundKey, ctx: AudioContext): void {
  if (decodedCache.has(key) || decodePending.has(key)) return;
  const bytes = rawBytesCache.get(key);
  if (!bytes || typeof ctx.decodeAudioData !== 'function') return;

  const task = ctx
    .decodeAudioData(bytes.slice(0))
    .then((decoded) => {
      decodedCache.set(key, decoded);
    })
    .catch(() => {
      // Ignore decode failures in headless/unsupported codecs
    })
    .finally(() => {
      decodePending.delete(key);
    });

  decodePending.set(key, task);
}

function fetchSoundFile(key: SoundKey): void {
  if (rawBytesCache.has(key) || fetchPending.has(key)) return;
  if (typeof window === 'undefined' || typeof fetch !== 'function') return;

  const metaEnv = (import.meta as { env?: { BASE_URL?: string } }).env;
  const base = metaEnv?.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const url = `${normalizedBase}sounds/${key}.mp3`;

  const task = fetch(url)
    .then((res) => (res.ok ? res.arrayBuffer() : null))
    .then((buf) => {
      if (!buf) return;
      rawBytesCache.set(key, buf);
      if (audioCtxInstance) {
        ensureDecoded(key, audioCtxInstance);
      }
    })
    .catch(() => {
      // Safe no-op when offline cache/test server rejects fetch
    })
    .finally(() => {
      fetchPending.delete(key);
    });

  fetchPending.set(key, task);
}

export function preloadAudioBuffers(): void {
  for (const key of SOUND_KEYS) {
    fetchSoundFile(key);
    if (audioCtxInstance) {
      ensureDecoded(key, audioCtxInstance);
    }
  }
}

export function unlockAudioBuffers(): void {
  const ctx = getAudioContext(true);
  if (ctx) {
    preloadAudioBuffers();
  }
}

export function playBufferSlice(key: SoundKey, opts: SlicePlayOptions): boolean {
  const ctx = getAudioContext(!opts.requireRunning);
  if (!ctx) return false;
  if (opts.requireRunning && ctx.state !== 'running') return false;

  const buffer = decodedCache.get(key);
  if (!buffer) {
    preloadAudioBuffers();
    return false;
  }
  if (typeof ctx.createBufferSource !== 'function') return false;

  const rate = opts.playbackRate ?? 1;
  const playDur = opts.duration / (rate > 0 ? rate : 1);
  const now = ctx.currentTime;
  const fadeOutStart = now + (playDur > 0.025 ? playDur - 0.015 : playDur * 0.5);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  if (source.playbackRate) {
    source.playbackRate.value = rate;
  }

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(opts.gain, now + 0.005);
  gainNode.gain.setValueAtTime(opts.gain, fadeOutStart);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + playDur);

  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(now, opts.offset, opts.duration);
  return true;
}

export function resetAudioBufferCaches(): void {
  rawBytesCache.clear();
  decodedCache.clear();
  fetchPending.clear();
  decodePending.clear();
  audioCtxInstance = null;
}
