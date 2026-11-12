import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';

export const NotFoundPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="font-display font-black text-7xl text-val-red tracking-widest">
        404
      </span>
      <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-ink mt-4">
        {t('common.empty')}
      </h2>
      <p className="text-sm text-ink-muted mt-2 max-w-sm">
        {t('single.empty.hint')}
      </p>
      <NavLink to="/" className="mt-6">
        <Button variant="primary">{t('nav.single')}</Button>
      </NavLink>
    </div>
  );
};
