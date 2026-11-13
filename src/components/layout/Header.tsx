import React from 'react';
import { NavLink } from 'react-router-dom';
import { BrandLogo } from '@/components/ui';
import { useSoundPreference } from '@/hooks/useSoundPreference';
import { useI18n } from '@/lib/i18n';

export const Header: React.FC = () => {
  const { lang, toggleLang, t } = useI18n();
  const { soundEnabled, toggleSound } = useSoundPreference();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-tactical font-bold tracking-widest uppercase transition-all duration-200 ${
      isActive
        ? 'text-val-offwhite'
        : 'text-white/60 hover:text-val-offwhite hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B1219]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          <NavLink
            to="/"
            className="group rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red"
            aria-label="VALORANDOM Home"
          >
            <BrandLogo size="md" />
          </NavLink>

          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
            <NavLink to="/" end className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span>{t('nav.single')}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 sm:left-2 sm:right-2 h-0.5 bg-val-red shadow-glow" />
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/squad" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span>{t('nav.squad')}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 sm:left-2 sm:right-2 h-0.5 bg-val-red shadow-glow" />
                  )}
                </>
              )}
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleSound}
            className={`inline-flex items-center justify-center p-2 rounded border border-white/15 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
              soundEnabled
                ? 'text-val-offwhite hover:text-val-red'
                : 'text-white/30 hover:text-white/60'
            }`}
            aria-label={soundEnabled ? t('sound.mute') : t('sound.unmute')}
            title={soundEnabled ? t('sound.mute') : t('sound.unmute')}
          >
            {soundEnabled ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-2.5 9.77L7 8.5H3v7h4l4.5 4.5v-7.01zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-tactical font-bold tracking-widest text-val-offwhite transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red"
            aria-label={t('lang.switch', { lang: lang === 'vi' ? 'English' : 'Tiếng Việt' })}
          >
            <span className={lang === 'vi' ? 'text-val-red font-bold' : 'text-white/50'}>
              VI
            </span>
            <span className="text-white/20">/</span>
            <span className={lang === 'en' ? 'text-val-red font-bold' : 'text-white/50'}>
              EN
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
