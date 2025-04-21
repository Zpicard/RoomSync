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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
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
  getProfile: () => apiClient.get('/auth/profile'),
};

// Household endpoints
export const household = {
  create: (name: string) => apiClient.post('/households', { name }),
  join: (code: string) => apiClient.post('/households/join', { code }),
  leave: (householdId: string) => apiClient.post(`/households/${householdId}/leave`),
  getCurrent: () => apiClient.get('/households/current'),
  getMembers: (householdId: string) => apiClient.get(`/households/${householdId}/members`),
};

// Task endpoints
export const tasks = {
  create: (householdId: string, data: { title: string; description: string; dueDate: string; assignedTo?: string }) =>
    apiClient.post(`/tasks`, { ...data, householdId }),
  getHouseholdTasks: (householdId: string) =>
    apiClient.get(`/tasks/household/${householdId}`),
  updateStatus: (taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'PENDING' | 'COMPLETED' | 'OVERDUE') =>
    apiClient.patch(`/tasks/${taskId}/status`, { status }),
  assignTask: (taskId: string, userId: string) =>
    apiClient.patch(`/tasks/${taskId}/assign`, { userId }),
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

export default apiClient; 