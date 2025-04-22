import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { household } from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface Group {
  id: string;
  name: string;
  code: string;
  isPrivate: boolean;
  ownerId: string;
  members: {
    id: string;
    username: string;
  }[];
  isUserMember: boolean;
  memberCount: number;
}

interface HouseholdsResponse {
  currentHouseholdId: string | null;
  households: Group[];
}

interface HouseholdResponse {
  id: string;
  name: string;
  code: string;
  isPrivate: boolean;
}

const FindGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [currentHouseholdId, setCurrentHouseholdId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await household.getAll();
      const { households, currentHouseholdId } = response.data as HouseholdsResponse;
      setGroups(households);
      setCurrentHouseholdId(currentHouseholdId);
    } catch (error) {
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = (group: Group) => {
    // Check if user is already a member of this group
    if (group.isUserMember) {
      toast.error('You are already a member of this group');
      return;
    }

    // If user is already in a group, redirect them to profile
    if (currentHouseholdId) {
      toast.error('Please go to your profile to leave or disband your current group first');
      navigate('/profile');
      return;
    }

    // Show confirmation dialog
    setSelectedGroup(group);
    setShowJoinConfirm(true);
  };

  const handleLeaveCurrentHousehold = async () => {
    if (!currentHouseholdId) return false;
    
    try {
      await household.leave(currentHouseholdId);
      toast.success('Successfully left your current group');
      return true;
    } catch (error) {
      console.error('Error leaving household:', error);
      toast.error('Failed to leave your current group');
      return false;
    }
  };

  const handleJoinGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      const response = await household.join(selectedGroup.code);
      const householdData = response.data as HouseholdResponse;
      
      // Update the user's householdId in the auth context
      if (user) {
        const updatedUser = { ...user, householdId: householdData.id };
        updateUser(updatedUser);
      }
      
      toast.success('Successfully joined the group!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error joining group:', error);
      
      if (error.response?.status === 400) {
        if (error.response?.data?.error === 'You are already a member of a household') {
          toast.error('Please go to your profile to leave your current group first');
          navigate('/profile');
        } else if (error.response?.data?.error?.includes('leader of another group')) {
          toast.error('Please go to your profile to disband your current group first');
          navigate('/profile');
        } else {
          toast.error(error.response?.data?.error || 'Failed to join group');
        }
      } else {
        toast.error('Failed to join group');
      }
    } finally {
      setShowJoinConfirm(false);
      setSelectedGroup(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Available Groups</h1>
        
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No groups available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <motion.div
                key={group.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
                  group.isUserMember ? 'ring-2 ring-primary-500' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{group.name}</h2>
                    <div className="flex gap-2">
                      {group.isUserMember && (
                        <span className="px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                          Current Group
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        group.isPrivate 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {group.isPrivate ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Members:</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((member) => (
                        <span
                          key={member.id}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm"
                        >
                          {member.username}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinClick(group)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                      group.isUserMember
                        ? 'bg-gray-100 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                        : group.isPrivate
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                    disabled={group.isPrivate || group.isUserMember}
                  >
                    {group.isPrivate 
                      ? 'Private Group' 
                      : group.isUserMember 
                        ? 'Current Group' 
                        : 'Join Group'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Join Confirmation Modal */}
      {showJoinConfirm && selectedGroup && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Join Group
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to join the group "{selectedGroup.name}"?
                      </p>
                      {currentHouseholdId && (
                        <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                          Note: You will leave your current group if you join this one.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleJoinGroup}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Join Group
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinConfirm(false);
                    setSelectedGroup(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindGroups; 