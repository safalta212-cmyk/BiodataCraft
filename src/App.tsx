import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AdProvider } from './context/AdContext';
import { MainLayout } from './components/layout/MainLayout';
import { analyticsService } from './services/analyticsService';
import { PageLoadingFallback } from './components/common/PageLoadingFallback';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Public Core (HomePage rendered directly for instantaneous LCP)
import { HomePage } from './pages/HomePage';

// Lazy-loaded Creation & Template Exploration Pages
const CreateBiodataPage = lazy(() =>
  import('./pages/CreateBiodataPage').then((m) => ({ default: m.CreateBiodataPage }))
);
const TemplatesPage = lazy(() =>
  import('./pages/TemplatesPage').then((m) => ({ default: m.TemplatesPage }))
);
const TemplateDetailPage = lazy(() =>
  import('./pages/TemplateDetailPage').then((m) => ({ default: m.TemplateDetailPage }))
);
const SamplesPage = lazy(() =>
  import('./pages/SamplesPage').then((m) => ({ default: m.SamplesPage }))
);

// Lazy-loaded Knowledge Base & Editorial Blog
const BlogPage = lazy(() =>
  import('./pages/BlogPage').then((m) => ({ default: m.BlogPage }))
);
const BlogPostPage = lazy(() =>
  import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage }))
);

