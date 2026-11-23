import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BrandLogo } from '@/components/ui';
import { useSoundPreference } from '@/hooks/useSoundPreference';
import { playConfirmSignal, playUiClick } from '@/lib/audio/tacticalSound';
import { useI18n } from '@/lib/i18n';

export const Header: React.FC = () => {
  const { lang, toggleLang, t } = useI18n();
  const { soundEnabled, toggleSound } = useSoundPreference();

  const handleSoundToggle = () => {
    const enabling = !soundEnabled;
    toggleSound();
    if (enabling) playConfirmSignal();
  };

  const handleLangToggle = () => {
    playUiClick();
    toggleLang();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center h-16 px-3 sm:px-4 text-xs sm:text-sm font-tactical font-bold tracking-widest uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
      isActive
        ? 'text-val-offwhite bg-white/[0.03]'
        : 'text-ink-muted hover:text-val-offwhite hover:bg-white/[0.03]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/12 bg-bg-base/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-4 sm:gap-8">
          <NavLink
            to="/"
            className="group rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red"
            aria-label="VALORANDOM Home"
          >
            <BrandLogo size="md" />
          </NavLink>

          <nav className="flex items-center" aria-label="Main navigation">
            <NavLink to="/" end onClick={() => playUiClick()} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span>{t('nav.single')}</span>
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] bg-val-red" />
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/squad" onClick={() => playUiClick()} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span>{t('nav.squad')}</span>
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] bg-val-red" />
                  )}
                </>
              )}
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSoundToggle}
            className={`inline-flex items-center justify-center h-8 w-8 rounded-sm border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
              soundEnabled
                ? 'border-white/15 bg-bg-elevated text-val-offwhite hover:border-val-red/60 hover:text-val-red'
                : 'border-white/10 bg-bg-elevated/60 text-ink-muted hover:border-white/30 hover:text-val-offwhite'
            }`}
            aria-label={soundEnabled ? t('sound.mute') : t('sound.unmute')}
            title={soundEnabled ? t('sound.mute') : t('sound.unmute')}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={handleLangToggle}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-sm border border-white/15 bg-bg-elevated hover:border-white/35 hover:bg-surface-hi text-xs font-tactical font-bold tracking-widest text-val-offwhite transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red"
            aria-label={t('lang.switch', { lang: lang === 'vi' ? 'English' : 'Tiếng Việt' })}
          >
            <span className={lang === 'vi' ? 'text-val-red font-bold' : 'text-ink-muted'}>
              VI
            </span>
            <span className="text-white/25">/</span>
            <span className={lang === 'en' ? 'text-val-red font-bold' : 'text-ink-muted'}>
              EN
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
