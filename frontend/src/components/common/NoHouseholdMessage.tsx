import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface NoHouseholdMessageProps {
  title?: string;
  message?: string;
}

const NoHouseholdMessage: React.FC<NoHouseholdMessageProps> = ({
  title = "No Group Found",
  message = "You need to join or create a household to manage this feature."
}) => {
  return (
    <motion.div 
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-6">
        <UserGroupIcon className="w-16 h-16 text-primary-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {message}
      </p>
      <div className="flex justify-center space-x-4">
        <Link 
          to="/create-household" 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Create Group
        </Link>
        <Link 
          to="/join-household" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Join Group
        </Link>
      </div>
    </motion.div>
  );
};

export default NoHouseholdMessage; 