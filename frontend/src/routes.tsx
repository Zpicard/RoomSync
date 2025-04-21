import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Chores from './components/chores/Chores';
import Guests from './components/guests/Guests';
import QuietTime from './components/quiet-time/QuietTime';
import Profile from './components/profile/Profile';
import GroupMembers from './components/group/GroupMembers';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CreateHousehold from './components/household/CreateHousehold';
import JoinHousehold from './components/household/JoinHousehold';
import { useAuth } from './context/AuthContext';

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
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
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
        <Route path="group-members" element={<GroupMembers />} />
      </Route>

      {/* Household routes */}
      <Route
        path="/household/create"
        element={
          <ProtectedRoute>
            <CreateHousehold />
          </ProtectedRoute>
        }
      />
      <Route
        path="/household/join"
        element={
          <ProtectedRoute>
            <JoinHousehold />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 