import axios from 'axios';

// ✅ DYNAMIC - Uses environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API URL:', API_URL); // Helpful for debugging

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - adds token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Board endpoints (for TaskFlow)
export const boardAPI = {
  getAll: () => api.get('/boards'),
  create: (boardData) => api.post('/boards', boardData),
  getOne: (id) => api.get(`/boards/${id}`),
};

// Task endpoints
export const taskAPI = {
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Portfolio endpoints
export const portfolioAPI = {
  getProjects: () => api.get('/projects'),
  getBlogPosts: () => api.get('/blog'),
  sendContact: (data) => api.post('/contact', data),
};

export default api;