import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';

// Lazy-loaded Admin Layout & Login
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

// Lazy-loaded Admin Dashboard & Core Views
const DashboardView = lazy(() => import('./pages/admin/DashboardView'));
const MembersView = lazy(() => import('./pages/admin/MembersView'));
const DonationsView = lazy(() => import('./pages/admin/DonationsView'));
const ExpensesView = lazy(() => import('./pages/admin/ExpensesView'));
const BudgetsView = lazy(() => import('./pages/admin/BudgetsView'));
const PoojasView = lazy(() => import('./pages/admin/PoojasView'));
const BookingsView = lazy(() => import('./pages/admin/BookingsView'));
const EventsView = lazy(() => import('./pages/admin/EventsView'));
const GalleryView = lazy(() => import('./pages/admin/GalleryView'));
const MeetingLiveView = lazy(() => import('./pages/admin/MeetingLiveView'));
const ContentCMSView = lazy(() => import('./pages/admin/ContentCMSView'));
const MessagesView = lazy(() => import('./pages/admin/MessagesView'));
const SettingsView = lazy(() => import('./pages/admin/SettingsView'));

// Lazy-loaded Tole Management System Modules
const HousesView = lazy(() => import('./pages/admin/tole/HousesView'));
const MeetingsView = lazy(() => import('./pages/admin/tole/MeetingsView'));
const FinesView = lazy(() => import('./pages/admin/tole/FinesView'));
const WeddingsView = lazy(() => import('./pages/admin/tole/WeddingsView'));
const LeadershipView = lazy(() => import('./pages/admin/tole/LeadershipView'));
const TempleIncomeView = lazy(() => import('./pages/admin/tole/TempleIncomeView'));
const FundCampaignsView = lazy(() => import('./pages/admin/tole/FundCampaignsView'));
const FundApprovalsView = lazy(() => import('./pages/admin/tole/FundApprovalsView'));
const FundReportsView = lazy(() => import('./pages/admin/tole/FundReportsView'));

// Fast lightweight loading placeholder
const AdminLoader = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: '2rem'
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      border: '3px solid rgba(197, 155, 39, 0.2)',
      borderTop: '3px solid #C59B27',
      borderRadius: '50%',
      animation: 'appSpin 0.8s linear infinite'
    }} />
    <p style={{ marginTop: '0.85rem', color: '#7A121D', fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>
      लोड हुँदैछ... (Loading...)
    </p>
    <style>{`@keyframes appSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// Protected Route Component for Admin Portal
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#FAF7F2' }}>
        <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>प्रमाणीकरण जाँच हुँदैछ...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Suspense fallback={<AdminLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<DashboardView />} />

          {/* Tole Management Routes */}
          <Route path="tole/houses" element={<HousesView />} />
          <Route path="tole/meetings" element={<MeetingsView />} />
          <Route path="tole/fines" element={<FinesView />} />
          <Route path="tole/weddings" element={<WeddingsView />} />
          <Route path="tole/leadership" element={<LeadershipView />} />
          <Route path="tole/temple-income" element={<TempleIncomeView />} />
          <Route path="tole/fund-campaigns" element={<FundCampaignsView />} />
          <Route path="tole/fund-approvals" element={<FundApprovalsView />} />
          <Route path="tole/fund-reports" element={<FundReportsView />} />

          {/* Temple Management Routes */}
          <Route path="members" element={<MembersView />} />
          <Route path="donations" element={<DonationsView />} />
          <Route path="expenses" element={<ExpensesView />} />
          <Route path="budgets" element={<BudgetsView />} />
          <Route path="poojas" element={<PoojasView />} />
          <Route path="bookings" element={<BookingsView />} />
          <Route path="events" element={<EventsView />} />
          <Route path="gallery" element={<GalleryView />} />
          <Route path="meetings" element={<MeetingLiveView />} />
          <Route path="cms" element={<ContentCMSView />} />
          <Route path="messages" element={<MessagesView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
