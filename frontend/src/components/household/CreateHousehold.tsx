import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { household } from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CreateHousehold: React.FC = () => {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create a group');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating group with name:', name.trim(), 'isPrivate:', isPrivate);
      const response = await household.create({ 
        name: name.trim(),
        isPrivate: isPrivate
      });
      console.log('Group creation response:', response);
      
      if (!response || !response.id) {
        throw new Error('Invalid response from server');
      }
      
      const updatedUser = {
        ...user,
        householdId: response.id
      };
      
      updateUser(updatedUser);
      toast.success('Group created successfully! You are now the group leader.');
      navigate('/');
    } catch (error: any) {
      console.error('Error creating group:', error);
      if (error.response?.data?.error === 'You are already a member of a household') {
        toast.error('You already belong to a group. Please leave it first.');
      } else if (error.response?.data?.error === 'Household name is required') {
        toast.error('Please enter a valid group name');
      } else {
        toast.error(error.response?.data?.error || 'Failed to create group. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8"
      >
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">Create a New Group</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/90">
              Group Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-gray-900 bg-white/90"
              placeholder="Enter group name"
              required
            />
            <p className="mt-1 text-sm text-white/70">
              Choose a name for your group that all members will recognize.
            </p>
          </div>

          <div>
            <div className="flex items-center">
              <input
                id="isPrivate"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-white/90">
                Private Group
              </label>
            </div>
            <p className="mt-1 text-sm text-white/70">
              {isPrivate 
                ? "Private groups require a code to join. Only people with the code can join your group." 
                : "Public groups can be joined by anyone with the group code."}
            </p>
          </div>

          <div className="bg-blue-500/20 p-4 rounded-md">
            <h3 className="text-sm font-medium text-white">Group Leader Information</h3>
            <p className="mt-1 text-sm text-white/80">
              As the creator of this group, you will be the group leader. As a leader, you have the following privileges:
            </p>
            <ul className="mt-2 text-sm text-white/80 list-disc list-inside">
              <li>Invite new members to the group</li>
              <li>Remove members from the group</li>
              <li>Transfer leadership to another member</li>
              <li>Disband the group</li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create Group'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateHousehold; 