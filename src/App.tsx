import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Chores from './components/chores/Chores';
import Guests from './components/guests/Guests';
import QuietTime from './components/quiet-time/QuietTime';
import Profiles from './components/profiles/Profiles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chores" element={<Chores />} />
          <Route path="guests" element={<Guests />} />
          <Route path="quiet-time" element={<QuietTime />} />
          <Route path="profiles" element={<Profiles />} />
          {/* Add other routes here as we create them */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
