import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoonIcon,
  PlusIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Mock data - this would come from your backend
const mockQuietTimes = [
  {
    id: 1,
    title: 'Final Exams',
    type: 'exam',
    date: '2024-04-25',
    time: '09:00-17:00',
    person: 'Jordan',
    description: 'Final exams for Computer Science',
  },
  {
    id: 2,
    title: 'Study Session',
    type: 'study',
    date: '2024-04-23',
    time: '19:00-22:00',
    person: 'Alex',
    description: 'Group study for upcoming exams',
  },
  {
    id: 3,
    title: 'Mental Health Day',
    type: 'quiet',
    date: '2024-04-24',
    time: 'All Day',
    person: 'Sam',
    description: 'Need quiet time for mental health',
  },
];

const QuietTime: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'exam':
        return <AcademicCapIcon className="w-6 h-6 text-secondary-500" />;
      case 'study':
        return <MoonIcon className="w-6 h-6 text-primary-500" />;
      case 'quiet':
        return <MoonIcon className="w-6 h-6 text-neutral-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Quiet Time</h1>
          <p className="text-neutral-500 mt-2">Manage study periods and quiet hours</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Quiet Time</span>
        </button>
      </motion.div>

      {/* Quiet Time List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="space-y-4">
          {mockQuietTimes.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-lg ${
                event.type === 'exam'
                  ? 'bg-secondary-50 border border-secondary-200'
                  : event.type === 'study'
                  ? 'bg-primary-50 border border-primary-200'
                  : 'bg-neutral-50 border border-neutral-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {getIconForType(event.type)}
                    <h3 className="font-medium text-neutral-900">{event.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-sm text-neutral-500">By {event.person}</p>
                  <p className="text-sm text-neutral-700 mt-2">{event.description}</p>
                </div>
                {event.type === 'exam' && (
                  <ExclamationTriangleIcon className="w-6 h-6 text-secondary-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Quiet Time Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-neutral-900">Add Quiet Time</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Title
                </label>
                <input type="text" className="input" placeholder="Enter title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Type
                </label>
                <select className="input">
                  <option value="exam">Exam</option>
                  <option value="study">Study Session</option>
                  <option value="quiet">Quiet Time</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Date
                  </label>
                  <input type="date" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Time
                  </label>
                  <input type="time" className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Add details about your quiet time"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Quiet Time
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QuietTime; 