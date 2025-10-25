import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API Functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  signup: (data: any) => api.post('/api/auth/signup', data),
};

export const billsAPI = {
  getAll: () => api.get('/api/bills'),
  getMyBills: () => api.get('/api/bills/my-bills'),
  create: (data: any) => api.post('/api/bills', data),
};

export const paymentsAPI = {
  getAll: () => api.get('/api/payments'),
  getMyPayments: () => api.get('/api/payments/my-payments'),
  create: (data: any) => api.post('/api/payments', data),
};

export const meterReadingsAPI = {
  getAll: () => api.get('/api/meter-readings'),
  create: (data: any) => api.post('/api/meter-readings', data),
};

export const incidentsAPI = {
  getAll: () => api.get('/api/incidents'),
  create: (data: any) => api.post('/api/incidents', data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/api/incidents/${id}`, { status }),
};

export const usersAPI = {
  getAll: () => api.get('/api/users'),
  getConsumers: () => api.get('/api/users/consumers'),
};

export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
};

export default api;