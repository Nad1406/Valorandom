import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { LiveRegionProvider } from './LiveRegion';

export const PageShell: React.FC = () => {
  return (
    <LiveRegionProvider>
      <div className="min-h-screen flex flex-col bg-bg-base text-ink selection:bg-val-red selection:text-white w-full overflow-x-hidden">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LiveRegionProvider>
  );
};
