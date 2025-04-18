import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Mock data - this would come from your backend
const mockChores = [
  { id: 1, task: 'Clean Kitchen', assignedTo: 'Alex', completed: true },
  { id: 2, task: 'Take out Trash', assignedTo: 'Sam', completed: false },
  { id: 3, task: 'Vacuum Living Room', assignedTo: 'Jordan', completed: false },
];

const mockEvents = [
  {
    id: 1,
    type: 'guest',
    title: 'Study Group',
    time: '2:00 PM - 5:00 PM',
    host: 'Alex',
  },
  {
    id: 2,
    type: 'quiet',
    title: 'Exam Period',
    time: 'All Day',
    host: 'Jordan',
  },
];

const Dashboard: React.FC = () => {
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Chores Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Chores</h2>
            <CalendarIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
          </div>
          <div className="space-y-4">
            {mockChores.map((chore) => (
              <div
                key={chore.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{chore.task}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Assigned to {chore.assignedTo}</p>
                </div>
                {chore.completed ? (
                  <CheckCircleIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                )}
              </div>
            ))}
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Events</h2>
            <CalendarIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
          </div>
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  event.type === 'quiet'
                    ? 'bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800'
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.time}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hosted by {event.host}</p>
                  </div>
                  {event.type === 'quiet' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 