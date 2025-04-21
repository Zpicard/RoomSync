import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { tasks } from '../../api/client';
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
    name: string;
  };
}

interface Event {
  id: string;
  type: string;
  title: string;
  time: string;
  host: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [chores, setChores] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        if (user?.householdId) {
          const tasksResponse = await tasks.getHouseholdTasks(user.householdId);
          setChores(tasksResponse.data as Task[]);
        }
        // Fetch events from your API
        // const eventsResponse = await apiClient.get('/api/events');
        // setEvents(eventsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.householdId]);

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

  // Filter tasks due today
  const todaysTasks = chores.filter(task => isToday(task.dueDate));

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
      >
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome Back!</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">Here's what's happening today</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Chores Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Weekly Chores</h2>
            <CalendarIcon className="w-6 h-6 text-primary-500" />
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Loading chores...</div>
            ) : chores.length === 0 ? (
              <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No chores assigned yet</div>
            ) : (
              chores.map((chore) => (
                <div
                  key={chore.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{chore.title}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Due: {formatDate(chore.dueDate)}
                    </p>
                    {chore.assignedTo && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Assigned to: {chore.assignedTo.name}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chore.status)}`}>
                    {chore.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Today's Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Today's Events</h2>
            <CalendarIcon className="w-6 h-6 text-primary-500" />
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Loading events...</div>
            ) : todaysTasks.length === 0 && events.length === 0 ? (
              <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No events scheduled for today</div>
            ) : (
              <>
                {/* Display today's tasks */}
                {todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-neutral-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{task.title}</p>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-1" />
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Due: {formatTime(task.dueDate)}
                          </p>
                        </div>
                        {task.assignedTo && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Assigned to: {task.assignedTo.name}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Display other events */}
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg ${
                      event.type === 'quiet'
                        ? 'bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-700'
                        : 'bg-neutral-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{event.title}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{event.time}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Hosted by {event.host}</p>
                      </div>
                      {event.type === 'quiet' && (
                        <ExclamationTriangleIcon className="w-6 h-6 text-secondary-500" />
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 