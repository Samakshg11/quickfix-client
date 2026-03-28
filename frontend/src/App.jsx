// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { PrivateRoute, PublicRoute } from './components/layout/RouteGuards';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RegisterMechanicPage from './pages/auth/RegisterMechanicPage';

// User pages
import DashboardPage from './pages/user/DashboardPage';
import BookingsPage from './pages/user/BookingsPage';
import FindMechanicsPage from './pages/user/FindMechanicsPage';
import BookMechanicPage from './pages/user/BookMechanicPage';
import EmergencyPage from './pages/user/EmergencyPage';

// Mechanic pages
import MechanicDashboardPage from './pages/mechanic/MechanicDashboardPage';
import MechanicProfilePage from './pages/mechanic/MechanicProfilePage';
import MechanicAppointmentsPage from './pages/mechanic/MechanicAppointmentsPage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PendingMechanicsPage from './pages/admin/PendingMechanicsPage';

// Shared
import NotFoundPage from './pages/NotFoundPage';
import NotificationsPage from './pages/NotificationsPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />

      <Routes>
        {/* ── Public only (redirect if logged in) ─────────────── */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/mechanic" element={<RegisterMechanicPage />} />
        </Route>

        {/* ── Authenticated user routes ────────────────────────── */}
        <Route element={<PrivateRoute allowedRoles={['user']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/mechanics" element={<FindMechanicsPage />} />
          <Route path="/mechanics/:id" element={<BookMechanicPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
        </Route>

        {/* ── Authenticated mechanic routes ────────────────────── */}
        <Route element={<PrivateRoute allowedRoles={['mechanic']} />}>
          <Route path="/mechanic/dashboard" element={<MechanicDashboardPage />} />
          <Route path="/mechanic/profile" element={<MechanicProfilePage />} />
          <Route path="/mechanic/appointments" element={<MechanicAppointmentsPage />} />
        </Route>

        {/* ── Admin routes ─────────────────────────────────────── */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/mechanics" element={<PendingMechanicsPage />} />
        </Route>

        {/* ── Shared authenticated ─────────────────────────────── */}
        <Route element={<PrivateRoute />}>
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* ── Index ───────────────────────────────────── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── 404 ──────────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
