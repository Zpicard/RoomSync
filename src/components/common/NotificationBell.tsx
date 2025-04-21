import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import toast from 'react-hot-toast';

const NotificationBell: React.FC = () => {
  const { notifications, markAsRead, clearAll } = useNotifications();

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        as={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 relative"
      >
        <BellIcon className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                  No new notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <Menu.Item key={notification.id}>
                    {({ active }) => (
                      <div
                        className={`${
                          active ? 'bg-neutral-50 dark:bg-neutral-700' : ''
                        } p-3 rounded-lg cursor-pointer transition-colors duration-150`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <p className="text-sm text-neutral-900 dark:text-neutral-50">
                          {notification.message}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </Menu.Item>
                ))
              )}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationBell; 