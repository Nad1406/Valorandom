import React from 'react';
import { dataMeta } from '@/data';
import { useI18n } from '@/lib/i18n';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="w-full border-t border-line bg-bg-elevated/50 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span>
            {t('footer.dataFrom')}{' '}
            <a
              href="https://valorant-api.com"
              target="_blank"
              rel="noreferrer"
              className="text-ink hover:text-val-teal transition-colors underline"
            >
              valorant-api.com
            </a>
          </span>
          <span className="hidden sm:inline text-line">•</span>
          <span>{t('footer.updatedAt', { date: dataMeta.generatedAt })}</span>
          <span className="hidden sm:inline text-line">•</span>
          <span className="font-mono text-[11px] text-ink-muted/80">
            {dataMeta.dataVersion}
          </span>
        </div>

        <p className="text-center sm:text-right text-[11px] max-w-md text-ink-muted/70">
          {t('footer.disclaimer')}
        </p>
      </div>
    </footer>
  );
};
