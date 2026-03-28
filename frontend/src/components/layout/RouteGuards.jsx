// src/components/layout/RouteGuards.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppShell from './AppShell';

export function PrivateRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to role-appropriate home
    if (user?.role === 'mechanic') return <Navigate to="/mechanic/dashboard" replace />;
    if (user?.role === 'admin')    return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export function PublicRoute() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Outlet />;

  if (user?.role === 'mechanic') return <Navigate to="/mechanic/dashboard" replace />;
  if (user?.role === 'admin')    return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
}
