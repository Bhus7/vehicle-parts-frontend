import axios from 'axios';

// Requests go to Vite's dev proxy (/api/*) which forwards to https://localhost:7278
// This avoids self-signed certificate and CORS issues in development.
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token || user.Token) {
      config.headers.Authorization = `Bearer ${user.token || user.Token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ─── Staff API ────────────────────────────────────────────────────────────────
export const staffApi = {
  registerCustomer:  (data: any)       => api.post('/Staff/register-customer', data),
  getCustomer:       (id: number)      => api.get(`/Staff/customer/${id}`),
  getDashboardStats: ()                => api.get('/Staff/dashboard-stats'),
  searchCustomers:   (query: string)   => api.get('/Staff/find-all-customers', {
    params: query ? { query } : {}
  }),
  getReports:        ()                => api.get('/Staff/reports/customers'),
  getInvoice:        (id: number)      => api.get(`/Staff/invoice/${id}`),
  createSale:        (data: any)       => api.post('/Staff/create-sale', data),
  getParts:          ()                => api.get('/Staff/parts'),
  sendInvoiceEmail:  (id: number)      => api.post(`/Staff/invoice/${id}/send-email`),
};

// ─── Customer Auth API ────────────────────────────────────────────────────────
export const userApi = {
  login:    (data: any) => api.post('/Customers/login', data),
  register: (data: any) => api.post('/Customers/register', data),
  logout:   ()          => api.post('/Customers/logout'),
};

// ─── Customer Profile & Vehicle API ──────────────────────────────────────────
export const customerApi = {
  // Profile
  getProfile:    (id: number)                      => api.get(`/Customers/${id}/profile`),
  updateProfile: (id: number, data: any)           => api.put(`/Customers/${id}/profile`, data),

  // Vehicles
  getVehicles:   (id: number)                      => api.get(`/Customers/${id}/vehicles`),
  addVehicle:    (id: number, data: any)           => api.post(`/Customers/${id}/vehicles`, data),
  updateVehicle: (id: number, vehicleId: number, data: any) =>
                   api.put(`/Customers/${id}/vehicles/${vehicleId}`, data),

  // Appointments
  getAppointments:    (id: number)                 => api.get(`/Customers/${id}/appointments`),
  bookAppointment:    (id: number, data: any)      => api.post(`/Customers/${id}/appointments`, data),
  cancelAppointment:  (id: number, apptId: number) => api.delete(`/Customers/${id}/appointments/${apptId}`),

  // Part Requests
  getPartRequests: (id: number)                    => api.get(`/Customers/${id}/part-requests`),
  submitPartRequest: (id: number, data: any)       => api.post(`/Customers/${id}/part-requests`, data),

  // Reviews
  getReviewableAppointments: (id: number)          => api.get(`/Customers/${id}/reviewable-appointments`),
  getReviews:                (id: number)          => api.get(`/Customers/${id}/reviews`),
  submitReview:              (id: number, data: any) => api.post(`/Customers/${id}/reviews`, data),

  // History (Section 14)
  getHistory: (id: number)                         => api.get(`/Customers/${id}/history`),
};

// ─── Legacy / Shared API ──────────────────────────────────────────────────────
export const appointmentApi = {
  create: (data: any) => api.post('/Appointments', data),
};

export const partsApi = {
  getParts: () => api.get('/Parts'),
};

export default api;
