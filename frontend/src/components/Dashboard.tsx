import React from 'react';
import QuietTime from './QuietTime';

interface DashboardProps {
  householdId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ householdId }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <QuietTime householdId={householdId} />
          </div>
        </div>
        {/* Add other dashboard sections here */}
      </div>
    </div>
  );
};

export default Dashboard; 