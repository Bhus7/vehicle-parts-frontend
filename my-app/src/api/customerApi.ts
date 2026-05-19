import axios from 'axios';

const API_BASE_URL = 'https://localhost:7278/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Authentication & User Management ───────────────────────────────
export const authApi = {
  register: (data: any) => api.post('/Customers/register', data),
  login: (data: any) => api.post('/Customers/login', data),
  logout: () => api.post('/Customers/logout'),
  getAllCustomers: () => api.get('/Customers'),
};

// ─── Profile Management ─────────────────────────────────────────────
export const profileApi = {
  getProfile: (id: number) => api.get(`/Customers/${id}/profile`),
  updateProfile: (id: number, data: any) => api.put(`/Customers/${id}/profile`, data),
};

// ─── Vehicle Management ─────────────────────────────────────────────
export const vehicleApi = {
  getAll: (customerId: number) => api.get(`/Customers/${customerId}/vehicles`),
  create: (customerId: number, data: any) => api.post(`/Customers/${customerId}/vehicles`, data),
  update: (customerId: number, vehicleId: number, data: any) =>
    api.put(`/Customers/${customerId}/vehicles/${vehicleId}`, data),
};

// ─── Appointment Management ─────────────────────────────────────────
export const appointmentApi = {
  getAll: (customerId: number) => api.get(`/Customers/${customerId}/appointments`),
  create: (customerId: number, data: any) =>
    api.post(`/Customers/${customerId}/appointments`, data),
  delete: (customerId: number, appointmentId: number) =>
    api.delete(`/Customers/${customerId}/appointments/${appointmentId}`),
};

export const partRequestApi = {
  getAll: (customerId: number) => api.get(`/Customers/${customerId}/part-requests`),
  create: (customerId: number, data: any) =>
    api.post(`/Customers/${customerId}/part-requests`, data),
};

// ─── Customer History ───────────────────────────────────────────────
export const historyApi = {
  getHistory: (customerId: number) => api.get(`/Customers/${customerId}/history`),
};

// ─── Reviews ────────────────────────────────────────────────────────
export const reviewApi = {
  getReviewableAppointments: (customerId: number) => api.get(`/Customers/${customerId}/reviewable-appointments`),
  getReviews: (customerId: number) => api.get(`/Customers/${customerId}/reviews`),
  submitReview: (customerId: number, data: any) => api.post(`/Customers/${customerId}/reviews`, data),
};

export default api;
