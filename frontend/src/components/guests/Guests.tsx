import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  PlusIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { guests } from '../../api/client';

interface GuestAnnouncement {
  id: string;
  guestCount: number;
  startTime: string;
  endTime: string;
  description?: string;
  user: {
    id: string;
    username: string;
  };
}

interface GuestsResponse {
  data: GuestAnnouncement[];
}

const Guests: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<GuestAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<GuestAnnouncement | null>(null);
  const [formData, setFormData] = useState({
    guestCount: 1,
    startTime: '',
    endTime: '',
    description: '',
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!user?.householdId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await guests.getHouseholdAnnouncements(user.householdId);
        setAnnouncements((response as GuestsResponse).data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to load guest announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [user?.householdId]);

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.householdId) return;
    
    try {
      setLoading(true);
      const response = await guests.create(user.householdId, formData);
      setAnnouncements([...announcements, response.data as GuestAnnouncement]);
      setShowAddModal(false);
      resetForm();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to add announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAnnouncement) return;
    
    try {
      setLoading(true);
      const response = await guests.update(currentAnnouncement.id, formData);
      setAnnouncements(
        announcements.map((announcement) =>
          announcement.id === currentAnnouncement.id ? (response.data as GuestAnnouncement) : announcement
        )
      );
      setShowEditModal(false);
      resetForm();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this announcement?');
    if (!shouldDelete) return;
    
    try {
      setLoading(true);
      await guests.delete(id);
      setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete announcement');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (announcement: GuestAnnouncement) => {
    setCurrentAnnouncement(announcement);
    setFormData({
      guestCount: announcement.guestCount,
      startTime: new Date(announcement.startTime).toISOString().slice(0, 16),
      endTime: new Date(announcement.endTime).toISOString().slice(0, 16),
      description: announcement.description || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      guestCount: 1,
      startTime: '',
      endTime: '',
      description: '',
    });
    setCurrentAnnouncement(null);
  };

  if (loading && announcements.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user?.householdId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Roommate App!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">You need to join or create a household to manage guest announcements.</p>
        <div className="flex space-x-4">
          <a
            href="/household/create"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Household
          </a>
          <a
            href="/household/join"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Join Household
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guest Announcements</h1>
        <button
          onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Announcement
        </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming Guests</h2>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No guest announcements yet.</p>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200"
            >
                <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center">
                      <UserGroupIcon className="w-5 h-5 text-primary-500 dark:text-primary-400 mr-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {announcement.guestCount} guests
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Hosted by {announcement.user.username}
                    </p>
                    {announcement.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {announcement.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(announcement.startTime).toLocaleDateString()} at{' '}
                        {new Date(announcement.startTime).toLocaleTimeString()} -{' '}
                        {new Date(announcement.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                    {announcement.user.id === user.id && (
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          onClick={() => openEditModal(announcement)}
                          className="p-1 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Add Guest Announcement
                    </h3>
                    <form onSubmit={handleAddAnnouncement} className="mt-4 space-y-4">
              <div>
                        <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Number of Guests
                </label>
                <input
                          type="number"
                          id="guestCount"
                          min="1"
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={formData.guestCount}
                          onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                />
              </div>
                <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Start Time
                  </label>
                  <input
                          type="datetime-local"
                          id="startTime"
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          End Time
                  </label>
                  <input
                          type="datetime-local"
                          id="endTime"
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description (Optional)
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddModal(false);
                            resetForm();
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Edit Guest Announcement
                    </h3>
                    <form onSubmit={handleEditAnnouncement} className="mt-4 space-y-4">
              <div>
                        <label htmlFor="edit-guestCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of Guests
                </label>
                <input
                  type="number"
                          id="edit-guestCount"
                          min="1"
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={formData.guestCount}
                          onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Start Time
                        </label>
                        <input
                          type="datetime-local"
                          id="edit-startTime"
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          End Time
                        </label>
                        <input
                          type="datetime-local"
                          id="edit-endTime"
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description (Optional)
                        </label>
                        <textarea
                          id="edit-description"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Update
                        </button>
                <button
                  type="button"
                          onClick={() => {
                            setShowEditModal(false);
                            resetForm();
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guests; 