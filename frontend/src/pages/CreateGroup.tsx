import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { household, auth } from '../api/client';
import AuthLayout from '../components/auth/AuthLayout';
import { User } from '../types/user';

interface UserResponse {
  data: User;
}

const CreateGroup: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create the household
      const householdResponse = await household.create({ name });
      
      // Fetch updated user profile
      const userResponse = await auth.getProfile() as UserResponse;
      const updatedUser = userResponse.data;
      
      // Update user state with the new information
      updateUser(updatedUser);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create a New Group"
      subtitle="Start managing your shared living space"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 text-red-900 dark:text-red-200 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Group name
          </label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Enter your group name"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            This will be the name of your shared living space group.
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating group...' : 'Create group'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default CreateGroup; 