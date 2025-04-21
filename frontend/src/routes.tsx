import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Chores from './components/chores/Chores';
import Guests from './components/guests/Guests';
import QuietTime from './components/quiet-time/QuietTime';
import Profile from './components/profile/Profile';
import GroupMembers from './components/group/GroupMembers';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateHousehold from './components/household/CreateHousehold';
import JoinHousehold from './components/household/JoinHousehold';
import { useAuth } from './context/AuthContext';
import FindGroups from './pages/FindGroups';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />

      {/* Protected standalone routes */}
      <Route
        path="/create-household"
        element={
          <ProtectedRoute>
            <CreateHousehold />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join-household"
        element={
          <ProtectedRoute>
            <JoinHousehold />
          </ProtectedRoute>
        }
      />

      {/* Protected routes with layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="chores" element={<Chores />} />
        <Route path="guests" element={<Guests />} />
        <Route path="quiet-time" element={<QuietTime />} />
        <Route path="profile" element={<Profile />} />
        <Route path="group" element={<GroupMembers />} />
        <Route path="find-groups" element={<FindGroups />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes; 