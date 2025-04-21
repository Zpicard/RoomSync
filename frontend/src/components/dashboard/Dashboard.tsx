import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { tasks, guests, quietTimes } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import NoHouseholdMessage from '../common/NoHouseholdMessage';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  assignedTo?: {
    id: string;
    username: string;
  };
}

interface GuestEvent {
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

interface QuietTime {
  id: string;
  title: string;
  type: 'exam' | 'study' | 'quiet';
  startTime: string;
  endTime: string;
  description?: string;
  user: {
    id: string;
    username: string;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [chores, setChores] = useState<Task[]>([]);
  const [guestEvents, setGuestEvents] = useState<GuestEvent[]>([]);
  const [quietTimesList, setQuietTimes] = useState<QuietTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      if (user?.householdId) {
        // Fetch chores
        const tasksResponse = await tasks.getHouseholdTasks(user.householdId);
        setChores(tasksResponse.data as Task[]);
        
        // Fetch guest events
        const guestsResponse = await guests.getHouseholdAnnouncements(user.householdId);
        setGuestEvents(guestsResponse.data as GuestEvent[]);
        
        // Fetch quiet times
        const quietTimesResponse = await quietTimes.getHouseholdQuietTimes(user.householdId);
        setQuietTimes(quietTimesResponse.data as QuietTime[]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.householdId]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchDashboardData();
      toast.success('Dashboard refreshed');
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast.error('Failed to refresh dashboard');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  // Filter tasks assigned to the current user
  const myTasks = chores.filter(task => task.assignedTo?.id === user?.id);
  
  // Filter guest events created by the current user
  const myGuestEvents = guestEvents.filter(event => event.user.id === user?.id);
  
  // Filter quiet times created by the current user
  const myQuietTimes = quietTimesList.filter(quietTime => quietTime.user.id === user?.id);

  // Get all unique users from chores for display
  const allUsers = new Set<string>();
  chores.forEach(task => {
    if (task.assignedTo?.username) {
      allUsers.add(task.assignedTo.username);
    }
  });

  if (!user?.householdId) {
    return <NoHouseholdMessage 
      title="No Group Found" 
      message="You need to join or create a household to view your dashboard." 
    />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome Back!</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">Here's what's happening today</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          title="Refresh dashboard"
        >
          <ArrowPathIcon className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Your Tasks & Events</h2>
            <UserIcon className="w-6 h-6 text-primary-500" />
          </div>
          
          {/* Your Chores */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-3">Your Chores</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-4">Loading chores...</div>
              ) : myTasks.length === 0 ? (
                <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No chores assigned to you</div>
              ) : (
                myTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">{task.title}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Due: {formatDate(task.dueDate)}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Assigned to: You
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Your Guest Events */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-3">Your Guest Events</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-4">Loading guest events...</div>
              ) : myGuestEvents.length === 0 ? (
                <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No guest events scheduled by you</div>
              ) : (
                myGuestEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-neutral-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {event.guestCount} {event.guestCount === 1 ? 'Guest' : 'Guests'}
                        </p>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-1" />
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </p>
                        </div>
                        {event.description && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Your Quiet Times */}
          <div>
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-3">Your Quiet Times</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-4">Loading quiet times...</div>
              ) : myQuietTimes.length === 0 ? (
                <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No quiet times scheduled by you</div>
              ) : (
                myQuietTimes.map((quietTime) => (
                  <div
                    key={quietTime.id}
                    className={`p-3 rounded-lg ${
                      quietTime.type === 'exam'
                        ? 'bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-700'
                        : quietTime.type === 'study'
                        ? 'bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700'
                        : 'bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{quietTime.title}</p>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-1" />
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {formatTime(quietTime.startTime)} - {formatTime(quietTime.endTime)}
                          </p>
                        </div>
                        {quietTime.description && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {quietTime.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Group Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Group Activity</h2>
            <UserGroupIcon className="w-6 h-6 text-primary-500" />
          </div>
          
          {/* All Chores */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-3">All Chores</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-4">Loading chores...</div>
              ) : chores.length === 0 ? (
                <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No chores assigned yet</div>
              ) : (
                chores.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">{task.title}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Due: {formatDate(task.dueDate)}
                      </p>
                      {task.assignedTo && task.assignedTo.username ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Assigned to: {task.assignedTo.username}
                        </p>
                      ) : (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Assigned to: Unassigned
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* All Guest Events */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-3">All Guest Events</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-4">Loading guest events...</div>
              ) : guestEvents.length === 0 ? (
                <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No guest events scheduled</div>
              ) : (
                guestEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-neutral-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {event.guestCount} {event.guestCount === 1 ? 'Guest' : 'Guests'} by {event.user.username}
                        </p>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-1" />
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </p>
                        </div>
                        {event.description && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* All Quiet Times */}
          <div>
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-3">All Quiet Times</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-4">Loading quiet times...</div>
              ) : quietTimesList.length === 0 ? (
                <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No quiet times scheduled</div>
              ) : (
                quietTimesList.map((quietTime) => (
                  <div
                    key={quietTime.id}
                    className={`p-3 rounded-lg ${
                      quietTime.type === 'exam'
                        ? 'bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-700'
                        : quietTime.type === 'study'
                        ? 'bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700'
                        : 'bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {quietTime.title} by {quietTime.user.username}
                        </p>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-1" />
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {formatTime(quietTime.startTime)} - {formatTime(quietTime.endTime)}
                          </p>
                        </div>
                        {quietTime.description && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {quietTime.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 