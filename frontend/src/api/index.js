import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const login = (data) => api.post('/auth/login', data);
export const changePassword = (data) => api.patch('/auth/password', data);
export const getUsers = () => api.get('/auth/users');
export const createUser = (data) => api.post('/auth/users', data);
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);

export const getCustomers = (params) => api.get('/customers', { params });
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const updateCustomerStatus = (id, status) => api.patch(`/customers/${id}/status`, { status });
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

export const getOrders = () => api.get('/orders');
export const getOrdersByCustomer = (customerId) => api.get(`/orders/customer/${customerId}`);
export const createOrder = (data) => api.post('/orders', data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export const getDashboardStats = () => api.get('/dashboard/stats');
