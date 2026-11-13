import React from 'react';
import { useI18n } from '@/lib/i18n';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="relative w-full border-t border-white/10 bg-[#0B1219]/95 py-6 mt-auto">
      {/* Tactical subtle corner accents */}
      <span
        className="absolute top-2 left-3 font-mono text-[10px] text-white/20 select-none"
        aria-hidden="true"
      >
        +
      </span>
      <span
        className="absolute top-2 right-3 font-mono text-[10px] text-white/20 select-none"
        aria-hidden="true"
      >
        +
      </span>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <div className="flex items-center gap-1.5 font-tactical tracking-wider text-sm">
          <span>{t('footer.createdBy')}</span>
          <a
            href="https://github.com/Nad1406"
            target="_blank"
            rel="noopener noreferrer"
            className="font-tactical font-bold tracking-widest text-val-offwhite uppercase transition-colors hover:text-val-red"
          >
            Nad1406
          </a>
        </div>

        <p className="text-center sm:text-right text-[11px] font-sans tracking-wide text-white/40">
          {t('footer.disclaimer')}
        </p>
      </div>
    </footer>
  );
};
