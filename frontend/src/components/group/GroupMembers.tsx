import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { household } from '../../api/client';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface GroupMember {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface GroupInfo {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  members: GroupMember[];
}

const GroupMembers: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user?.householdId || !groupInfo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          No Group Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You are not currently a member of any group.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {groupInfo.name} Members
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Group Code: {groupInfo.code}
          </p>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {groupInfo.members.map((member) => (
            <div
              key={member.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center space-x-4">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={`${member.username}'s Bitmoji`}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                    <UserCircleIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {member.username}
                    {member.id === groupInfo.ownerId && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded">
                        Owner
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupMembers; 