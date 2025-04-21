import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      }>
        <AuthProvider>
          <ThemeProvider>
            <Toaster position="top-right" />
            <AppRoutes />
          </ThemeProvider>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
