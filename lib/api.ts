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

// Response interceptor for network error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error (no response received)
      const networkError = new Error('Oops! We couldn\'t connect to the server. Please check your internet connection and try again.');
      networkError.name = 'NetworkError';
      throw networkError;
    }

    // Server responded with error status
    if (error.response.status >= 500) {
      const serverError = new Error('Server Error: The server is currently unavailable. Please try again later.');
      serverError.name = 'ServerError';
      throw serverError;
    }

    // For other errors, re-throw as is
    throw error;
  }
);

// API Functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  signup: (data: unknown) => api.post('/api/auth/signup', data),
};

export const billsAPI = {
  getAll: () => api.get('/api/billing'),
  getMyBills: () => api.get('/api/bills/my-bills'),
  create: (data: unknown) => api.post('/api/bills', data),
};

export const paymentsAPI = {
  getAll: () => api.get('/api/payments'),
  getMyPayments: () => api.get('/api/payments/my-payments'),
  create: (data: unknown) => api.post('/api/payments', data),
};

export const meterReadingsAPI = {
  getAll: () => api.get('/api/meter-readings'),
  create: (data: unknown) => api.post('/api/meter-readings', data),
};

export const incidentsAPI = {
  getAll: () => api.get('/api/issues'),
  getById: (id: number | string) => api.get(`/api/issues/${id}`),
  create: (data: unknown) => api.post('/api/issues', data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/api/issues/${id}`, { status }),
  scheduleFix: (id: number | string, fixingDate: string) =>
    api.put(`/api/issues/${id}`, { fixingDate }),
  resolveIssue: (id: number | string, resolvedDate: string) =>
    api.put(`/api/issues/${id}`, { isResolved: true, resolvedDate }),
  sendResolutionReminder: (id: number | string) =>
    api.post(`/api/issues/${id}/send-reminder`, {}),
};

export const usersAPI = {
  getAll: () => api.get('/api/users'),
  // Try a dedicated consumers endpoint first, fall back to fetching all users and filtering by role name or role_id.
  getConsumers: async () => {
    // Fetch all users and filter client-side for role === 'Consumer'
    const res = await api.get('/api/users');
    const data = res.data;
    // Normalize possible response shapes: array, { users: [...] }, { data: [...] }
    const list: Record<string, unknown>[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.users)
      ? data.users
      : Array.isArray(data?.data)
      ? data.data
      : [];

    const consumers = list.filter((u: Record<string, unknown>) => {
      const roleName = (u?.role as Record<string, unknown>)?.name ?? u?.role_name ?? null;
      const roleId = u?.role_id ?? (u?.role as Record<string, unknown>)?.id ?? null;
      return (
        (typeof roleName === 'string' && roleName.toLowerCase() === 'consumer') ||
        roleId === '3' ||
        roleId === 3
      );
    });

    // Return an object shaped like a minimal axios response with `data` containing the consumers array.
    return {
      ...res,
      data: consumers,
    };
  },
  create: (data: unknown) => api.post('/api/users', data),
  update: (id: number | string, data: unknown) => api.put(`/api/users/${id}`, data),
  remove: (id: number | string) => api.delete(`/api/users/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getBillStats: () => api.get('/api/admin/bill-stats'),
};

export const notificationsAPI = {
  getAll: () => api.get('/api/notifications'),
  registerDeviceToken: (token: string) => api.post('/api/register-device-token', { token }),
};

export default api;