import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  PlusIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Mock data - this would come from your backend
const mockGuests = [
  {
    id: 1,
    title: 'Study Group',
    host: 'Alex',
    date: '2024-04-20',
    time: '14:00-17:00',
    guests: 4,
  },
  {
    id: 2,
    title: 'Movie Night',
    host: 'Sam',
    date: '2024-04-22',
    time: '19:00-23:00',
    guests: 6,
  },
  {
    id: 3,
    title: 'Game Night',
    host: 'Jordan',
    date: '2024-04-25',
    time: '18:00-22:00',
    guests: 5,
  },
];

const Guests: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guest Schedule</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and view upcoming guests</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Guest Event</span>
        </button>
      </motion.div>

      {/* Calendar View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Guests</h2>
          <CalendarIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
        </div>
        <div className="space-y-4">
          {mockGuests.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hosted by {event.host} • {event.date} • {event.time}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expected guests: {event.guests}
                  </p>
                </div>
                <UserGroupIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg transition-colors duration-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Guest Event</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="Enter number of guests"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Event
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Guests; 