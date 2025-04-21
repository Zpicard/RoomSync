import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { tasks } from '../../api/client';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'PENDING' | 'COMPLETED' | 'OVERDUE';
  assignedTo: {
    id: string;
    username: string;
  };
}

interface TasksResponse {
  data: Task[];
}

const Chores: React.FC = () => {
  const { user } = useAuth();
  const [householdTasks, setHouseholdTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.householdId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await tasks.getHouseholdTasks(user.householdId);
        setHouseholdTasks((response as TasksResponse).data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.householdId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user?.householdId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Roommate App!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">You need to join or create a household to manage chores.</p>
        <div className="flex space-x-4">
          <Link
            to="/household/create"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Household
          </Link>
          <Link
            to="/household/join"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Join Household
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Household Chores</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Chore
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="space-y-4">
          {householdTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No chores assigned yet.</p>
          ) : (
            householdTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>Assigned to: {task.assignedTo.username}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {task.status === 'COMPLETED' || task.status === 'DONE' ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    ) : task.status === 'OVERDUE' ? (
                      <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                    ) : (
                      <ClockIcon className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Add Chore Modal */}
      {showAddModal && (
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
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Add New Chore
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This feature is coming soon. Please check back later.
                      </p>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chores; 