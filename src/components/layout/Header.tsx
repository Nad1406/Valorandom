import React from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

export const Header: React.FC = () => {
  const { lang, toggleLang, t } = useI18n();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-display tracking-wider uppercase transition-colors rounded-md ${
      isActive
        ? 'text-val-red bg-surface-hi font-bold border-b-2 border-val-red'
        : 'text-ink-muted hover:text-ink hover:bg-surface'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-bg-base/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red rounded-lg"
          >
            <div className="w-8 h-8 rounded bg-val-red flex items-center justify-center font-display font-black text-white text-lg tracking-tighter shadow-glow transition-transform group-hover:scale-105">
              V
            </div>
            <span className="font-display font-extrabold text-xl tracking-widest text-ink uppercase">
              VALO<span className="text-val-red">RANDOM</span>
            </span>
          </NavLink>

          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
            <NavLink to="/" end className={navLinkClass}>
              {t('nav.single')}
            </NavLink>
            <NavLink to="/squad" className={navLinkClass}>
              {t('nav.squad')}
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-hi text-xs font-display font-semibold tracking-wider text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red"
            aria-label={t('lang.switch', { lang: lang === 'vi' ? 'English' : 'Tiếng Việt' })}
          >
            <span className={lang === 'vi' ? 'text-val-red font-bold' : 'text-ink-muted'}>
              VI
            </span>
            <span className="text-line">/</span>
            <span className={lang === 'en' ? 'text-val-red font-bold' : 'text-ink-muted'}>
              EN
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
