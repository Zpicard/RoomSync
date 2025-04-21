import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { household } from '../../api/client';

interface HouseholdResponse {
  id: string;
  name: string;
  code: string;
}

const CreateHousehold: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string; name: string; code: string } | null>(null);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Household name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await household.create(name);
      const householdData = response.data as HouseholdResponse;
      
      // Update the user's householdId in the auth context
      if (user) {
        const updatedUser = { ...user, householdId: householdData.id };
        updateUser(updatedUser);
      }
      
      setSuccess(householdData);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create household. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
              Household Created!
            </h2>
            <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
              Your household "{success.name}" has been created successfully.
            </p>
          </div>
          
          <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4">
            <div className="text-sm text-green-700 dark:text-green-200">
              <p className="font-medium">Household Code:</p>
              <p className="mt-1 text-lg font-mono">{success.code}</p>
              <p className="mt-2 text-xs">
                Share this code with others so they can join your household.
              </p>
            </div>
          </div>
          
          <div>
            <button
              onClick={handleContinue}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-900"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
            Create a Household
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Set up your household to start managing chores and guest announcements
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Household Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-neutral-800 dark:text-white"
              placeholder="Enter household name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Enter any name for your household. This will be visible to all members.
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-900 disabled:opacity-50"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              Create Household
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHousehold; 