import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { household } from '../../api/client';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface HouseholdResponse {
  id: string;
  name: string;
}

const JoinHousehold: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Household code is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await household.join(code);
      const householdData = response.data as HouseholdResponse;
      
      // Update the user's householdId in the auth context
      if (user) {
        const updatedUser = { ...user, householdId: householdData.id };
        updateUser(updatedUser);
      }
      
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to join household. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
            Join a Household
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Enter the household code to join an existing household
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
            </div>
          )}
          
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Household Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-neutral-800 dark:text-white"
              placeholder="Enter household code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Ask the household owner for the code to join their household.
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
              Join Household
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinHousehold; 