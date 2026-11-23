import React from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

export const NotFoundPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="border border-white/12 bg-bg-elevated/95 p-10 max-w-md w-full clip-corner-tl">
        <span className="font-display font-black text-7xl text-val-red tracking-wider leading-none">
          404
        </span>
        <h2 className="font-display font-black text-3xl uppercase tracking-wide text-val-offwhite mt-3">
          {t('common.empty')}
        </h2>
        <p className="text-sm text-ink-muted mt-2 font-sans leading-relaxed">
          {t('single.empty.hint')}
        </p>
        <NavLink to="/" className="val-btn-match mt-6 inline-flex text-sm clip-tactical">
          {t('nav.single')}
        </NavLink>
      </div>
    </div>
  );
};
