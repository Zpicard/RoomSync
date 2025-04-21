import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface QuietTime {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  userId: string;
  householdId: string;
}

const QuietTime: React.FC<{ householdId: string }> = ({ householdId }) => {
  const [quietTimes, setQuietTimes] = useState<QuietTime[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuietTime, setNewQuietTime] = useState({
    title: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  useEffect(() => {
    fetchQuietTimes();
  }, [householdId]);

  const fetchQuietTimes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/households/${householdId}/quiet-times`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setQuietTimes(data);
      }
    } catch (error) {
      console.error('Error fetching quiet times:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/households/${householdId}/quiet-times`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newQuietTime)
      });
      if (response.ok) {
        setShowForm(false);
        setNewQuietTime({ title: '', startTime: '', endTime: '', description: '' });
        fetchQuietTimes();
      }
    } catch (error) {
      console.error('Error creating quiet time:', error);
    }
  };

  const handleEdit = async (quietTime: QuietTime) => {
    // Implement edit functionality
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/households/${householdId}/quiet-times/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        fetchQuietTimes();
      }
    } catch (error) {
      console.error('Error deleting quiet time:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiet Times</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Quiet Time
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={newQuietTime.title}
                onChange={(e) => setNewQuietTime({ ...newQuietTime, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                <input
                  type="datetime-local"
                  value={newQuietTime.startTime}
                  onChange={(e) => setNewQuietTime({ ...newQuietTime, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                <input
                  type="datetime-local"
                  value={newQuietTime.endTime}
                  onChange={(e) => setNewQuietTime({ ...newQuietTime, endTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={newQuietTime.description}
                onChange={(e) => setNewQuietTime({ ...newQuietTime, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {quietTimes.map((quietTime) => (
          <div
            key={quietTime.id}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {quietTime.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {format(new Date(quietTime.startTime), 'h:mm a')} -{' '}
                  {format(new Date(quietTime.endTime), 'h:mm a')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(quietTime)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(quietTime.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-200">
              {quietTime.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuietTime; 