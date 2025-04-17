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
        <h1 className="text-3xl font-bold text-neutral-900">Welcome Back!</h1>
        <p className="text-neutral-500 mt-2">Here's what's happening today</p>
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
            <h2 className="text-xl font-semibold text-neutral-900">Weekly Chores</h2>
            <CalendarIcon className="w-6 h-6 text-primary-500" />
          </div>
          <div className="space-y-4">
            {mockChores.map((chore) => (
              <div
                key={chore.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-neutral-900">{chore.task}</p>
                  <p className="text-sm text-neutral-500">Assigned to {chore.assignedTo}</p>
                </div>
                {chore.completed ? (
                  <CheckCircleIcon className="w-6 h-6 text-primary-500" />
                ) : (
                  <div className="w-6 h-6 border-2 border-neutral-300 rounded-full" />
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
            <h2 className="text-xl font-semibold text-neutral-900">Today's Events</h2>
            <CalendarIcon className="w-6 h-6 text-primary-500" />
          </div>
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg ${
                  event.type === 'quiet'
                    ? 'bg-secondary-50 border border-secondary-200'
                    : 'bg-neutral-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{event.title}</p>
                    <p className="text-sm text-neutral-500">{event.time}</p>
                    <p className="text-sm text-neutral-500">Hosted by {event.host}</p>
                  </div>
                  {event.type === 'quiet' && (
                    <ExclamationTriangleIcon className="w-6 h-6 text-secondary-500" />
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