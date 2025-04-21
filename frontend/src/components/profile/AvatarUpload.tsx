import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { user } from '../../api/client';
import toast from 'react-hot-toast';
import { User } from '../../types/user';
import AvatarSelection from './AvatarSelection';

const AvatarUpload: React.FC = () => {
  const { user: currentUser, updateUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const response = await user.updateAvatar(avatarUrl.trim());
      const userData = response.data as Partial<User>;
      // Preserve the householdId when updating the user
      updateUser({
        ...userData,
        householdId: currentUser?.householdId
      } as User);
      toast.success(avatarUrl.trim() ? 'Avatar updated successfully!' : 'Avatar removed successfully!');
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      toast.error(error.response?.data?.message || 'Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Avatar</h3>
      
      {currentUser?.avatarUrl && (
        <div className="mb-4">
          <img
            src={currentUser.avatarUrl}
            alt="Your Avatar"
            className="w-24 h-24 rounded-full mx-auto"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select an Avatar
          </label>
          <AvatarSelection
            selectedUrl={avatarUrl}
            onSelect={setAvatarUrl}
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Avatar'}
          </button>
          {currentUser?.avatarUrl && (
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const response = await user.updateAvatar('');
                  const userData = response.data as Partial<User>;
                  // Preserve the householdId when removing the avatar
                  updateUser({
                    ...userData,
                    householdId: currentUser?.householdId
                  } as User);
                  setAvatarUrl('');
                  toast.success('Avatar removed successfully!');
                } catch (error: any) {
                  console.error('Error removing avatar:', error);
                  toast.error(error.response?.data?.message || 'Failed to remove avatar');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Remove Avatar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AvatarUpload; 