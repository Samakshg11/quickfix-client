// src/api/client.js
import axios from 'axios';
import toast from 'react-hot-toast';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('qf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong.';
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('qf_token');
      localStorage.removeItem('qf_user');
      window.location.href = '/login';
    } else if (status !== 422) {
      // Don't toast validation errors — forms handle those inline
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default client;
