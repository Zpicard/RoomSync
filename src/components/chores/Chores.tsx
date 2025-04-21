import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

// Mock data - this would come from your backend
const mockRoommates = ['Alex', 'Sam', 'Jordan'];
const mockChores = [
  { id: 1, name: 'Clean Kitchen', frequency: 'daily' },
  { id: 2, name: 'Take out Trash', frequency: 'daily' },
  { id: 3, name: 'Vacuum Living Room', frequency: 'weekly' },
  { id: 4, name: 'Clean Bathroom', frequency: 'weekly' },
  { id: 5, name: 'Do Laundry', frequency: 'weekly' },
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Chores: React.FC = () => {
  const [selectedChore, setSelectedChore] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Chores</h1>
          <p className="text-neutral-500 mt-2">Manage and track weekly chores</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Chore</span>
        </button>
      </motion.div>

      {/* Weekly Calendar View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card overflow-x-auto"
      >
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-4">
            {/* Header row */}
            <div className="col-span-1" /> {/* Empty cell for chore names */}
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center font-medium text-neutral-900 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Chore rows */}
          {mockChores.map((chore) => (
            <div
              key={chore.id}
              className="grid grid-cols-8 gap-4 items-center py-2 border-t border-neutral-100"
            >
              <div className="font-medium text-neutral-900">{chore.name}</div>
              {daysOfWeek.map((day) => (
                <div
                  key={`${chore.id}-${day}`}
                  className="flex justify-center"
                >
                  <button
                    onClick={() => setSelectedChore(chore.id)}
                    className="w-8 h-8 rounded-full border-2 border-neutral-200 hover:border-primary-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Chore List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Available Chores</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockChores.map((chore) => (
            <div
              key={chore.id}
              className="p-4 bg-neutral-50 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-neutral-900">{chore.name}</p>
                <p className="text-sm text-neutral-500">{chore.frequency}</p>
              </div>
              <button
                onClick={() => setSelectedChore(chore.id)}
                className="btn btn-secondary"
              >
                Assign
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Chore Modal - This would be a separate component in a real app */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Add New Chore</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Chore Name
                </label>
                <input type="text" className="input" placeholder="Enter chore name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Frequency
                </label>
                <select className="input">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
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
                  Add Chore
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Chores; 