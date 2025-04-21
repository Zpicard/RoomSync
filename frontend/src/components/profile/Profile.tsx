import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { household } from '../../api/client';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleLeaveHousehold = async () => {
    if (!user?.householdId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call API to leave household
      await household.leave(user.householdId);
      
      // Update user context
      if (user) {
        const updatedUser = { ...user, householdId: undefined };
        updateUser(updatedUser);
      }
      
      setShowLeaveConfirm(false);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to leave household. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
            <UserCircleIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.username}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <HomeIcon className="w-5 h-5 text-primary-500 dark:text-primary-400 mr-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Household</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {user?.householdId ? 'You are a member of a household' : 'You are not a member of any household'}
            </p>
            {user?.householdId && (
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                Leave Household
              </button>
            )}
            {!user?.householdId && (
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => navigate('/household/create')}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                >
                  Create Household
                </button>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <button
                  onClick={() => navigate('/household/join')}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                >
                  Join Household
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-primary-500 dark:text-primary-400 mr-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Account</h3>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Leave Household Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Leave Household
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to leave your current household? You will need to create or join a new household to access household features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleLeaveHousehold}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Leaving...' : 'Leave Household'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 