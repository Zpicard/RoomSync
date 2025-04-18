import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Chores from './components/chores/Chores';
import Guests from './components/guests/Guests';
import QuietTime from './components/quiet-time/QuietTime';
import Profiles from './components/profiles/Profiles';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="chores" element={<Chores />} />
        <Route path="guests" element={<Guests />} />
        <Route path="quiet-time" element={<QuietTime />} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 