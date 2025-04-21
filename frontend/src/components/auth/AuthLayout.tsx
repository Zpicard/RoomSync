import React from 'react';
import Logo from '../common/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-lg text-white/80">{subtitle}</p>
          )}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow-2xl rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 