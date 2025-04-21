import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { household } from '../../api/client';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface HouseholdResponse {
  id: string;
  name: string;
  code: string;
  isPrivate: boolean;
}

const JoinHousehold: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error('Group code is required');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to join a group');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      const response = await household.join(code.trim().toUpperCase());
      const householdData = response.data as HouseholdResponse;
      
      // Update the user's householdId in the auth context
      if (user) {
        const updatedUser = { ...user, householdId: householdData.id };
        updateUser(updatedUser);
      }
      
      toast.success('Successfully joined the group!');
      navigate('/');
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Invalid group code. Please check and try again.');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.error || 'You are already a member of a group');
      } else {
        toast.error('Failed to join group. Please try again.');
      }
      console.error('Error joining group:', error);
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
        <h2 className="text-2xl font-bold text-white mb-6">Join a Group</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-white/90">
              Group Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-gray-900 bg-white/90 uppercase"
              placeholder="Enter group code"
              required
            />
            <p className="mt-1 text-sm text-white/70">
              Enter the code provided by the group leader to join their group.
            </p>
          </div>

          <div className="bg-blue-500/20 p-4 rounded-md">
            <h3 className="text-sm font-medium text-white">Group Types</h3>
            <div className="mt-2 space-y-2">
              <div>
                <h4 className="text-sm font-medium text-white/90">Public Groups</h4>
                <p className="text-sm text-white/80">
                  Anyone with the group code can join public groups.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white/90">Private Groups</h4>
                <p className="text-sm text-white/80">
                  Private groups require a code to join. Only people with the code can join these groups.
                </p>
              </div>
            </div>
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
                'Join Group'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default JoinHousehold; 