// Lazy-loaded Support & Legal
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const RefundPolicyPage = lazy(() =>
  import('./pages/RefundPolicyPage').then((m) => ({ default: m.RefundPolicyPage }))
);
const FaqPage = lazy(() =>
  import('./pages/FaqPage').then((m) => ({ default: m.FaqPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

// Lazy-loaded High-Value Cultural & SEO Pages
const MarriageBiodataPage = lazy(() =>
  import('./pages/seo/MarriageBiodataPage').then((m) => ({ default: m.MarriageBiodataPage }))
);
const MarriageBiodataFormatPage = lazy(() =>
  import('./pages/seo/MarriageBiodataFormatPage').then((m) => ({ default: m.MarriageBiodataFormatPage }))
);
const HinduMarriageBiodataPage = lazy(() =>
  import('./pages/seo/HinduMarriageBiodataPage').then((m) => ({ default: m.HinduMarriageBiodataPage }))
);
const MuslimMarriageBiodataPage = lazy(() =>
  import('./pages/seo/MuslimMarriageBiodataPage').then((m) => ({ default: m.MuslimMarriageBiodataPage }))
);
const YadavMarriageBiodataPage = lazy(() =>
  import('./pages/seo/YadavMarriageBiodataPage').then((m) => ({ default: m.YadavMarriageBiodataPage }))
);
const MarathiBiodataPage = lazy(() =>
  import('./pages/seo/MarathiBiodataPage').then((m) => ({ default: m.MarathiBiodataPage }))
);
const BengaliMarriageBiodataPage = lazy(() =>
  import('./pages/seo/BengaliMarriageBiodataPage').then((m) => ({ default: m.BengaliMarriageBiodataPage }))
);
const KeywordLandingPage = lazy(() =>
  import('./pages/seo/KeywordLandingPage').then((m) => ({ default: m.KeywordLandingPage }))
);
const KeywordDirectoryPage = lazy(() =>
  import('./pages/seo/KeywordDirectoryPage').then((m) => ({ default: m.KeywordDirectoryPage }))
);

// Admin Authentication Infrastructure (Synchronous context provider prevents mounting race conditions)
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
const AdminLoginPage = lazy(() =>
  import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminOverviewPage = lazy(() =>
  import('./pages/admin/AdminOverviewPage').then((m) => ({ default: m.AdminOverviewPage }))
);
const AdminTemplatesPage = lazy(() =>
  import('./pages/admin/AdminTemplatesPage').then((m) => ({ default: m.AdminTemplatesPage }))
);
const AdminCategoriesPage = lazy(() =>
  import('./pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage }))
);
const AdminAnalyticsPage = lazy(() =>
  import('./pages/admin/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage }))
);
const AdminBlogPage = lazy(() =>
  import('./pages/admin/AdminBlogPage').then((m) => ({ default: m.AdminBlogPage }))
);
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
);
const AdminAdsPage = lazy(() =>
  import('./pages/admin/AdminAdsPage').then((m) => ({ default: m.AdminAdsPage }))
);
const AdminMessagesPage = lazy(() =>
  import('./pages/admin/AdminMessagesPage').then((m) => ({ default: m.AdminMessagesPage }))
);

const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    analyticsService.trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};

export function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AdProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <RouteTracker />
              <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            {/* Public Routes with Global MainLayout (Header, Footer, Toast Stack) */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <HomePage language="en" />
                </MainLayout>
              }
            />
            <Route
              path="/create"
              element={
                <MainLayout>
                  <CreateBiodataPage />
                </MainLayout>
              }
            />
            <Route
              path="/templates"
              element={
                <MainLayout>
                  <TemplatesPage />
                </MainLayout>
              }
            />
            <Route
              path="/templates/:slug"
              element={
                <MainLayout>
                  <TemplateDetailPage />
                </MainLayout>
              }
            />
            <Route
              path="/samples"
              element={
                <MainLayout>
                  <SamplesPage language="en" />
                </MainLayout>
              }
            />
            <Route
              path="/about"
              element={
                <MainLayout>
                  <AboutPage />
                </MainLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <MainLayout>
                  <ContactPage />
                </MainLayout>
              }
            />
            <Route
              path="/blog"
              element={
                <MainLayout>
                  <BlogPage />
                </MainLayout>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <MainLayout>
                  <BlogPostPage />
                </MainLayout>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <MainLayout>
                  <PrivacyPolicyPage />
                </MainLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <MainLayout>
                  <TermsPage />
                </MainLayout>
              }
            />
            <Route
              path="/refund-policy"
              element={
                <MainLayout>
                  <RefundPolicyPage />
                </MainLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <MainLayout>
                  <FaqPage language="en" />
                </MainLayout>
              }
            />

            {/* SEO Pillars & Community Matrimonial Guides */}
            <Route
              path="/marriage-biodata"
              element={
                <MainLayout>
                  <MarriageBiodataPage />
                </MainLayout>
              }
            />
            <Route
              path="/marriage-biodata-format"
              element={
                <MainLayout>
                  <MarriageBiodataFormatPage />
                </MainLayout>
              }
            />
            <Route
              path="/hindu-marriage-biodata"
              element={
                <MainLayout>
                  <HinduMarriageBiodataPage />
                </MainLayout>
              }
            />
            <Route
              path="/muslim-marriage-biodata"
              element={
                <MainLayout>
                  <MuslimMarriageBiodataPage />
                </MainLayout>
              }
            />
            <Route
              path="/yadav-marriage-biodata"
              element={
                <MainLayout>
                  <YadavMarriageBiodataPage />
                </MainLayout>
              }
            />
            <Route
              path="/marathi-biodata"
              element={
                <MainLayout>
                  <MarathiBiodataPage />
                </MainLayout>
              }
            />
            <Route
              path="/bengali-marriage-biodata"
              element={
                <MainLayout>
                  <BengaliMarriageBiodataPage />
                </MainLayout>
              }
            />

            {/* 500+ Programmatic SEO Keyword Pages & Directory */}
            <Route
              path="/biodata"
              element={
                <MainLayout>
                  <KeywordDirectoryPage />
                </MainLayout>
              }
            />
            <Route path="/topics" element={<Navigate to="/biodata" replace />} />
            <Route
              path="/biodata/:slug"
              element={
                <MainLayout>
                  <KeywordLandingPage />
                </MainLayout>
              }
            />
            <Route
              path="/topic/:slug"
              element={
                <MainLayout>
                  <KeywordLandingPage />
                </MainLayout>
              }
            />
            <Route
              path="/topics/:slug"
              element={
                <MainLayout>
                  <KeywordLandingPage />
                </MainLayout>
              }
            />

            {/* Backward compatibility route aliases */}
            <Route path="/builder" element={<Navigate to="/create" replace />} />
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />

            {/* Admin Routes with Lazy Auth Context */}
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminLoginPage />
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminProtectedRoute>
                    <AdminOverviewPage />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/admin/templates"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminProtectedRoute requiredPermission="manage_templates">
                    <AdminTemplatesPage />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminProtectedRoute requiredPermission="manage_categories">
                    <AdminCategoriesPage />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminProtectedRoute requiredPermission="view_analytics">
                    <AdminAnalyticsPage />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminProtectedRoute requiredPermission="manage_blog">
                    <AdminBlogPage />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminProtectedRoute requiredPermission="manage_settings">
                    <AdminSettingsPage />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/admin/ads"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminProtectedRoute requiredPermission="manage_settings">
                    <AdminAdsPage />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
            <Route path="/admin/settings/ads" element={<Navigate to="/admin/ads" replace />} />
            <Route path="/admin/settings/monetization" element={<Navigate to="/admin/ads" replace />} />
            <Route
              path="/admin/messages"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminProtectedRoute>
                    <AdminMessagesPage />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
            <Route path="/admin/contact" element={<Navigate to="/admin/messages" replace />} />

            {/* Dedicated 404 Not Found Handling */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <NotFoundPage />
                </MainLayout>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AdminAuthProvider>
  </AdProvider>
</ToastProvider>
</ErrorBoundary>
);
}

export default App;
