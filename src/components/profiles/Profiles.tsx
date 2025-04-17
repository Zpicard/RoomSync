import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  PlusIcon,
  PencilIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Mock data - this would come from your backend
const mockProfiles = [
  {
    id: 1,
    name: 'Alex',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    preferences: {
      quietHours: '10 PM - 7 AM',
      cleaningSchedule: 'Monday, Wednesday, Friday',
      guestPolicy: 'Notify 24h in advance',
    },
    stats: {
      choresCompleted: 12,
      guestsHosted: 5,
      quietDays: 3,
    },
  },
  {
    id: 2,
    name: 'Sam',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    preferences: {
      quietHours: '11 PM - 8 AM',
      cleaningSchedule: 'Tuesday, Thursday, Saturday',
      guestPolicy: 'No overnight guests',
    },
    stats: {
      choresCompleted: 8,
      guestsHosted: 3,
      quietDays: 2,
    },
  },
  {
    id: 3,
    name: 'Jordan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    preferences: {
      quietHours: '9 PM - 6 AM',
      cleaningSchedule: 'Monday, Thursday, Sunday',
      guestPolicy: 'Weekend guests only',
    },
    stats: {
      choresCompleted: 15,
      guestsHosted: 7,
      quietDays: 4,
    },
  },
];

const Profiles: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Roommate Profiles</h1>
          <p className="text-neutral-500 mt-2">View and manage roommate information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Roommate</span>
        </button>
      </motion.div>

      {/* Profiles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProfiles.map((profile) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {profile.name}
                  </h3>
                  <button
                    onClick={() => setEditingProfile(profile.id)}
                    className="text-sm text-primary-500 hover:text-primary-600 flex items-center space-x-1"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">
                  Preferences
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-700">
                    <span className="font-medium">Quiet Hours:</span>{' '}
                    {profile.preferences.quietHours}
                  </p>
                  <p className="text-sm text-neutral-700">
                    <span className="font-medium">Cleaning Schedule:</span>{' '}
                    {profile.preferences.cleaningSchedule}
                  </p>
                  <p className="text-sm text-neutral-700">
                    <span className="font-medium">Guest Policy:</span>{' '}
                    {profile.preferences.guestPolicy}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">
                  Statistics
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <CheckCircleIcon className="w-6 h-6 text-primary-500 mx-auto" />
                    <p className="text-sm font-medium text-neutral-900 mt-1">
                      {profile.stats.choresCompleted}
                    </p>
                    <p className="text-xs text-neutral-500">Chores Done</p>
                  </div>
                  <div className="text-center">
                    <UserCircleIcon className="w-6 h-6 text-secondary-500 mx-auto" />
                    <p className="text-sm font-medium text-neutral-900 mt-1">
                      {profile.stats.guestsHosted}
                    </p>
                    <p className="text-xs text-neutral-500">Guests Hosted</p>
                  </div>
                  <div className="text-center">
                    <ClockIcon className="w-6 h-6 text-neutral-500 mx-auto" />
                    <p className="text-sm font-medium text-neutral-900 mt-1">
                      {profile.stats.quietDays}
                    </p>
                    <p className="text-xs text-neutral-500">Quiet Days</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Profile Modal */}
      {(showAddModal || editingProfile) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-neutral-900">
                {editingProfile ? 'Edit Profile' : 'Add Roommate'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProfile(null);
                }}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Name
                </label>
                <input type="text" className="input" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Quiet Hours
                </label>
                <input type="text" className="input" placeholder="e.g., 10 PM - 7 AM" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Cleaning Schedule
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Monday, Wednesday, Friday"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Guest Policy
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Notify 24h in advance"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProfile(null);
                  }}
                  className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProfile ? 'Save Changes' : 'Add Roommate'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profiles; 