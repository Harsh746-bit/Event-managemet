import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Shared Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Student (User) Pages
import EventsPage from './pages/student/EventsPage';
import RegistrationPage from './pages/student/RegistrationPage';
import MyPassesPage from './pages/student/MyPassesPage';
import ClubsPage from './pages/student/ClubsPage';
import AnnouncementsPage from './pages/student/AnnouncementsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';

// Organizer Pages
import OrganizerDashboardPage from './pages/organizer/OrganizerDashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Public Exploration Routes */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/clubs" element={<ClubsPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />

              {/* Authenticated Pass & Registration Routes */}
              <Route
                path="/register"
                element={
                  <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
                    <RegistrationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-passes"
                element={
                  <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
                    <MyPassesPage />
                  </ProtectedRoute>
                }
              />

              {/* Organizer-Protected Routes */}
              <Route
                path="/organizer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/organizer" element={<Navigate to="/organizer/dashboard" replace />} />

              {/* Admin-Protected Routes (RBAC Enforcement) */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminEventsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/registrations"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminRegistrationsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/system" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}
