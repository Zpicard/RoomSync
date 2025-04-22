import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  PlusIcon,
  UserGroupIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { guests } from '../../api/client';
import { toast } from 'react-hot-toast';
import NoHouseholdMessage from '../common/NoHouseholdMessage';

interface GuestEvent {
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

const Guests: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<GuestEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    guestCount: 1,
    startTime: '',
    endTime: '',
    description: '',
  });

  const fetchGuestEvents = async () => {
    try {
      setIsLoading(true);
      if (user?.householdId) {
        const response = await guests.getHouseholdAnnouncements(user.householdId);
        setEvents(response.data as GuestEvent[]);
      }
    } catch (error) {
      console.error('Error fetching guest events:', error);
      toast.error('Failed to load guest events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestEvents();
  }, [user?.householdId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.householdId) {
        toast.error('No household selected');
        return;
      }

      await guests.create(user.householdId, formData);
      toast.success('Guest event added successfully');
      setShowAddModal(false);
      setFormData({
        guestCount: 1,
        startTime: '',
        endTime: '',
        description: '',
      });
      fetchGuestEvents();
    } catch (error) {
      console.error('Error adding guest event:', error);
      toast.error('Failed to add guest event');
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await guests.delete(eventId);
      toast.success('Guest event deleted successfully');
      fetchGuestEvents();
    } catch (error) {
      console.error('Error deleting guest event:', error);
      toast.error('Failed to delete guest event');
    }
  };

  if (!user?.householdId) {
    return <NoHouseholdMessage 
      title="No Group Found" 
      message="You need to join or create a household to manage guest events." 
    />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
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
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Guest Events</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">Manage and track guest visits</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-8">Loading guest events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          No guest events scheduled. Click the "Add Event" button to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white">
                    {event.guestCount} {event.guestCount === 1 ? 'Guest' : 'Guests'} by {event.user.username}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatDate(event.startTime)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                  {event.description && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {event.description}
                    </p>
                  )}
                </div>
                {event.user.id === user.id && (
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Add Guest Event</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className="input"
                  min="1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                  placeholder="Add any additional notes"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-gray-700 dark:text-neutral-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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