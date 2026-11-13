import React from 'react';
import { NavLink } from 'react-router-dom';
import { BrandLogo } from '@/components/ui';
import { useI18n } from '@/lib/i18n';

export const Header: React.FC = () => {
  const { lang, toggleLang, t } = useI18n();

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

        <div className="flex items-center gap-3">
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
