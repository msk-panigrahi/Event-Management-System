import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAllUsers: () => api.get('/auth/users'),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  updateUserRole: (id, role) => api.put(`/auth/users/${id}/role`, { role }),
};

export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getAllAdmin: () => api.get('/events/admin/all'),
  getById: (id) => api.get(`/events/${id}`),
  getFeatured: () => api.get('/events/featured'),
  getUpcoming: () => api.get('/events/upcoming'),
  getCategories: () => api.get('/events/categories'),
  create: (data) => api.post('/events', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/events/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/events/${id}`),
  togglePublish: (id) => api.patch(`/events/${id}/publish`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  getAll: () => api.get('/bookings/all'),
  getRecent: () => api.get('/bookings/recent'),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  verify: (ticketId) => api.post('/bookings/verify', { ticketId }),
  checkIn: (ticketId) => api.post('/bookings/checkin', { ticketId }),
};

export const paymentAPI = {
  mockPay: (data) => api.post('/payments/mock', data),
  razorpayOrder: (data) => api.post('/payments/razorpay/order', data),
  razorpayVerify: (data) => api.post('/payments/razorpay/verify', data),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  getAll: () => api.get('/payments/all'),
};

export const dashboardAPI = {
  getAdminStats: () => api.get('/dashboard/admin'),
  getUserStats: () => api.get('/dashboard/user'),
};

export const analyticsAPI = {
  getMonthlyRevenue: (year) => api.get('/analytics/revenue', { params: { year } }),
  getMonthlyBookings: (year) => api.get('/analytics/bookings', { params: { year } }),
  getPopularEvents: () => api.get('/analytics/popular-events'),
  getCategoryDistribution: () => api.get('/analytics/categories'),
  getBookingStatus: () => api.get('/analytics/booking-status'),
};

export const getImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80';
  if (path.startsWith('http')) return path;
  const base = API_URL.replace('/api', '');
  return `${base}${path}`;
};

export default api;
