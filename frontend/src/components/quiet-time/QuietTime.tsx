import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MoonIcon,
  PlusIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import NoHouseholdMessage from '../common/NoHouseholdMessage';

interface QuietTime {
  id: string;
  title: string;
  type: 'exam' | 'study' | 'quiet';
  date: string;
  time: string;
  person: string;
  description: string;
}

const QuietTime: React.FC = () => {
  const { user } = useAuth();
  const [quietTimes, setQuietTimes] = useState<QuietTime[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuietTimes = async () => {
      try {
        setIsLoading(true);
        // Fetch quiet times from your API
        // const response = await apiClient.get('/api/quiet-times');
        // setQuietTimes(response.data);
      } catch (error) {
        console.error('Error fetching quiet times:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuietTimes();
  }, []);

  if (!user?.householdId) {
    return <NoHouseholdMessage 
      title="No Group Found" 
      message="You need to join or create a household to manage quiet times." 
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
          <h1 className="text-3xl font-bold text-neutral-900">Quiet Time</h1>
          <p className="text-neutral-500 mt-2">Manage study and rest periods</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Quiet Time</span>
        </button>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-8">Loading quiet times...</div>
      ) : quietTimes.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          No quiet times scheduled. Click the "Add Quiet Time" button to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {quietTimes.map((quietTime) => (
            <motion.div
              key={quietTime.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                quietTime.type === 'exam'
                  ? 'bg-red-50 border border-red-200'
                  : quietTime.type === 'study'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-green-50 border border-green-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    {quietTime.type === 'exam' ? (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    ) : quietTime.type === 'study' ? (
                      <AcademicCapIcon className="w-5 h-5 text-blue-500" />
                    ) : (
                      <MoonIcon className="w-5 h-5 text-green-500" />
                    )}
                    <h3 className="font-medium text-neutral-900">{quietTime.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    {quietTime.date} • {quietTime.time}
                  </p>
                  <p className="text-sm text-neutral-500">By {quietTime.person}</p>
                  {quietTime.description && (
                    <p className="text-sm text-neutral-500 mt-1">{quietTime.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Quiet Time Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg transition-colors duration-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Quiet Time</h3>
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
                  Title
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  Description
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Enter description"
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