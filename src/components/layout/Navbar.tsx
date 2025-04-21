import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  MoonIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/' },
  { name: 'Chores', icon: ClipboardDocumentCheckIcon, path: '/chores' },
  { name: 'Guests', icon: UserGroupIcon, path: '/guests' },
  { name: 'Quiet Time', icon: MoonIcon, path: '/quiet-time' },
  { name: 'Profiles', icon: UserCircleIcon, path: '/profiles' },
];

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:top-0 md:bottom-0 md:left-0 md:w-64 md:border-r md:border-t-0">
      <div className="flex justify-around md:flex-col md:justify-start md:h-full md:py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center p-4 md:flex-row md:px-6 md:py-3 md:space-x-3
                ${isActive ? 'text-primary-600' : 'text-neutral-500 hover:text-primary-500'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm mt-1 md:mt-0">{item.name}</span>
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 md:hidden"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar; 