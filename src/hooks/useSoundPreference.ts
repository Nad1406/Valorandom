import { useEffect, useState } from 'react';
import { getSoundEnabled, setSoundEnabled } from '@/lib/audio/tacticalSound';

export function useSoundPreference() {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => getSoundEnabled());

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setSoundEnabledState(customEvent.detail);
    };
    window.addEventListener('valorandom-sound-change', handler);
    return () => {
      window.removeEventListener('valorandom-sound-change', handler);
    };
  }, []);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return { soundEnabled, toggleSound, setSoundEnabled };
}
