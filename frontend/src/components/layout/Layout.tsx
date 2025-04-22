import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="pl-0 lg:pl-64">
        <main className="pt-8 pb-16 lg:pt-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg',
          duration: 3000,
        }}
      />
    </div>
  );
};

export default Layout; 