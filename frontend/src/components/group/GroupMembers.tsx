import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { household } from '../../api/client';
import { 
  UserCircleIcon, 
  UserPlusIcon, 
  UserMinusIcon, 
  StarIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import NoHouseholdMessage from '../common/NoHouseholdMessage';

interface GroupMember {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  lastActive?: string;
}

interface GroupInfo {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  members: GroupMember[];
  createdAt: string;
}

const GroupMembers: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!user?.householdId) {
        setLoading(false);
        return;
      }

      try {
        const response = await household.getDetails(user.householdId);
        setGroupInfo(response.data as GroupInfo);
      } catch (error) {
        console.error('Error fetching group info:', error);
        toast.error('Failed to load group members');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupInfo();
  }, [user?.householdId]);

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!user?.householdId) {
      toast.error('You are not a member of any group');
      return;
    }

    try {
      setLoading(true);
      await household.invite(user.householdId, inviteEmail);
      toast.success('Invitation sent successfully');
      setShowInviteModal(false);
      setInviteEmail('');
      
      // Refresh group info
      const response = await household.getDetails(user.householdId);
      setGroupInfo(response.data as GroupInfo);
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send invitation. Please try again.';
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        toast.error('User not found. Please make sure they have registered for the app.');
      } else if (error.response?.status === 400) {
        toast.error(errorMessage);
      } else {
        toast.error('Failed to send invitation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!user?.householdId) {
      toast.error('You are not a member of any group');
      return;
    }

    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      setLoading(true);
      await household.kickMember(user.householdId, memberId);
      toast.success('Member removed successfully');
      
      // Refresh group info
      const response = await household.getDetails(user.householdId);
      setGroupInfo(response.data as GroupInfo);
    } catch (error: any) {
      console.error('Error removing member:', error);
      const errorMessage = error.response?.data?.error || 'Failed to remove member. Please try again.';
      
      if (error.response?.status === 403) {
        toast.error('Only the group owner can remove members.');
      } else if (error.response?.status === 404) {
        toast.error('Member not found in this group.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTransferOwnership = async (memberId: string) => {
    if (!user?.householdId) {
      toast.error('You are not a member of any group');
      return;
    }

    if (!window.confirm('Are you sure you want to transfer ownership to this member?')) {
      return;
    }

    try {
      setLoading(true);
      await household.transferOwnership(user.householdId, memberId);
      toast.success('Ownership transferred successfully');
      
      // Refresh group info
      const response = await household.getDetails(user.householdId);
      setGroupInfo(response.data as GroupInfo);
    } catch (error: any) {
      console.error('Error transferring ownership:', error);
      const errorMessage = error.response?.data?.error || 'Failed to transfer ownership. Please try again.';
      
      if (error.response?.status === 403) {
        toast.error('Only the group owner can transfer ownership.');
      } else if (error.response?.status === 400) {
        if (errorMessage.includes('yourself')) {
          toast.error('You cannot transfer ownership to yourself.');
        } else if (errorMessage.includes('member')) {
          toast.error('The selected user must be a member of the group.');
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user?.householdId || !groupInfo) {
    return <NoHouseholdMessage 
      title="No Group Found" 
      message="You need to join or create a household to view group members." 
    />;
  }

  const isOwner = user.id === groupInfo.ownerId;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {groupInfo.name}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Group Code: {groupInfo.code}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created on {formatDate(groupInfo.createdAt)}
              </p>
            </div>
            {isOwner && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Invite Member
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {groupInfo.members.map((member) => (
            <div
              key={member.id}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={`${member.username}'s avatar`}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                      <UserCircleIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {member.username}
                      </h3>
                      {member.id === groupInfo.ownerId && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                          <StarIcon className="w-4 h-4 mr-1" />
                          Owner
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                    {member.lastActive && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Last active: {formatDate(member.lastActive)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowMemberDetails(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => window.location.href = `mailto:${member.email}`}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                  </button>
                  {isOwner && member.id !== user.id && (
                    <>
                      <button
                        onClick={() => handleTransferOwnership(member.id)}
                        className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        title="Transfer Ownership"
                      >
                        <StarIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Remove Member"
                      >
                        <UserMinusIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Invite Member Modal */}
      {showInviteModal && (
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
                    <UserPlusIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Invite New Member
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter the email address of the person you want to invite to join your group.
                      </p>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleInviteMember}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
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

      {/* Member Details Modal */}
      {showMemberDetails && selectedMember && (
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
                    <UserCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Member Details
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <strong>Username:</strong> {selectedMember.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <strong>Email:</strong> {selectedMember.email}
                      </p>
                      {selectedMember.lastActive && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong>Last Active:</strong> {formatDate(selectedMember.lastActive)}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <strong>Role:</strong> {selectedMember.id === groupInfo.ownerId ? 'Group Owner' : 'Member'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowMemberDetails(false);
                    setSelectedMember(null);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMembers; 