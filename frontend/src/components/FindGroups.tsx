import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Group {
  id: string;
  name: string;
  code: string;
  isPrivate: boolean;
  members: {
    id: string;
    username: string;
  }[];
}

const FindGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await axios.get<Group[]>('/api/households');
        setGroups(data);
      } catch (err) {
        setError('Failed to fetch groups');
        console.error('Error fetching groups:', err);
      }
    };

    fetchGroups();
  }, []);

  const handleJoinGroup = async (code: string) => {
    try {
      await axios.post(`/api/households/join/${code}`);
      // Refresh the groups list after joining
      const { data } = await axios.get<Group[]>('/api/households');
      setGroups(data);
    } catch (err) {
      setError('Failed to join group');
      console.error('Error joining group:', err);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <div key={group.id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">{group.name}</h3>
          <p className="text-sm text-gray-600">
            {group.isPrivate ? 'Private Group' : 'Public Group'}
          </p>
          <p className="text-sm text-gray-600">
            {group.members.length} member{group.members.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => handleJoinGroup(group.code)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Join Group
          </button>
        </div>
      ))}
    </div>
  );
};

export default FindGroups; 