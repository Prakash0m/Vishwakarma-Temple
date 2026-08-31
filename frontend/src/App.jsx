import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import DashboardView from './pages/admin/DashboardView';
import MembersView from './pages/admin/MembersView';
import DonationsView from './pages/admin/DonationsView';
import ExpensesView from './pages/admin/ExpensesView';
import BudgetsView from './pages/admin/BudgetsView';
import PoojasView from './pages/admin/PoojasView';
import BookingsView from './pages/admin/BookingsView';
import EventsView from './pages/admin/EventsView';
import GalleryView from './pages/admin/GalleryView';
import MeetingLiveView from './pages/admin/MeetingLiveView';
import ContentCMSView from './pages/admin/ContentCMSView';
import MessagesView from './pages/admin/MessagesView';
import SettingsView from './pages/admin/SettingsView';

// Tole Management System Advanced Modules
import HousesView from './pages/admin/tole/HousesView';
import MeetingsView from './pages/admin/tole/MeetingsView';
import FinesView from './pages/admin/tole/FinesView';
import WeddingsView from './pages/admin/tole/WeddingsView';
import LeadershipView from './pages/admin/tole/LeadershipView';
import TempleIncomeView from './pages/admin/tole/TempleIncomeView';
import FundCampaignsView from './pages/admin/tole/FundCampaignsView';
import FundApprovalsView from './pages/admin/tole/FundApprovalsView';
import FundReportsView from './pages/admin/tole/FundReportsView';

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

        {/* Existing Temple Management Routes */}
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
  );
}

export default App;
