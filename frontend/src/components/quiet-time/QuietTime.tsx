import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MoonIcon,
  PlusIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { quietTimes } from '../../api/client';
import { toast } from 'react-hot-toast';
import NoHouseholdMessage from '../common/NoHouseholdMessage';

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

interface QuietTimeFormData {
  title: string;
  type: 'exam' | 'study' | 'quiet';
  date: string;
  time: string;
  description: string;
}

const QuietTime: React.FC = () => {
  const { user } = useAuth();
  const [quietTimesList, setQuietTimesList] = useState<QuietTime[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<QuietTimeFormData>({
    title: '',
    type: 'study',
    date: '',
    time: '',
    description: '',
  });

  useEffect(() => {
    fetchQuietTimes();
  }, [user?.householdId]);

  const fetchQuietTimes = async () => {
    if (!user?.householdId) return;
    
    try {
      setIsLoading(true);
      const response = await quietTimes.getHouseholdQuietTimes(user.householdId);
      setQuietTimesList(response.data as QuietTime[]);
    } catch (error) {
      console.error('Error fetching quiet times:', error);
      toast.error('Failed to load quiet times');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.householdId) return;

    try {
      // Combine date and time into ISO string
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 2); // Default 2-hour duration

      const response = await quietTimes.create({
        title: formData.title,
        type: formData.type,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        description: formData.description,
        householdId: user.householdId,
      });

      if (response.data) {
        toast.success('Quiet time added successfully');
        setShowAddModal(false);
        setFormData({
          title: '',
          type: 'study',
          date: '',
          time: '',
          description: '',
        });
        fetchQuietTimes();
      }
    } catch (error: any) {
      console.error('Error creating quiet time:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add quiet time';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (quietTimeId: string) => {
    setDeleteTargetId(quietTimeId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await quietTimes.delete(deleteTargetId);
      toast.success('Quiet time deleted successfully');
      fetchQuietTimes();
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error('Error deleting quiet time:', error);
      toast.error('Failed to delete quiet time');
    }
  };

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
      ) : quietTimesList.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          No quiet times scheduled. Click the "Add Quiet Time" button to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {quietTimesList.map((quietTime) => (
            <motion.div
              key={quietTime.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                quietTime.type === 'exam'
                  ? 'bg-red-50 border border-red-200 dark:bg-red-900/40 dark:border-red-800 dark:text-white'
                  : quietTime.type === 'study'
                  ? 'bg-blue-50 border border-blue-200 dark:bg-blue-900/40 dark:border-blue-800 dark:text-white'
                  : 'bg-green-50 border border-green-200 dark:bg-green-900/40 dark:border-green-800 dark:text-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    {quietTime.type === 'exam' ? (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
                    ) : quietTime.type === 'study' ? (
                      <AcademicCapIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    ) : (
                      <MoonIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                    )}
                    <h3 className="font-medium text-neutral-900 dark:text-white">{quietTime.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-1">
                    {new Date(quietTime.startTime).toLocaleDateString()} • {new Date(quietTime.startTime).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-300">By {quietTime.user.username}</p>
                  {quietTime.description && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-1">{quietTime.description}</p>
                  )}
                </div>
                {quietTime.user.id === user?.id && (
                  <button
                    onClick={() => handleDeleteClick(quietTime.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Delete quiet time"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
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
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-lg transition-colors duration-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Delete Quiet Time</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this quiet time?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTargetId(null);
                }}
                className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QuietTime; 