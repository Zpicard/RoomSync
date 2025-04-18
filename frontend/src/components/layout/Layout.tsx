import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ThemeToggle } from '../ThemeToggle';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      <main className="pb-20 md:pl-64 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 