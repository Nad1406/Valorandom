import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { I18nProvider } from '@/lib/i18n';
import { router } from './router';

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
};
