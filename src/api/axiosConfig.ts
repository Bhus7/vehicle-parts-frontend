import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5037/api',
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

export default api;
