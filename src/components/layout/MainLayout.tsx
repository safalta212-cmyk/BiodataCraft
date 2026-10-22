import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ResponsiveAd } from '../ads/ResponsiveAd';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isCreateRoute = pathname.startsWith('/create') || pathname.startsWith('/builder');

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans selection:bg-amber-200 selection:text-amber-900">
      <ScrollToTop />
      <Header />
      {!isCreateRoute && (
        <ResponsiveAd variant="horizontal-leaderboard" className="pt-2" />
      )}
      <main className="flex-1">{children}</main>
      {!isCreateRoute && (
        <ResponsiveAd variant="footer-banner" className="pb-2" />
      )}
      <Footer />
    </div>
  );
};

