import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { household } from '../../api/client';
import toast from 'react-hot-toast';

const CreateHousehold: React.FC = () => {
  const [name, setName] = useState('');
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
      console.log('Creating group with name:', name.trim());
      const response = await household.create({ name: name.trim() });
      console.log('Group creation response:', response);
      
      if (!response || !response.id) {
        throw new Error('Invalid response from server');
      }
      
      const updatedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        householdId: response.id
      };
      
      updateUser(updatedUser);
      toast.success('Group created successfully! You are now the group leader.');
      navigate('/dashboard');
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a New Group</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white"
              placeholder="Enter group name"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Choose a name for your group that all members will recognize.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">Group Leader Information</h3>
            <p className="mt-1 text-sm text-blue-700">
              As the creator of this group, you will be the group leader. As a leader, you have the following privileges:
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>Invite new members to the group</li>
              <li>Remove members from the group</li>
              <li>Transfer leadership to another member</li>
              <li>Disband the group</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateHousehold; 