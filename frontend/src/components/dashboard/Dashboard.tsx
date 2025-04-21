import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { tasks } from '../../api/client';
import { guests } from '../../api/client';
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

interface GuestAnnouncement {
  id: string;
  guestCount: number;
  startTime: string;
  endTime: string;
  description?: string;
  user: {
    id: string;
    username: string;
  };
}

interface TasksResponse {
  data: Task[];
}

interface GuestsResponse {
  data: GuestAnnouncement[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [householdTasks, setHouseholdTasks] = useState<Task[]>([]);
  const [guestAnnouncements, setGuestAnnouncements] = useState<GuestAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.householdId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [tasksResponse, guestsResponse] = await Promise.all([
          tasks.getHouseholdTasks(user.householdId),
          guests.getHouseholdAnnouncements(user.householdId),
        ]);

        setHouseholdTasks((tasksResponse as TasksResponse).data);
        setGuestAnnouncements((guestsResponse as GuestsResponse).data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
        <p className="text-gray-500 dark:text-gray-400 mb-6">You need to join or create a household to get started.</p>
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
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Here's what's happening today</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Household Tasks</h2>
        <div className="space-y-4">
          {householdTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No tasks assigned yet.</p>
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
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Today's Events</h2>
        <div className="space-y-4">
          {guestAnnouncements.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No events scheduled for today.</p>
          ) : (
            guestAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {announcement.guestCount} guests
                    </h3>
                    {announcement.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {announcement.description}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(announcement.startTime).toLocaleTimeString()} -{' '}
                        {new Date(announcement.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 