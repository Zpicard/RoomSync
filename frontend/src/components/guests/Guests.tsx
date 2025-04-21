import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  PlusIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import NoHouseholdMessage from '../common/NoHouseholdMessage';

interface GuestEvent {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  guests: number;
}

const Guests: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<GuestEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuestEvents = async () => {
      try {
        setIsLoading(true);
        // Fetch guest events from your API
        // const response = await apiClient.get('/api/guests');
        // setEvents(response.data);
      } catch (error) {
        console.error('Error fetching guest events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuestEvents();
  }, []);

  if (!user?.householdId) {
    return <NoHouseholdMessage 
      title="No Group Found" 
      message="You need to join or create a household to manage guest events." 
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
          <h1 className="text-3xl font-bold text-neutral-900">Guest Events</h1>
          <p className="text-neutral-500 mt-2">Manage and track guest visits</p>
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
        <div className="text-center py-8 text-neutral-500">
          No guest events scheduled. Click the "Add Event" button to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-neutral-50 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">{event.title}</h3>
                  <p className="text-sm text-neutral-500">
                    Hosted by {event.host} • {event.date} • {event.time}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Expected guests: {event.guests}
                  </p>
                </div>
                <UserGroupIcon className="w-6 h-6 text-primary-500" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Guest Modal would go here */}
    </div>
  );
};

export default Guests; 