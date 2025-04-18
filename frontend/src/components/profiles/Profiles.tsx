import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Mock data - this would come from your backend
const mockProfiles = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    bio: 'Computer Science major, loves coding and gaming',
    preferences: ['Early bird', 'Clean freak', 'Night owl'],
    avatarSeed: 'Alex',
  },
  {
    id: 2,
    name: 'Sam Smith',
    email: 'sam@example.com',
    bio: 'Biology major, enjoys hiking and photography',
    preferences: ['Early bird', 'Social butterfly'],
    avatarSeed: 'Sam',
  },
  {
    id: 3,
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    bio: 'Business major, fitness enthusiast',
    preferences: ['Clean freak', 'Social butterfly'],
    avatarSeed: 'Jordan',
  },
];

const Profiles: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<typeof mockProfiles[0] | null>(null);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roommate Profiles</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your roommate profiles and preferences</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Profile</span>
        </button>
      </motion.div>

      {/* Profile Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {mockProfiles.map((profile) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed}&backgroundColor=b6e3f4,c0aede,d1f4d9,ffdfbf,ffd5dc&mood[]=happy&style=circle`}
                    alt={`${profile.name}'s avatar`}
                    className="w-12 h-12 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{profile.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedProfile(profile);
                    setShowAddModal(true);
                  }}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{profile.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.preferences.map((pref, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {pref}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add/Edit Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg transition-colors duration-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedProfile ? 'Edit Profile' : 'Add Profile'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedProfile(null);
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
                  defaultValue={selectedProfile?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="Enter email"
                  defaultValue={selectedProfile?.email}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Enter bio"
                  defaultValue={selectedProfile?.bio}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Early bird', 'Night owl', 'Clean freak', 'Social butterfly'].map((pref) => (
                    <label
                      key={pref}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 dark:text-primary-400"
                        defaultChecked={selectedProfile?.preferences.includes(pref)}
                      />
                      <span className="ml-2">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedProfile(null);
                  }}
                  className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {selectedProfile ? 'Save Changes' : 'Add Profile'}
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