import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  PlusIcon,
  PencilIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  preferences: {
    quietHours: string;
    cleaningSchedule: string;
    guestPolicy: string;
  };
  stats: {
    choresCompleted: number;
    guestsHosted: number;
    quietDays: number;
  };
}

const Profiles: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        // Fetch profiles from your API
        // const response = await apiClient.get('/api/profiles');
        // setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

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
          <p className="text-neutral-500 mt-2">Manage roommate profiles and preferences</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Profile</span>
        </button>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-8">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          No profiles added yet. Click the "Add Profile" button to get started.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
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

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-700">Preferences</h4>
                  <ul className="mt-2 space-y-1 text-sm text-neutral-500">
                    <li>Quiet Hours: {profile.preferences.quietHours}</li>
                    <li>Cleaning: {profile.preferences.cleaningSchedule}</li>
                    <li>Guests: {profile.preferences.guestPolicy}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-700">Stats</h4>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-neutral-50 rounded">
                      <div className="text-lg font-semibold text-neutral-900">
                        {profile.stats.choresCompleted}
                      </div>
                      <div className="text-xs text-neutral-500">Chores</div>
                    </div>
                    <div className="text-center p-2 bg-neutral-50 rounded">
                      <div className="text-lg font-semibold text-neutral-900">
                        {profile.stats.guestsHosted}
                      </div>
                      <div className="text-xs text-neutral-500">Guests</div>
                    </div>
                    <div className="text-center p-2 bg-neutral-50 rounded">
                      <div className="text-lg font-semibold text-neutral-900">
                        {profile.stats.quietDays}
                      </div>
                      <div className="text-xs text-neutral-500">Quiet Days</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingProfile ? 'Edit Profile' : 'Add Profile'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProfile(null);
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter name"
                  defaultValue={profiles.find(p => p.id === editingProfile)?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Avatar URL
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter avatar URL"
                  defaultValue={profiles.find(p => p.id === editingProfile)?.avatar}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quiet Hours
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter quiet hours"
                  defaultValue={profiles.find(p => p.id === editingProfile)?.preferences.quietHours}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cleaning Schedule
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter cleaning schedule"
                  defaultValue={profiles.find(p => p.id === editingProfile)?.preferences.cleaningSchedule}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Guest Policy
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter guest policy"
                  defaultValue={profiles.find(p => p.id === editingProfile)?.preferences.guestPolicy}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProfile(null);
                  }}
                  className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingProfile ? 'Save Changes' : 'Add Profile'}
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