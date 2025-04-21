import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardIcon,
  UserGroupIcon,
  MoonIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Logo from '../common/Logo';
import { ThemeToggle } from '../ThemeToggle';

interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'Chores', icon: ClipboardIcon, path: '/chores' },
  { name: 'Group Members', icon: UsersIcon, path: '/members' },
  { name: 'Guests', icon: UserGroupIcon, path: '/guests' },
  { name: 'Quiet Time', icon: MoonIcon, path: '/quiet-time' },
  { name: 'Profile', icon: UserIcon, path: '/profile' },
];

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">RoomieSync</span>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg transition-colors duration-150 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium border border-primary-200 dark:border-primary-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-transparent'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 