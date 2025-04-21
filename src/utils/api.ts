import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Guests API
export const guests = {
  add: (data: { guestName: string; arrivalTime: string; notes?: string }) =>
    api.post('/guests', data),
  getAll: () => api.get('/guests'),
  update: (id: number, data: { departureTime?: string; notes?: string }) =>
    api.patch(`/guests/${id}`, data),
};

// Connections API
export const connections = {
  sendRequest: (data: { receiverEmail: string }) =>
    api.post('/connections', data),
  respondToRequest: (connectionId: number, data: { status: 'accepted' | 'rejected' }) =>
    api.patch(`/connections/${connectionId}`, data),
  getAll: () => api.get('/connections'),
};

export default api; 