import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

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
