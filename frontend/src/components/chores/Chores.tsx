import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { tasks, household } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedToId?: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    username: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface Household {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  members: User[];
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const Chores: React.FC = () => {
  const { user } = useAuth();
  const [tasksList, setTasks] = useState<Task[]>([]);
  const [roommates, setRoommates] = useState<User[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentHouseholdId, setCurrentHouseholdId] = useState<string | null>(null);
  const [currentHousehold, setCurrentHousehold] = useState<Household | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedToId: '',
    isRecurring: false,
    recurringFrequency: 'weekly',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
        setIsLoading(true);
      setError(null);
      
      if (!user?.householdId) {
        setError('You are not a member of any household. Please join or create a household first.');
        setIsLoading(false);
        return;
      }
      
      setCurrentHouseholdId(user.householdId);
      
      // Get household details
      const householdResponse = await household.getDetails(user.householdId) as ApiResponse<Household>;
      if (householdResponse && householdResponse.data) {
        setCurrentHousehold(householdResponse.data);
        
        // Add current user to the roommates list if not already included
        const allMembers = [...householdResponse.data.members];
        const currentUserExists = allMembers.some(member => member.id === user.id);
        
        if (!currentUserExists && user.id) {
          allMembers.push({
            id: user.id,
            username: user.username || user.email,
            email: user.email
          });
        }
        
        setRoommates(allMembers);
      }
      
      // Fetch tasks for the household
      const tasksResponse = await tasks.getHouseholdTasks(user.householdId) as ApiResponse<Task[]>;
      if (tasksResponse && tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load chores data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTasks = async () => {
    if (!currentHouseholdId) return;
    
    try {
      setIsRefreshing(true);
      const response = await tasks.getHouseholdTasks(currentHouseholdId) as ApiResponse<Task[]>;
      if (response && response.data) {
        setTasks(response.data);
        toast.success('Tasks refreshed');
      }
    } catch (err) {
      console.error('Error refreshing tasks:', err);
      toast.error('Failed to refresh tasks');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateTask = async () => {
    if (!currentHouseholdId) {
      toast.error('No household selected');
      return;
    }
    
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    if (!newTask.dueDate) {
      toast.error('Due date is required');
      return;
    }
    
    try {
      setError(null);
      
      // If this is a recurring task, create it for all members
      if (newTask.isRecurring) {
        await tasks.createForAllMembers(currentHouseholdId, {
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate
        });
        toast.success('Recurring task created for all members');
      } else {
        // Create a single task
        await tasks.create(currentHouseholdId, {
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate,
          assignedToId: newTask.assignedToId || undefined
        });
        toast.success('Task created successfully');
      }
      
      setShowAddModal(false);
      setNewTask({ 
        title: '', 
        description: '', 
        dueDate: '', 
        assignedToId: '',
        isRecurring: false,
        recurringFrequency: 'weekly'
      });
      
      // Refresh tasks list
      refreshTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task. Please try again.');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: 'PENDING' | 'COMPLETED' | 'OVERDUE') => {
    try {
      setError(null);
      await tasks.updateStatus(taskId, status);
      toast.success(`Task marked as ${status.toLowerCase()}`);
      
      // Refresh tasks list
      refreshTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status. Please try again.');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setError(null);
      await tasks.delete(taskToDelete.id);
      toast.success('Task deleted successfully');
      setShowDeleteModal(false);
      setTaskToDelete(null);
      refreshTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!user?.householdId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          No Household Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You need to join or create a household to manage chores.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="/household/create" 
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Create Household
          </a>
          <a 
            href="/household/join" 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Join Household
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Chores</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            {currentHousehold ? `Managing chores for ${currentHousehold.name}` : 'Manage and track household chores'}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={refreshTasks}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            title="Refresh tasks"
          >
            <ArrowPathIcon className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        <button
          onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Chore
        </button>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 dark:bg-red-900/20 dark:border-red-400">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading chores...</p>
        </div>
      ) : tasksList.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <p className="text-lg">No chores added yet.</p>
          <p className="mt-2">Click the "Add Chore" button to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tasksList.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center mt-2">
                    <CalendarIcon className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mr-1" />
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      Due: {formatDate(task.dueDate)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {task.assignedTo ? `Assigned to: ${task.assignedTo.username}` : 'Unassigned'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <div className="flex space-x-2">
                    {task.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                        className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="Mark as completed"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                    {task.status !== 'OVERDUE' && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'OVERDUE')}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Mark as overdue"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task)}
                      className="p-1 text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                      title="Delete task"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Chore Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Add New Chore</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Chore Title"
                  className="w-full p-2 border rounded text-neutral-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                <textarea
                  placeholder="Description"
                  className="w-full p-2 border rounded text-neutral-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded text-neutral-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Assign To</label>
                <select
                  className="w-full p-2 border rounded text-neutral-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  value={newTask.assignedToId}
                  onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                >
                  <option value="">Select a roommate</option>
                  {roommates.map((roommate) => (
                    <option key={roommate.id} value={roommate.id}>
                      {roommate.username} {roommate.id === user?.id ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={newTask.isRecurring}
                  onChange={(e) => setNewTask({ ...newTask, isRecurring: e.target.checked })}
                />
                <label htmlFor="isRecurring" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                  Create for all members
                </label>
              </div>
              {newTask.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Frequency</label>
                  <select
                    className="w-full p-2 border rounded text-neutral-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                    value={newTask.recurringFrequency}
                    onChange={(e) => setNewTask({ ...newTask, recurringFrequency: e.target.value })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
              Delete Task
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Chores; 