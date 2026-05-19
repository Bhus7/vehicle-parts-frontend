import axios from 'axios';

const API_BASE_URL = 'http://localhost:5037/api'; // HTTP to avoid SSL certificate issues

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const staffApi = {
  registerCustomer: (data: any) => api.post('/Staff/register-customer', data),
  getCustomer: (id: number) => api.get(`/Staff/customer/${id}`),
  getDashboardStats: () => api.get('/Staff/dashboard-stats'),
  searchCustomers: (query: string) => api.get('/Staff/find-all-customers', {
    params: query ? { query } : {}
  }),
  getReports: () => api.get('/Staff/reports/customers'),
  getInvoice: (id: number) => api.get(`/Staff/invoice/${id}`),
  createSale: (data: any) => api.post('/Staff/create-sale', data),
  getParts: () => api.get('/Staff/parts'),
  sendInvoiceEmail: (id: number) => api.post(`/Staff/invoice/${id}/send-email`),
};

export const appointmentApi = {
  create: (data: any) => api.post('/Appointments', data),
};

export const userApi = {
  login: (data: any) => api.post('/Customers/login', data),
  register: (data: any) => api.post('/Customers/register', data),
};

export default api;
