import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  UserGroupIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { household } from '../../api/client';
import toast from 'react-hot-toast';
import AvatarUpload from './AvatarUpload';
import { User } from '../../types/user';

interface HouseholdInfo {
  id: string;
  name: string;
  code: string;
  isPrivate: boolean;
  ownerId: string;
  members: Array<{
    id: string;
    username: string;
    email: string;
  }>;
}

interface LeaveHouseholdResponse {
  message: string;
}

const Profile: React.ComponentType = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);
  const [showDisbandConfirm, setShowDisbandConfirm] = useState(false);
  const [showKickConfirm, setShowKickConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [memberToKick, setMemberToKick] = useState<string | null>(null);
  const [householdInfo, setHouseholdInfo] = useState<HouseholdInfo | null>(null);

  useEffect(() => {
    const fetchHouseholdInfo = async () => {
      if (user?.householdId) {
        setLoading(true);
        try {
          const response = await household.getDetails(user.householdId);
          setHouseholdInfo(response.data as HouseholdInfo);
        } catch (err) {
          setError('Failed to fetch group information');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHouseholdInfo();
  }, [user?.householdId]);

  const handleLeaveHousehold = async () => {
    if (!user?.householdId) {
      toast.error('You are not a member of any group');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting to leave household:', user.householdId);
      
      // Call API to leave household
      await household.leave(user.householdId);
      
      // Update user context - remove householdId
      if (user) {
        const updatedUser = { ...user, householdId: undefined };
        console.log('Updating user context:', updatedUser);
        updateUser(updatedUser);
        setHouseholdInfo(null);
        
        // Also remove householdId from localStorage
        localStorage.removeItem('householdId');
      }
      
      setShowLeaveConfirm(false);
      toast.success('Successfully left group');
      navigate('/');
    } catch (error: any) {
      console.error('Error leaving group:', error);
      const errorMessage = error.response?.data?.message || 'Failed to leave group. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setShowLeaveConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!user?.householdId || !selectedMember) {
      toast.error('Please select a member to transfer ownership to');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await household.transferOwnership(user.householdId, selectedMember);
      toast.success('Ownership transferred successfully');
      setShowTransferConfirm(false);
      setSelectedMember(null);
      
      // Refresh household info
      const response = await household.getDetails(user.householdId);
      setHouseholdInfo(response.data as HouseholdInfo);
    } catch (error: any) {
      console.error('Error transferring ownership:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to transfer ownership. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setShowTransferConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDisbandHousehold = async () => {
    if (!user?.householdId) {
      toast.error('You are not a member of any group');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting to disband household:', user.householdId);
      
      // Call API to disband household
      const response = await household.disband(user.householdId);
      console.log('Disband household response:', response);
      
      // Update user context - remove householdId
      if (user) {
        const updatedUser = { ...user, householdId: undefined };
        console.log('Updating user context:', updatedUser);
        updateUser(updatedUser);
        setHouseholdInfo(null);
        
        // Also remove householdId from localStorage
        localStorage.removeItem('householdId');
      }
      
      setShowDisbandConfirm(false);
      toast.success('Group disbanded successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Error disbanding group:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to disband group. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setShowDisbandConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKickMember = async () => {
    if (!user?.householdId || !memberToKick) {
      toast.error('Missing information to kick member');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting to kick member:', memberToKick, 'from household:', user.householdId);
      
      // Call API to kick member
      await household.kickMember(user.householdId, memberToKick);
      
      // Refresh household info
      const response = await household.getDetails(user.householdId);
      setHouseholdInfo(response.data as HouseholdInfo);
      
      setShowKickConfirm(false);
      setMemberToKick(null);
      toast.success('Member kicked successfully');
    } catch (error: any) {
      console.error('Error kicking member:', error);
      const errorMessage = error.response?.data?.message || 'Failed to kick member. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setShowKickConfirm(false);
      setMemberToKick(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center space-x-4 mb-6">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.username}'s Bitmoji`}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
              <UserCircleIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.username}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <AvatarUpload />

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <HomeIcon className="w-5 h-5 text-primary-500 dark:text-primary-400 mr-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Group</h3>
            </div>
            {householdInfo ? (
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {householdInfo.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Code: {householdInfo.code}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Type: {householdInfo.isPrivate ? 'Private Group' : 'Public Group'}
                </p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* Debug info */}
                  <div className="w-full text-xs text-gray-400 dark:text-gray-500 mb-2">
                    <p>User ID: {user?.id}</p>
                    <p>Owner ID: {householdInfo.ownerId}</p>
                    <p>Is Owner: {householdInfo.ownerId === user?.id ? 'Yes' : 'No'}</p>
                  </div>
                  
                  {/* Show these buttons only to the group owner */}
                  {householdInfo.ownerId === user?.id && (
                    <>
                      {householdInfo.members.length > 1 && (
                        <>
                          <button
                            onClick={() => setShowTransferConfirm(true)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-300 dark:bg-primary-900 dark:hover:bg-primary-800"
                          >
                            <UserGroupIcon className="w-4 h-4 mr-1" />
                            Transfer Ownership
                          </button>
                          <button
                            onClick={() => setShowKickConfirm(true)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-900 dark:hover:bg-yellow-800"
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1" />
                            Remove Member
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setShowDisbandConfirm(true)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900 dark:hover:bg-red-800"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Disband Group
                      </button>
                    </>
                  )}
                  
                  {/* Show this button only to group members (not the owner) */}
                  {householdInfo.ownerId !== user?.id && (
                    <button
                      onClick={() => setShowLeaveConfirm(true)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900 dark:hover:bg-red-800"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1" />
                      Leave Group
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You are not a member of any group
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => navigate('/create-household')}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                  >
                    Create Group
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button
                    onClick={() => navigate('/join-household')}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                  >
                    Join Group
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-primary-500 dark:text-primary-400 mr-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Account</h3>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Leave Group Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Leave Group
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to leave this group? You will need to be invited back to rejoin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleLeaveHousehold}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Leaving...' : 'Leave Group'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {showTransferConfirm && householdInfo && (
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 sm:mx-0 sm:h-10 sm:w-10">
                    <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Transfer Ownership
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select a member to transfer group ownership to:
                      </p>
                      <select
                        value={selectedMember || ''}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select a member</option>
                        {householdInfo.members
                          .filter(member => member.id !== user?.id)
                          .map(member => (
                            <option key={member.id} value={member.id}>
                              {member.username} ({member.email})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleTransferOwnership}
                  disabled={loading || !selectedMember}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Transferring...' : 'Transfer Ownership'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTransferConfirm(false);
                    setSelectedMember(null);
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

      {/* Disband Group Confirmation Modal */}
      {showDisbandConfirm && householdInfo && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Disband Group
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to disband the group "{householdInfo.name}"? This action cannot be undone.
                      </p>
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        All members will be removed from the group and all group data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDisbandHousehold}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Disbanding...' : 'Disband Group'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDisbandConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kick Member Confirmation Modal */}
      {showKickConfirm && householdInfo && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 sm:mx-0 sm:h-10 sm:w-10">
                    <ArrowRightOnRectangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Remove Member
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select a member to remove from the group:
                      </p>
                      <select
                        value={memberToKick || ''}
                        onChange={(e) => setMemberToKick(e.target.value)}
                        className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select a member</option>
                        {householdInfo.members
                          .filter(member => member.id !== user?.id)
                          .map(member => (
                            <option key={member.id} value={member.id}>
                              {member.username} ({member.email})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleKickMember}
                  disabled={loading || !memberToKick}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Removing...' : 'Remove Member'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowKickConfirm(false);
                    setMemberToKick(null);
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

export default Profile; 