import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  playUiHover,
  preloadTacticalSounds,
  unlockTacticalAudio,
} from '@/lib/audio/tacticalSound';
import { Footer } from './Footer';
import { Header } from './Header';
import { LiveRegionProvider } from './LiveRegion';

const INTERACTIVE_SELECTOR =
  'button:not(:disabled), a[href], [role="tab"], [role="checkbox"], [role="switch"], select:not(:disabled)';
const HOVER_COOLDOWN_MS = 45;

export const PageShell: React.FC = () => {
  useEffect(() => {
    preloadTacticalSounds();

    let lastHovered: Element | null = null;
    let lastHoverTime = 0;

    const handleUnlock = () => unlockTacticalAudio();

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const target = event.target as Element | null;
      const interactive = target?.closest(INTERACTIVE_SELECTOR) ?? null;

      if (!interactive) {
        lastHovered = null;
        return;
      }
      if (interactive === lastHovered) return;

      const now = Date.now();
      lastHovered = interactive;
      if (now - lastHoverTime < HOVER_COOLDOWN_MS) return;
      lastHoverTime = now;
      playUiHover();
    };

    document.addEventListener('pointerdown', handleUnlock, { passive: true });
    document.addEventListener('keydown', handleUnlock, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', handleUnlock);
      document.removeEventListener('keydown', handleUnlock);
      document.removeEventListener('pointerover', handlePointerOver);
    };
  }, []);

  return (
    <LiveRegionProvider>
      <div className="min-h-screen flex flex-col bg-bg-base bg-tactical-grid text-ink selection:bg-val-red selection:text-white w-full overflow-x-hidden">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LiveRegionProvider>
  );
};
