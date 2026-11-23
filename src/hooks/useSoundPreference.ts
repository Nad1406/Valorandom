import { useCallback, useEffect, useState } from 'react';
import {
  getSoundEnabled,
  getSoundVolume,
  setSoundEnabled,
  setSoundVolume,
} from '@/lib/audio/tacticalSound';

export function useSoundPreference() {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => getSoundEnabled());
  const [volume, setVolumeState] = useState<number>(() => getSoundVolume());

  useEffect(() => {
    const onSoundChange = (e: Event) => {
      setSoundEnabledState((e as CustomEvent<boolean>).detail);
    };
    const onVolumeChange = (e: Event) => {
      setVolumeState((e as CustomEvent<number>).detail);
    };
    window.addEventListener('valorandom-sound-change', onSoundChange);
    window.addEventListener('valorandom-volume-change', onVolumeChange);
    return () => {
      window.removeEventListener('valorandom-sound-change', onSoundChange);
      window.removeEventListener('valorandom-volume-change', onVolumeChange);
    };
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next && volume === 0) {
      setSoundVolume(0.8);
    }
  }, [soundEnabled, volume]);

  const setVolume = useCallback(
    (nextVolume: number) => {
      setSoundVolume(nextVolume);
      if (nextVolume <= 0 && soundEnabled) {
        setSoundEnabled(false);
      } else if (nextVolume > 0 && !soundEnabled) {
        setSoundEnabled(true);
      }
    },
    [soundEnabled],
  );

  return { soundEnabled, volume, toggleSound, setSoundEnabled, setVolume };
}
