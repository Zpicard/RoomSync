import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear token and redirect on 401 if it's not a login request or household creation
    if (error.response?.status === 401 && 
        !error.config.url?.includes('/auth/login') && 
        !error.config.url?.includes('/households')) {
      localStorage.removeItem('token');
      localStorage.removeItem('householdId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) =>
    apiClient.post('/auth/register', { username, email, password }),
  verifyToken: () => apiClient.get('/auth/verify'),
  getProfile: () => apiClient.get('/profile'),
};

interface HouseholdCreateInput {
  name: string;
  isPrivate?: boolean;
}

interface HouseholdResponse {
  id: string;
  name: string;
  code: string;
  isPrivate: boolean;
}

// Household endpoints
export const household = {
  create: async (data: HouseholdCreateInput): Promise<HouseholdResponse> => {
    const response = await apiClient.post<HouseholdResponse>('/households', data);
    return response.data;
  },
  getAll: () => apiClient.get('/households'),
  join: (code: string) => apiClient.post('/households/join', { code }),
  leave: (householdId: string) => {
    console.log('API: Leaving household', householdId);
    return apiClient.post<{ message: string }>(`/households/${householdId}/leave`)
      .catch(error => {
        console.error('Error in leave API call:', error);
        throw error;
      });
  },
  getCurrent: () => apiClient.get('/households/current'),
  getMembers: (householdId: string) => apiClient.get(`/households/${householdId}/members`),
  getDetails: (householdId: string) => apiClient.get(`/households/${householdId}`),
  transferOwnership: (householdId: string, newOwnerId: string) => 
    apiClient.post(`/households/${householdId}/transfer-ownership`, { newOwnerId }),
  disband: (householdId: string) => {
    console.log('API: Disbanding household', householdId);
    return apiClient.post(`/households/${householdId}/disband`);
  },
  kickMember: (householdId: string, memberId: string) => {
    console.log('API: Kicking member', memberId, 'from household', householdId);
    return apiClient.post<{ message: string }>(`/households/${householdId}/kick/${memberId}`);
  },
  invite: (householdId: string, email: string) => {
    console.log('API: Inviting member', email, 'to household', householdId);
    return apiClient.post<{ message: string }>(`/households/${householdId}/invite`, { email });
  },
};

// Task endpoints
export const tasks = {
  create: (householdId: string, data: { title: string; description: string; dueDate: string; assignedToId?: string }) =>
    apiClient.post(`/tasks`, { ...data, householdId }),
  createForAllMembers: (householdId: string, data: { title: string; description: string; dueDate: string }) =>
    apiClient.post(`/tasks/all-members`, { ...data, householdId }),
  getHouseholdTasks: (householdId: string) =>
    apiClient.get(`/tasks/household/${householdId}`),
  updateStatus: (taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'PENDING' | 'COMPLETED' | 'OVERDUE') =>
    apiClient.patch(`/tasks/${taskId}/status`, { status }),
  assignTask: (taskId: string, userId: string) =>
    apiClient.patch(`/tasks/${taskId}/assign`, { userId }),
  delete: (taskId: string) =>
    apiClient.delete(`/tasks/${taskId}`),
};

// Guest announcement endpoints
export const guests = {
  create: (householdId: string, data: { guestCount: number; startTime: string; endTime: string; description?: string }) =>
    apiClient.post(`/guests`, { ...data, householdId }),
  getHouseholdAnnouncements: (householdId: string) =>
    apiClient.get(`/guests/household/${householdId}`),
  update: (announcementId: string, data: { guestCount?: number; startTime?: string; endTime?: string; description?: string }) =>
    apiClient.patch(`/guests/${announcementId}`, data),
  delete: (announcementId: string) =>
    apiClient.delete(`/guests/${announcementId}`),
};

export const user = {
  updateAvatar: (avatarUrl: string) =>
    apiClient.patch('/profile/avatar', { avatarUrl }),
  getProfile: () =>
    apiClient.get('/users/profile'),
};

export const quietTimes = {
  create: (data: {
    title: string;
    type: 'exam' | 'study' | 'quiet';
    startTime: string;
    endTime: string;
    description?: string;
    householdId: string;
  }) => apiClient.post('/quiet-times', data),
  
  getHouseholdQuietTimes: (householdId: string) =>
    apiClient.get(`/quiet-times/household/${householdId}`),
    
  delete: (quietTimeId: string) =>
    apiClient.delete(`/quiet-times/${quietTimeId}`),
};

export default apiClient; 